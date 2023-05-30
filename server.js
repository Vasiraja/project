const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser=require('body-parser');
 const exec = require('child_process').exec;

const fileUpload=require('express-fileupload');
 
const { spawn } = require('child_process');
const { connect } = require('http2');
const path = require('path');


const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 
app.use(fileUpload());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mysql#7',
  database: 'iamneo',
  port: 3306,
});

connection.connect();
 

app.get('/api/challenges/:userId', (req, res) => {
  const {userId}=req.params;
  const query = `SELECT * FROM challenges where comp_id = '${userId}'`;
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.delete('/api/challenges/:challenge_id', (req, res) => {
  const {challenge_id} = req.params;
  const query = `DELETE FROM challenges WHERE challenge_id = ${challenge_id}`;
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

app.post('/api/register', (req, res) => {
 let email =  req.body.email;
   let Inst_name = req.body.Inst_name;
   let password = req.body.password;
   let confirmPassword = req.body.confirmPassword;
   if (password !== confirmPassword) {
    res.send({ message: "Password does not match" });
     return;  
  }
 let sql=`INSERT INTO inst_register (email,Inst_name,password,confirmPassword) values 
 ('${email}','${Inst_name}', '${password}', '${confirmPassword}')`;
 
 
   connection.query(sql, (error,result) => {
   if(error){
     res.send({message: error});
   }
   if(result)
   res.send({message:"Insertion success"});
  
  });
})
 




 app.post('/api/login/:Inst_name', async (req, res) => {
   const username = req.body.username;
  const password = req.body.password;
 
  // Use parameterized query to prevent SQL injection
  const sql = 'SELECT * FROM inst_register WHERE email = ? AND password = ?';
  connection.query(sql, [username, password], (error, result) => {
    if (error) {
      // Handle the error case
      console.error(error);
      res.status(500).send({ message: 'Internal server error' });
    } else if (result.length === 0) {
      // Handle the case where no user is found
      res.status(401).send({ message: 'Invalid credentials' });
    } else {
      // Handle the case where a user is found
      res.send({ message: 'Login successful' });

    }
  });
});


app.post('/api/update/:taskId', (req, res) => {
  const Institute = req.body.Institute;
  const AptbeginTime = req.body.AptbeginTime;
  const AptendTime = req.body.AptendTime;
  const no_ofReasoning = req.body.no_ofReasoning;
  const no_ofEnglish = req.body.no_ofEnglish;
  const no_ofmajor = req.body.no_ofmajor;
  const others = req.body.others;
  const reasoningmark = req.body.reasoningmark;
  const englishmark = req.body.englishmark;
  const majormark = req.body.majormark;
  const othermarks = req.body.othermarks;
  const comp_id = req.params.taskId;

  const reasontotal = no_ofReasoning * reasoningmark;
  const englishtotal = no_ofEnglish * englishmark;
  const majortotal = no_ofmajor * majormark;
  const othermark = others * othermarks;
  const total = no_ofReasoning + no_ofEnglish + no_ofmajor + others;
  const totalmarks = reasontotal + englishtotal + majortotal + othermark;

  const sql = `INSERT INTO challenges 
    (Institute, AptbeginTime, AptendTime, no_ofReasoning, no_ofEnglish, no_ofmajor, 
      others, reasoningmark, englishmark, majormark, othermarks, total, totalmarks, comp_id) 
      VALUES 
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [Institute, AptbeginTime, AptendTime, no_ofReasoning, no_ofEnglish, no_ofmajor, 
      others, reasoningmark, englishmark, majormark, othermarks, total, totalmarks, comp_id];

  connection.query(sql, values, (error, result) => {
    if (error) {
      console.log(error);
      res.send({ message: error });
    } else {
      res.send({message: "Insertion Success"});   
    }
  });
});


 

app.put('/api/challenges/:challenge_id', (req, res) => {
  const challenge_id = req.params.challenge_id;
  const task = req.body;

  connection.query('UPDATE challenges SET ? WHERE challenge_id = ?', [task, challenge_id], (err, result) => {
    if (err) {
      console.log('Error updating task:', err);
      res.status(500).send('Error updating task');
    } else if (result.affectedRows === 0) {
      console.log(`Task with challenge_id ${challenge_id} not found`);
      res.status(404).send(`Task with challenge_id ${challenge_id} not found`);
    } else {
      console.log(`Task with challenge_id ${challenge_id} updated successfully`);
      res.status(200).send(`Task with challenge_id ${challenge_id} updated successfully`);
    }
  });
});

app.post('/transcription', (req, res) => {
  // Extract the transcription text from the request body
  const text = req.body.text;
   
  // Respond with a success message
  const sql = "INSERT INTO text (text) VALUES (?)";
   const values = [text];
 
  connection.query(sql, values, (error, response) => {
    if (error) {
      res.send({ message: "There is an issue" });
    } else {
      res.send({ message: "Text inserted successfully" });
    }
  });
});





  // app.get('/transcription/:textid', (req, res) => {
  //   const {textid}=req.params;
  //    const sql = `SELECT text FROM text where textid = '${textid}'`;
   
  //   connection.query(sql, (err, results) => {
  //     if (err) throw err;
  //   res.json(results);
  //   });
  // })
  app.get('/transcribe/:textid', (req, res) => {
    const textid = req.params.textid;
    const sql = `SELECT * FROM text WHERE textid = ${textid}`;
    connection.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results[0]);
    });
  });
  



 


// app.post('/api/challenges/update/:userId', (req, res) => {
//    let challenge_id = req.body.challenge_id;
//   let Institute = req.body.Institute;
//   let AptbeginTime = req.body.AptbeginTime;
//   let AptendTime = req.body.AptendTime;
//   let no_ofReasoning = req.body.no_ofReasoning;
//   let no_ofEnglish = req.body.no_ofEnglish;
//   let no_ofmajor = req.body.no_ofmajor;
//   let others = req.body.others;
//   let reasoningmark = req.body.reasoningmark;
//   let englishmark = req.body.englishmark;
//   let majormark = req.body.majormark;
//   let othermarks = req.body.othermarks;
//   let comp_id = req.params.userId;

//   let reasontotal = no_ofReasoning * reasoningmark;
//   let englishtotal = no_ofEnglish * englishmark;
//   let majortotal = no_ofmajor * majormark;
//   let othermark = others * othermarks;
//   let total = no_ofReasoning + no_ofEnglish + no_ofmajor + others;
//   let totalmarks = reasontotal + englishtotal + majortotal + othermark;

//   let sql = `UPDATE challenges SET Institute='${Institute}', AptbeginTime='${AptbeginTime}', AptendTime='${AptendTime}', no_ofReasoning='${no_ofReasoning}', no_ofEnglish='${no_ofEnglish}', no_ofmajor='${no_ofmajor}', others='${others}', reasoningmark='${reasoningmark}', englishmark='${englishmark}', majormark='${majormark}', othermarks='${othermarks}', total='${total}', totalmarks='${totalmarks}' WHERE challenge_id='${challenge_id}' AND comp_id='${comp_id}'`;

//   connection.query(sql, (error, result) => {
//     if (error) {
//       res.send({ message: error });
//       console.log(error);
//     }
//     if (result.affectedRows == 0) {
//       res.send({ message: "Challenge not found" });
//     }
//     if (result.affectedRows == 1) {
//       res.send({ message: "Update success" });
//     }
//   });
// });


// app.put('/api/challenges/:id', (req, res) => {
//   const challengeId = req.params.id;
//   const { Institute, AptbeginTime, AptendTime, no_ofReasoning, no_ofEnglish, no_ofmajor, others, reasoningmark, englishmark, majormark, othermarks, total, totalmarks } = req.body;

//   const updateQuery = `
//     UPDATE challenges SET
//       Institute = '${Institute}',
//       AptbeginTime = '${AptbeginTime}',
//       AptendTime = '${AptendTime}',
//       no_ofReasoning = '${no_ofReasoning}',
//       no_ofEnglish = '${no_ofEnglish}',
//       no_ofmajor = '${no_ofmajor}',
//       others = '${others}',
//       reasoningmark = '${reasoningmark}',
//       englishmark = '${englishmark}',
//       majormark = '${majormark}',
//       othermarks = '${othermarks}',
//       total = '${total}',
//       totalmarks = '${totalmarks}'
//     WHERE
//       challenge_id = ${challengeId}
//   `;

//   connection.query(updateQuery, (err, result) => {
//     if (err) {
//       console.log(err);
//       res.send({ message: 'Error updating challenge' });
//     } else {
//       res.send({ message: 'Challenge updated successfully' });
//     }
//   });
// });






















//----------------__________________________Studetent_Database_________________________-----------------//
 
app.post('/api/stulogin', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Use parameterized query to prevent SQL injection
  const sql = 'SELECT * FROM sturegistration WHERE email = ? AND password = ?';
  connection.query(sql, [email, password], (error, result) => {
    if (error) {
      // Handle the error case
      console.error(error);
      res.status(500).send({ message: 'Internal server error' });
    } else if (result.length === 0) {
      // Handle the case where no user is found
      res.status(401).send({ message: 'Invalid credentials' });
    } else {
      // Handle the case where a user is found
    
      res.send({ message: 'Login successful' });  
    }
  });
});


app.post('/api/sturegister', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const gender = req.body.gender;
  const phone = req.body.phone;
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;

  // Insert registration data into database
  const query = `INSERT INTO sturegistration (name, email, gender, phone, password, confirmpassword) VALUES (?, ?, ?, ?, ?,?)`;
  connection.query(query, [name, email, gender, phone, password, confirmpassword], (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL database: ', err);
      res.status(500).json({ message: 'Error registering student' });
      return;
    }
    console.log('Successfully registered new student with ID: ', result.insertId);
    res.status(200).json({ message: 'Successfully registered student' });
  });
});


app.get('/api/challenges', (req, res) => {
   const query = `SELECT * FROM challenges`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
});



// app.post('/videoupload/:stuid', (req, res) => {
//   const stuid = req.params.stuid;
//   const gitlink = req.body.gitlink;

//   const sql = `INSERT INTO upload (stuid, gitlink) VALUES ('${stuid}', '${gitlink}')`;
//   connection.query(sql,(err, result) => {
//     if (result) {
//       res.sendStatus(200);
//       res.json(result)

   
//     } else {  
//       console.error(err);
//       res.status(500).send('Internal Server Error');
//       console.log(err)
//     }
//   });
// });

 
 
 
app.post('/videoupload/:stuid', (req, res) => {
  const { stuid } = req.params;
  const gitlink = req.body.gitlink;
  const gitlinktrue=gitlink+'?raw=true';
  const sql = 'INSERT INTO upload (gitlink, stuid) VALUES (?, ?)';

  connection.query(sql, [gitlinktrue, stuid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    
    res.json(result);
  });
});

app.get('/transcribe-video/:stuid', async (req, res) => {
  try {
    // Retrieve audio URL from the database
    const stuid = req.params.stuid;
    const sql = `SELECT gitlink FROM upload WHERE stuid = '${stuid}'`;

    connection.query(sql, (err, result) => {
      if (err) {
        console.error('Error retrieving audio URL from the database:', err);
        res.sendStatus(500);
      } else if (result && result.length > 0) {
        const audioUrl = result[0].gitlink;

        // Execute Python script
        const pythonScript = spawn('python', [
          'py.py', audioUrl
        ]);

        // Capture output from Python script
        let transcriptionText = '';
        pythonScript.stdout.on('data', (data) => {
          transcriptionText += data.toString();
        });

        pythonScript.on('close', (code) => {
          if (code === 0) {
            console.log('Python script executed successfully');
            console.log('Transcription:', transcriptionText);
            // Handle the output as needed
            const response = {
              transcription: transcriptionText
            };
            res.status(200).json(response);
          } else {
            console.error('Python script execution failed');
            // Handle the failure case
            res.sendStatus(500);
          }
        });

        pythonScript.on('error', (error) => {
          console.error('Error executing Python script:', error);
          res.sendStatus(500);
        });
      } else {
        console.error('No audio URL found in the database');
        res.sendStatus(500);
      }
    });
  } catch (error) {
    console.error('Error retrieving audio URL from the database:', error);
    res.sendStatus(500);
  }
});


 

 

// app.get('/transcribe-video/:stuid', async (req, res) => {
//   try {
//     const stuid = req.params.stuid;
//     const sql = `SELECT gitlink FROM upload WHERE stuid = '${stuid}'`;

//     connection.query(sql, (err, result) => {
//       if (err) {
//         console.error('Error retrieving audio URL from the database:', err);
//         res.sendStatus(500);
//       } else if (result && result.length > 0) {
//         const audioUrl = result[0].gitlink;

//         // Execute Python script
//         const pythonScript = exec(`python py.py ${audioUrl}`, (error, stdout, stderr) => {
//           if (error) {
//             console.error('Error executing Python script:', error);
//             res.sendStatus(500);
//           } else {
//             // Transcription completed, now perform additional steps

//             // Process transcription response
//             const transcriptionText = stdout.trim();

//             // Perform API call to AssemblyAI
//             const endpoint = 'https://api.assemblyai.com/v2/transcript';
//             const json = {
//               audio_url: audioUrl,
//               disfluencies: true
//             };
//             const headers = {
//               authorization: '0a9acaa0ce364b0b995785d7c09920c2'
//             };

//             request.post({ url: endpoint, json: json, headers: headers }, (error, response, body) => {
//               if (error) {
//                 console.error('Error performing API call to AssemblyAI:', error);
//                 res.sendStatus(500);
//               } else {
//                 const transcribedId = body.id;
//                 const endpointTranscribed = `https://api.assemblyai.com/v2/transcript/${transcribedId}`;

//                 // Check transcription status
//                 const checkTranscriptionStatus = () => {
//                   request.get({ url: endpointTranscribed, headers: headers }, (error, response, body) => {
//                     if (error) {
//                       console.error('Error checking transcription status:', error);
//                       res.sendStatus(500);
//                     } else {
//                       const status = body.status;
//                       if (status === 'completed') {
//                         // Transcription completed, now process the text

//                         // Process the text using Sapling API
//                         const api_key = 'RP3ABL74AJ0TQ1DNMFW7SWKEPKW9VF37';
//                         const client = new SaplingClient(api_key);

//                         // Get edits from Sapling API
//                         const edits = client.edits(transcriptionText);

//                         // Initialize lists to hold spelling and grammatical errors
//                         const spellingErrors = [];
//                         const grammaticalErrors = [];

//                         // Loop through each edit and add it to the appropriate list based on its error type
//                         for (const edit of edits) {
//                           if (edit.general_error_type === 'Spelling') {
//                             spellingErrors.push(edit);
//                           } else if (edit.general_error_type === 'Grammar') {
//                             grammaticalErrors.push(edit);
//                           }
//                         }

//                         // Print out the spelling errors with correct replacements
//                         console.log('Spelling Errors:');
//                         for (const error of spellingErrors) {
//                           console.log('Sentence:', error.sentence);
//                           console.log('Error Type:', error.general_error_type);
//                           console.log('Incorrect Word:', error.sentence.slice(error.start, error.end));
//                           console.log('Replacement:', error.replacement);
//                           console.log();
//                         }

//                         // Print out the grammatical errors with correct replacements
//                         console.log('Grammatical Errors:');
//                         for (const error of grammaticalErrors) {
//                           console.log('Sentence:', error.sentence);
//                           console.log('Error Type:', error.general_error_type);
//                           console.log('Incorrect Phrase:', error.sentence.slice(error.start, error.end));
//                           console.log('Replacement:', error.replacement);
//                           console.log();
//                         }

//                         // Send the transcription and errors as the response
//                         res.status(200).json({ transcription: transcriptionText, spellingErrors, grammaticalErrors });
//                       } else {
//                         // Transcription still in progress, check again after a delay
//                         setTimeout(checkTranscriptionStatus, 2000);
//                       }
//                     }
//                   });
//                 };

//                 // Start checking transcription status
//                 checkTranscriptionStatus();
//               }
//             });
//           }
//         });
//       } else {
//         console.error('No audio URL found in the database');
//         res.sendStatus(500);
//       }
//     });
//   } catch (error) {
//     console.error('Error retrieving audio URL from the database:', error);
//     res.sendStatus(500);
//   }
// });


// app.get('/detect-faces/:stuid', async (req, res) => {
//   try {
//     const stuid = req.params.stuid;
//     const sql = `SELECT gitlink FROM upload WHERE stuid = '${stuid}'`;

//     connection.query(sql, (err, result) => {
//       if (err) {
//         console.error('Error retrieving video URL from the database:', err);
//         res.sendStatus(500);
//       } else if (result && result.length > 0) {
//         const videoUrl = result[0].gitlink;

//         // Absolute path to the Python script
//         const pythonScript = spawn('python', ['facedetect.py', videoUrl]);
//          // Execute Python script
       

//         // Capture output from Python script
//         let totalFacesDetected = '';

//         pythonScript.stdout.on('data', (data) => {
//           totalFacesDetected += data.toString();
//         });

//         pythonScript.on('close', (code) => {
//           if (code === 0) {
//             console.log('Python script executed successfully');
//             console.log('Total Faces Detected:', totalFacesDetected);
//             res.status(200).json({ totalFacesDetected });
//           } else {
//             console.error('Python script execution failed');
//             console.log('Error:', err);
//             res.sendStatus(500);
//           }
//         });

//         pythonScript.on('error', (error) => {
//           console.error('Error executing Python script:', error);
//           res.sendStatus(500);
//         });
//       } else {
//         console.error('No video URL found in the database');
//         res.sendStatus(500);
//       }
//     });
//   } catch (error) {
//     console.error('Error retrieving video URL from the database:', error);
//     res.sendStatus(500);
//   }
// });






// app.get('/notlook/:stuid', (req, res) => {
//   try {
//     const stuid = req.params.stuid;
//     const sql = `SELECT gitlink FROM upload WHERE stuid = '${stuid}'`;

//     connection.query(sql, (err, result) => {
//       if (err) {
//         console.error('Error retrieving audio URL from the database:', err);
//         res.sendStatus(500);
//       } else if (result && result.length > 0) {
//         const videoUrl = result[0].gitlink;

//         // Execute Python script
//         const pythonScript = spawn('python', ['notlook.py', videoUrl]);

//         // Capture output from Python script
//         let notLookingCount = '';
//         pythonScript.stdout.on('data', (data) => {
//           notLookingCount += data.toString();
//           console.log(notLookingCount)
//         });

//         pythonScript.on('close', (code) => {
//           if (code === 0) {
//             console.log('Python script executed successfully');
//             console.log('Not Looking Count:', notLookingCount);
//             // Send the notLookingCount as a JSON response
//             res.status(200).json({ notLookingCount });
//           } else {
//             console.error('Python script execution failed');
//             // Handle the failure case
//             res.sendStatus(500);
//           }
//         });

//         pythonScript.on('error', (error) => {
//           console.error('Error executing Python script:', error);
//           res.sendStatus(500);
//         });
//       } else {
//         console.error('No video URL found in the database');
//         res.sendStatus(500);
//       }
//     });
//   } catch (error) {
//     console.error('Error retrieving video URL from the database:', error);
//     res.sendStatus(500);
//   }
// });



app.get('/results/:stuid', (req, res) => {
  try {
    const stuid = req.params.stuid;
    const sql = `SELECT gitlink FROM upload WHERE stuid = '${stuid}'`;

    connection.query(sql, (err, result) => {
      if (err) {
        console.error('Error retrieving audio URL from the database:', err);
        res.sendStatus(500);
      } else if (result && result.length > 0) {
        const videoUrl = result[0].gitlink;

        // Execute the first Python script
        const pythonScript1 = spawn('python', ['facedetect.py', videoUrl]);
        let facedetectCount = '';

        // Capture output from the first Python script
        pythonScript1.stdout.on('data', (data) => {
          facedetectCount += data.toString();
          console.log('Face Detection Count:', facedetectCount);
        });

        // Execute the second Python script
        const pythonScript2 = spawn('python', ['notlook.py', videoUrl]);
        let notLookingCount = '';

        // Capture output from the second Python script
        pythonScript2.stdout.on('data', (data) => {
          notLookingCount += data.toString();
          console.log('Not Looking Count:', notLookingCount);
        });

        const pythonScript3=spawn('python',['voice_detection.py',videoUrl]);
        let noofvoices='';

        pythonScript3.stdout.on('data',(data)=>{
          noofvoices+=data.toString();
          console.log("No of voices detected: ",noofvoices);
        });

        // Handle script completion for both scripts
        const handleScriptCompletion = () => {
          if (facedetectCount !== '' && notLookingCount !== '') {
            console.log('All Python scripts executed successfully');
            const response = {
              facedetectCount,
              notLookingCount,
              noofvoices
            };
            // Send the response containing both outputs as JSON
            res.status(200).json(response);
          }
        };

        // Handle script errors for both scripts
        const handleScriptError = () => {
          console.error('Python script execution failed');
          // Handle the failure case
          res.sendStatus(500);
        };

        // Handle script completion for the first Python script
        pythonScript1.on('close', (code) => {
          if (code === 0) {
            console.log('Face detection Python script executed successfully');
            handleScriptCompletion();
          } else {
            handleScriptError();
          }
        });

        // Handle script completion for the second Python script
        pythonScript2.on('close', (code) => {
          if (code === 0) {
            console.log('Not looking Python script executed successfully');
            handleScriptCompletion();
          } else {
            handleScriptError();
          }
        });
            
        pythonScript3.on('close',(code)=>{
          if(code===0){
            console.log('voice detection python script executed successfully');
            handleScriptCompletion();
          }else{
            handleScriptError();
          }
        });
        // Handle script errors for both scripts
        pythonScript1.on('error', handleScriptError);
        pythonScript2.on('error', handleScriptError);
        pythonScript3.on('error',handleScriptError);
      } else {
        console.error('No video URL found in the database');
        res.sendStatus(500);
      }
    });
  } catch (error) {
    console.error('Error retrieving video URL from the database:', error);
    res.sendStatus(500);
  }
});




const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

   
 