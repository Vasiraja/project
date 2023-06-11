const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser=require('body-parser');
const exec = require('child_process').exec;
const bcrypt=require('bcrypt');
const fileUpload=require('express-fileupload');
 
const { spawn } = require('child_process');
const { connect } = require('http2');
const path = require('path');
const { FaceDetection } = require('face-api.js');


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

app.post('/minus/:userId', (req, res) => {
  const userId=req.params.userId;
  const facedetectminus = req.body.facedetectminus;
  const voicedetectminus = req.body.voicedetectminus;
  const notlookcameraminus = req.body.notlookcameraminus;
   const gramminus = req.body.gramminus;

  const query = `INSERT INTO minusmarks (facedetectminus, voicedetectminus, notlookcameraminus, gramminus,userId)
                 VALUES (?, ?, ?, ?, ?)`;

  connection.query(query, [facedetectminus, voicedetectminus, notlookcameraminus, gramminus,userId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Internal server error' });
    } else {
      res.status(200).send({ message: 'Data inserted successfully' });
    }
  }); 
});


 

app.get('/userdetails/:userId', (req, res) => {
  const {userId}=req.params; 
  const query = `SELECT * FROM userdetails where userId = '${userId}'`;
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


app.post('/userdetails/:stuId/:userId', (req, res) => {
  // Extract parameters and data from the request
  const stuId = req.params.stuId;
  const aptiscore = req.body.aptiscore;
  const fluency = req.body.fluency;
  const userId = req.params.userId;
  const facedetections = req.body.facedetections;
  const notlook = req.body.notlook;
  const voice = req.body.voice;
  const gram = req.body.gram;
  const spell=req.body.spell;
  const totalmarks = parseInt(aptiscore) + parseInt(fluency) + parseInt(facedetections) + parseInt(notlook) + parseInt(voice) + parseInt(gram);

  // Construct the SQL query
  const query = `INSERT INTO userdetails (stuid, aptiscore, fluency, userId, totalmarks, facedetections, notlook, voice, gram,spell) 
                 VALUES ('${stuId}', '${aptiscore}', '${fluency}', '${userId}', '${totalmarks}', '${facedetections}', '${notlook}', '${voice}', '${gram}','${spell}')`;

  // Execute the SQL query
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error inserting user details:', err);
      res.status(500).json({ error: 'Error inserting user details' });
      return;
    }
    res.json(results);
  });
});


 

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

app.post('/api/register', async (req, res) => {
  try {
    const email = req.body.email;
    const Inst_name = req.body.Inst_name;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password !== confirmPassword) {
      res.send({ message: 'Password does not match' });
      return;
    }

    // Use parameterized query to prevent SQL injection
    const checkEmailSql = 'SELECT * FROM inst_register WHERE email = ?';
    const checkEmailValues = [email];

    connection.query(checkEmailSql, checkEmailValues, async (error, result) => {
      if (error) {
        res.send({ message: error });
      } else if (result.length > 0) {
        // Email already exists
        res.send({ message: 'Email already exists' });
      } else {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user
        const insertSql = 'INSERT INTO inst_register (email, Inst_name, password) VALUES (?, ?, ?)';
        const insertValues = [email, Inst_name, hashedPassword];

        connection.query(insertSql, insertValues, (error, result) => {
          if (error) {
            res.send({ message: error });
          } else {
            res.send({ message: 'Registration success' });
          }
        });
      }
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.sendStatus(500);
  }
});

app.post('/api/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Use parameterized query to prevent SQL injection
  const sql = 'SELECT * FROM inst_register WHERE email = ?';
  connection.query(sql, [email], async (error, result) => {
    if (error) {
      // Handle the error case
      console.error(error);
      res.status(500).send({ message: 'Internal server error' });
    } else if (result.length === 0) {
      // Handle the case where no user is found
      res.status(401).send({ message: 'Invalid credentials' });
    } else {
      const hashedPassword = result[0].password;

      // Compare the user's input with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        // Handle the case where the password matches
        res.send({ message: 'Login successful' });
      } else {
        // Handle the case where the password does not match
        res.status(401).send({ message: 'Invalid credentials' });
      }
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
   const reasoningmark = req.body.reasoningmark;
  const englishmark = req.body.englishmark;
  const majormark = req.body.majormark;
   const comp_id = req.params.taskId;

  const reasontotal = no_ofReasoning * reasoningmark;
  const englishtotal = no_ofEnglish * englishmark;
  const majortotal = no_ofmajor * majormark;
   const total = no_ofReasoning + no_ofEnglish + no_ofmajor ;
  const totalmarks = reasontotal + englishtotal + majortotal ;

  const sql = `INSERT INTO challenges 
    (Institute, AptbeginTime, AptendTime, no_ofReasoning, no_ofEnglish, no_ofmajor, reasoningmark, englishmark, majormark, total, totalmarks, comp_id) 
      VALUES 
    (?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?)`;
  const values = [Institute, AptbeginTime, AptendTime, no_ofReasoning, no_ofEnglish, no_ofmajor, 
     reasoningmark, englishmark, majormark, total, totalmarks, comp_id];

  connection.query(sql, values, (error, result) => {
    if (error) {
      console.log(error);
      res.send({ message: error });
    } else {
      res.send({ message: "Insertion Success" });   
    }
  });
});


app.put('/api/challenges/:challenge_id', (req, res) => {
  const challenge_id = req.params.challenge_id;
  const task = req.body;

  // Calculate the total marks
  const reasontotal = task.no_ofReasoning * task.reasoningmark;
  const englishtotal = task.no_ofEnglish * task.englishmark;
  const majortotal = task.no_ofmajor * task.majormark;
   const total = task.no_ofReasoning + task.no_ofEnglish + task.no_ofmajor ;
  const totalmarks = reasontotal + englishtotal + majortotal ;

  // Update the task in the database
  connection.query('UPDATE challenges SET ? WHERE challenge_id = ?', [task, challenge_id], (err, result) => {
    if (err) {
      console.log('Error updating task:', err);
      res.status(500).send('Error updating task');
    } else if (result.affectedRows === 0) {
      console.log(`Task with challenge_id ${challenge_id} not found`);
      res.status(404).send(`Task with challenge_id ${challenge_id} not found`);
    } else {
      console.log(`Task with challenge_id ${challenge_id} updated successfully`);
       res.status(200).send({ message: `Task with challenge_id ${challenge_id} updated successfully` });
       
    }
  });

  
});
   
  app.get('/transcribe/:textid', (req, res) => {
    const textid = req.params.textid;
    const sql = `SELECT * FROM text WHERE textid = ${textid}`;
    connection.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results[0]);
    });
  });
  



 app.get('/getminus/:userId',(req,res)=>{
  const userId=req.params.userId;
  
  const sql=`SELECT * FROM minusmarks WHERE userId = '${userId}' ORDER BY id DESC LIMIT 1;
  `;
   
  connection.query(sql,(err,results)=>{
    if(err)throw err;
    res.json(results);
  })
  
 })
  
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
  const query = `INSERT INTO sturegistration (name, email, gender, phone, password, confirmpassword) VALUES (?, ?, ?, ?, ?, ?)`;
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


 
 

app.get('/results/:stuid', (req, res) => {
  try {
    let completedScripts = 0;

    const stuid = req.params.stuid;
    const sql = `SELECT gitlink FROM upload WHERE stuid = '${stuid}'`;

    connection.query(sql, (err, result) => {
      if (err) {
        console.error('Error retrieving audio URL from the database:', err);
        res.sendStatus(500);
      } else if (result && result.length > 0) {
        const videoUrl = result[0].gitlink;
        let facedetectCount = '';
        let notLookingCount = '';
        let noofvoices = '';
        let fluency = '';
        function checkAllScriptsCompleted() {
          const totalScripts = 4; // Total number of scripts being executed
        
          if (completedScripts === totalScripts) {
            console.log('All Python scripts executed successfully');
            // Perform desired actions here, such as sending the response
          }
        }
        


        // Execute the first Python script
        const pythonScript1 = spawn('python', ['facedetect.py', videoUrl]);
        pythonScript1.stdout.on('data', (data) => {
          facedetectCount += data.toString();
        });

        // Execute the second Python script
        const pythonScript2 = spawn('python', ['notlook.py', videoUrl]);
        pythonScript2.stdout.on('data', (data) => {
          notLookingCount += data.toString();
        });

        // Execute the third Python script
        const pythonScript3 = spawn('python', ['voice_detection.py', videoUrl]);
        pythonScript3.stdout.on('data', (data) => {
          noofvoices += data.toString();
        });

        // Execute the fourth Python script
        const pythonScript4 = spawn('python', ['fluency.py', videoUrl]);
        pythonScript4.stdout.on('data', (data) => {
          fluency += data.toString();
        });
//         const pythonScript5 = spawn('python', ['mistakes.py', videoUrl]);
// let spell = '';
// let grammer = '';
// pythonScript5.stdout.on('data', (data) => {
//   const output = data.toString();
//   const lines = output.split('\n');

//   if (lines[0].startsWith('Spelling Errors:')) {
//     spell = lines.slice(1).join('\n');
//   }

//   // Check if the line contains grammatical errors
//   if (lines[0].startsWith('Grammatical Errors:')) {
//     grammer = lines.slice(1).join('\n');
//   }
// });

        // Handle script completion for all Python scripts
        const handleScriptCompletion = () => {
          if (
            facedetectCount !== '' &&
            notLookingCount !== '' &&
            fluency !== '' &&
            noofvoices !== ''
          ) {
             const response = {
              facedetectCount,
              notLookingCount,
              noofvoices,
              fluency,
            };
            // Send the response containing all outputs as JSON
            res.status(200).json(response);
          }
        };

        // Handle script error for any Python script
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
          completedScripts++;
          checkAllScriptsCompleted();
        });

        // Handle script completion for the second Python script
        pythonScript2.on('close', (code) => {
          if (code === 0) {
            console.log('Not looking Python script executed successfully');
            handleScriptCompletion();
          } else {
            handleScriptError();
          }
          completedScripts++;
          checkAllScriptsCompleted();
        });

        // Handle script completion for the third Python script
        pythonScript3.on('close', (code) => {
          if (code === 0) {
            console.log('Voice detection Python script executed successfully');
            handleScriptCompletion();
          } else {
            handleScriptError();
          }
          completedScripts++;
          checkAllScriptsCompleted();
        });

        // Handle script completion for the fourth Python script
        pythonScript4.on('close', (code) => {
          if (code === 0) {
            console.log('Fluency check Python script executed successfully');
            handleScriptCompletion();
          } else {
            handleScriptError();
          }
          completedScripts++;
          checkAllScriptsCompleted();
        });

        // Handle script error for any Python script
        pythonScript1.on('error', handleScriptError);
        pythonScript2.on('error', handleScriptError);
        pythonScript3.on('error', handleScriptError);
        pythonScript4.on('error', handleScriptError);
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

   
 