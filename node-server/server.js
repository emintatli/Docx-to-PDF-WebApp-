const express = require('express');
const upload=require("express-fileupload");
const cors = require('cors')
const fs = require('fs');
const docxConverter = require('docx-pdf');
const app = express();

var corsOptions = {
    origin: 'https://docx-to-pdf-web-app.vercel.app',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
app.use(cors(corsOptions));

app.get("/",(req,res,next)=>{

    res.send("asdsa")
    
})
app.use("/download", express.static(__dirname + '/download'));
app.post('/up', upload(), async function (req, res) {
  const random_num=Math.random();
    const newpath = __dirname + "/download/";
    console.log(req.files.file)
    const file=req.files.file;
    
    const new_file_path=`${newpath}/${random_num}.docx`;
    file.mv(new_file_path, (err) => {
        if (err) {
          res.status(500).send({ message: "File upload failed", code: 200 });
        }
        docxConverter(new_file_path,`${new_file_path}_output.pdf`,async function(err,result){
            if(err){
              console.log(err);
            }
            console.log('result'+result);
            fs.unlinkSync(`./download/${random_num}.docx`) // docu sildik
            res.status(200).send({ message: "File Uploaded",download_url:`https://docx-to-pdf-web-app-server.herokuapp.com/download/${random_num}.docx_output.pdf`, code: 200 });
            const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
            await delay(60000);
            fs.unlinkSync(`./download/${random_num}.docx_output.pdf`) // pdfyi sildik
          });
        
      });
    // req.file is the `uploaded_file` file
    // req.body will hold the text fields, if there were any
   
  })
 
  app.use((req, res, next)=>{
    res.status(404);
    res.type('txt').send('Download Link Expired');
  });

  app.listen(process.env.PORT||5000);