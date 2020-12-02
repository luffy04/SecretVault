const express = require('express');
const app = express();
const fs = require('fs');
const csv = require('csv-parser');
var json2csv = require('json2csv').parse;
var newLine= "\r\n";
const bodyParser = require('body-parser');
const {spawn} = require("child_process"); 
const database=require("./database");
const http=require('http');
const server=http.Server(app);

app.use(bodyParser.json({ limit: '10mb'}))

app.use(bodyParser.json());

var fields = ["test_file","test_speaker","19","26","27","Anuj","result","correct"];

var appendThis = [
    {
        test_file: 'new data',
        test_speaker: 'Luffy',
        19:"0.1",
        26:"0.1",
        27:"0.1",
        Anuj:"0.1",
        result:"Luffy",
        correct:"1.0"
    }
];

app.post("/login",(req,res)=>{
    let base64String=req.body.data.music;
    fs.writeFile(`./data/wav/test/${req.body.data.username}.wav`,base64String,{encoding:"base64"},(err)=>{
        let appendThis={
            filename:`data/wav/test/${req.body.data.username}.wav`,
            speaker:`${req.body.data.username}`
        }
        var data = json2csv(appendThis,{header:true}) + newLine; 
        fs.writeFile('./cfg/test_list.csv',data,(err)=>{
            if(err) throw err;
            var process=spawn('python3',["./scoring.py"]);
            process.stdout.on("data",(data)=>{
                fs.createReadStream("./res/results.csv")
                .pipe(csv())
                .on('data', (row) => {
                    console.log(row.correct)
                    res.send(row.correct);
                })
                
            })
        })
    })
})

app.post("/signUp",(req,res)=>{
    let base64String=req.body.data.music;
    fs.writeFile(`./data/wav/enroll/${req.body.data.username}.wav`,base64String,{encoding:"base64"},(err)=>{
        let appendThis={
            filename:`data/wav/enroll/${req.body.data.username}.wav`,
            speaker:`${req.body.data.username}`
        }
        var data = json2csv(appendThis,{header:false}) + newLine;
        fs.appendFile('./cfg/enroll_list.csv', data, function (err) {
            if (err) throw err;
            fs.createReadStream("./cfg/enroll_list.csv")
            .pipe(csv())
            .on('data', (row) => {
                console.log(row);
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
            });
            console.log('The "data to append" was appended to file!');
            res.send("success")
        });
    })
})

// fs.stat('results.csv', function (err, stat) {
//     if (err == null) {
//         console.log('File exists');
//         var data = json2csv(appendThis,{header:false}) + newLine;

//         fs.appendFile('results.csv', data, function (err) {
//             if (err) throw err;
//             fs.createReadStream("./results.csv")
//             .pipe(csv())
//             .on('data', (row) => {
//                 console.log(row);
//             })
//             .on('end', () => {
//                 console.log('CSV file successfully processed');
//             });
//             console.log('The "data to append" was appended to file!');
//         });
//     }
//     else {
//         console.log('New file, just writing headers');
//         fields= (fields + newLine);

//         fs.writeFile('results.csv', fields, function (err) {
//             if (err) throw err;
//             fs.createReadStream("./results.csv")
//             .pipe(csv())
//             .on('data', (row) => {
//                 console.log(row);
//             })
//             .on('end', () => {
//                 console.log('CSV file successfully processed');
//             });
//             console.log('file saved');
//         });
//     }
// });

const port =process.env.PORT ||  5000;

server.listen(port, '192.168.0.106',() => `Server running on port ${port}`);
