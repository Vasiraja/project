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

app.get('/userdetails/:userId', (req, res) => {
  const {userId}=req.params; 
  const query = `SELECT * FROM userdetails where userId = '${userId}'`;
  connection.query(query, (err, results) => {
    if (err) throw err;
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
  const othermark = task.others * task.othermarks;
  const total = task.no_ofReasoning + task.no_ofEnglish + task.no_ofmajor + task.others;
  const totalmarks = reasontotal + englishtotal + majortotal + othermark;

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

        const pythonScript3 = spawn('python', ['voice_detection.py', videoUrl]);
        let noofvoices = '';

        pythonScript3.stdout.on('data', (data) => {
          noofvoices += data.toString();
          console.log('No of voices detected: ', noofvoices);
        });

        const pythonScript4 = spawn('python', ['fluency.py', videoUrl]);
        let fluency = '';

        pythonScript4.stdout.on('data', (data) => {
          fluency += data.toString();
          console.log('Fluency Percentage: ', fluency, '%');
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
            // &&
            // spell !== '' &&
            // grammer !== ''
          ) {
            console.log('All Python scripts executed successfully');
            const response = {
              facedetectCount,
              notLookingCount,
              noofvoices,
              fluency,
              // mistakes,
              // spell,
              // grammer
            };
            // Send the response containing all outputs as JSON
            res.status(200).json(response);
          }
        };

        // Handle script errors for all Python scripts
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

        // Handle script completion for the third Python script
        pythonScript3.on('close', (code) => {
          if (code === 0) {
            console.log('Voice detection Python script executed successfully');
            handleScriptCompletion();
          } else {
            handleScriptError();
          }
        });

        // Handle script completion for the fourth Python script
        pythonScript4.on('close', (code) => {
          if (code === 0) {
            console.log('Fluency check Python script executed successfully');
            handleScriptCompletion();
          } else {
            handleScriptError();
          }
        });

         pythonScript1.on('error', handleScriptError);
        pythonScript2.on('error', handleScriptError);
        pythonScript3.on('error', handleScriptError);
        pythonScript4.on('error', handleScriptError);
        // pythonScript5.on('error',handleScriptError);
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

   
 