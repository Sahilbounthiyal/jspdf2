import React, { useState } from 'react'
import { Image as BootstrapImage,Container,Row,Col } from 'react-bootstrap'
import ResponsiveNavbar from './Navbar'
import *as XLSX  from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import styles from './CSSfiles/Exceltopdf.module.css'
import TableViewIcon from '@mui/icons-material/TableView';
import DriveFileRenameOutline from '@mui/icons-material/DriveFileRenameOutline'
import DownloadIcon from '@mui/icons-material/Download'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

export default function Exceltopdf() {

  const [file,setfiles]=useState(null);
  const [filename,setfilename]=useState("")
  const [pdf,setpdf]=useState("")
  const [showprev,setshowprev]=useState(false)
  const [pdfurl,setpdfurl]=useState("")
  function handlefilechange(e)
  {
    setfiles(e.target.files[0])
  }


 function convertexceltopdf()
 {
  if(!file)
  {
    toast("please select a file",{autoClose:1000,
      hideProgressBar:true
    })
    return;
  }
    const reader=new FileReader()
     reader.onload=(e)=>{
      
        toast.dark("creating")
     
   
      const data =new Uint8Array(e.target.result)
      const workbook=XLSX.read(data,{type:'array'})
      const sheetname=workbook.SheetNames[0];
      const sheet=workbook.Sheets[sheetname]
      const json=XLSX.utils.sheet_to_json(sheet,{header:1})
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a1' });
      pdf.autoTable({
        head: [json[0]],
        body: json.slice(1),
        startY: 10,
        theme: 'striped',
        margin: { top: 20 },
        style:{
          fontSize:5,
          cellPadding:2,
          lineColor:[0,0,0],
          lineWidth:1
        },
        headStyles: {
          fillColor: [200, 200, 200],
          textColor: [0, 0, 0]
        }
      });
      const pdfbloburl=pdf.output('bloburl')
      setpdfurl(pdfbloburl)
      setpdf(pdf)
     }
    reader.readAsArrayBuffer(file)
  }
  const downloadpdf=()=>{
    if(pdf){
    setTimeout(() => {
      toast.success("PDF downloading..... ",{autoClose:4000,
        hideProgressBar:false
      })

    }, 1000);
    setTimeout(() => {
      toast.success("PDF downloaded successfully ",{autoClose:5000,
        hideProgressBar:true
      })
      pdf.save(`${filename || 'EXCELpdf'}.pdf`);
    }, 5000);
  
  }
  else{
    toast.error("NO pdf to download")
  }
}
const PreviewPDF=()=>{
setshowprev(!showprev)
}
  return (

    <Container fluid className={`${styles.container4} ${styles.py5}`}>
    <ResponsiveNavbar/>
   
   <div className={`${styles.headingetp} ${styles.textcentermb4}`}><h1><i>Convert Excel Into Pdf with Customisable Name</i></h1></div>
   <h1 className={`${styles.heading2etp} ${styles.textcentermb4}`}>Import your Excel file below</h1>
  
   <Row className="justify-content-center mt-5">
        <Col xs={12} md={4} lg={7} sm={12}  className="text-center">
        
        <BootstrapImage src="exceltopdf.jpg" className={`${styles.imageclassetp} ${styles.imgfluidmb3}`} fluid/><br/><br/>
        <h3 style={{fontFamily:"-moz-initial",fontWeight:"bold"}}>Convert Excel to pdf easily  with in seconds</h3><br/>
          <h3 style={{fontFamily:"-moz-initial",fontWeight:"bold"}}>Choose Excel file To Convert Below</h3>
     
        <div style={{display:"flex",paddingLeft:"40px"}} className="justify-content-center mt-5">
          <TableViewIcon style={{color:"green",marginRight:"20px",fontSize:"40px"}}/>
          <input type='file'  accept=".xlsx,.xls" className={`${styles.p2} ${styles.mb3}`} onChange={handlefilechange} />
        </div>
          <b>
          <h3 className={styles.txtcolor}>Enter your file name : </h3>
          </b>
           < DriveFileRenameOutline style={{color:"black",marginRight:"20px",fontSize:"40px"}}/>

           <input type='text' value={filename} onChange={(e)=>setfilename(e.target.value)} style={{outlineColor:"green"}}/>
           <br/><br/>

           <div style={{display:"inline-block"}}>
            <button className={`${styles.buttons}  ${styles.mb3}`} onClick={convertexceltopdf}>Convert To PDF
            </button>
          
            <button className={` ${styles.buttons} ${styles.mb3} `} onClick={PreviewPDF}>{showprev &&pdfurl ? 'HIDE PDF Preview' :'Show PDF Preview'}
            </button>

            <button className={`${styles.buttons} ${styles.mb3} `} onClick={downloadpdf}> Download PDF <DownloadIcon style={{color:"white",marginLeft:"0px",fontSize:"20px"}}/>
            </button>
            </div>
        </Col>
        {showprev && pdfurl && (
          <iframe
          src={pdfurl}
          width="100%"
          height="600px"
          style={{border:'none'}}
          title='PDF Preview'>

          </iframe>)}
      </Row>
      <ToastContainer 
        position="top-center" 
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </Container>

  )
}
