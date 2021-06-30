import "./main.scss"
import {useRef,useState} from "react"
import axios from "axios";
import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
function App() {
  const [file, setFile] = useState();
  const [fileURL, setFileURL] = useState("");
  const [loading,setLoading]=useState(false);
  const [falseExtension,setfalseExtension]=useState(false);
  const saveFile = (e) => {
    setFile(e.target.files[0]);
    
  };

  function MyDropzone() {
    const onDrop = useCallback(acceptedFiles => {
      if(acceptedFiles[0].name.split('.').pop()==="docx"){
        setFile(acceptedFiles[0])
        setfalseExtension(false);
      }
      else{
        setfalseExtension(true);
      }
      
     
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  
    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {falseExtension&&<div class="alert alert-danger" role="alert">Only docx files!</div>}
        {
          isDragActive ?
          <div class="alert alert-success cursor-pointer" role="alert">Drag and drop your files here or click to choose...</div> :
            <div class="alert alert-primary cursor-pointer" role="alert">{!file?"Drag and drop your files here or click to choose...":file.name}</div>
        }
      </div>
    )
  }

  const uploadFile = async (e) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      const res = await axios.post(
        "https://docx-to-pdf-web-app-server.herokuapp.com/up",
        formData
      );
      console.log(res);
      setFileURL(res.data.download_url)
    } catch (ex) {
      console.log(ex);
    }
    setLoading(false);
  };

  return (
    <div className="center d-flex justify-content-center align-items-center">
      <div className="card ">
        <div className="card-body d-flex flex-column justify-content-center align-items-center">
          <p className="fs-2">Docx to PDF</p>
          <img src="./doc.png"></img><br/>
          <p className="fs-6">An amazing tool converts docx files to pdf</p>
          <br/>
          <MyDropzone/>
          <br/>
         
          <button type="submit" class={`btn btn-outline-success ${loading&&"disabled"} ${!file&&"disabled"} `} 
          onClick={uploadFile}>{!loading?"Upload":<><div class="spinner-border spinner-border-sm text-success" role="status"></div></>}</button><br/>

   
    

     {fileURL&&<><a href={fileURL}>Download</a><br/><p className="alert alert-warning">Your link will be expired in 60 seconds!</p></>} 
     
        </div>
      </div>
     
    </div>
  );
}

export default App;