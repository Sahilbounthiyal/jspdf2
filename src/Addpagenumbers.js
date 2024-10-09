import React, { useState } from 'react';
import { Row, Col, Container, Image, Button } from 'react-bootstrap';
import ResponsiveNavbar from './Navbar';
import { PDFDocument, rgb, scale } from 'pdf-lib';
import styles from './CSSfiles/addpgnum.module.css';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
export default function Addpagenumbers() {
  const [position, setPosition] = useState('bottom');
  const [pdfFile, setPdfFile] = useState(null);
  const [name, setName] = useState("");
  const [showprev,setshowprev]=useState(false)
  const [pdfdoc,setpdfdoc]=useState(null)
  const [pdfBlob,setpdfBlob]=useState(null)
  const [pdfurl,setpdfurl]=useState("")
  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handlePositionChange = (e) => {
    setPosition(e.target.value);
  };

  const addPageNumber = async () => {
    if (!pdfFile) return;

    const pdfDoc = await PDFDocument.load(await pdfFile.arrayBuffer());
    const pages = pdfDoc.getPages();

    pages.forEach((page, index) => {
      const { width, height } = page.getSize();
      page.drawText(`Page ${index + 1}`, {
        x: width / 2 - 40,
        y: position === 'bottom' ? 10 : height - 15,
        size: 12,
        color: rgb(0, 0, 0),
      });
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    setpdfBlob(blob)
    setpdfurl(  URL.createObjectURL(blob))
  }

  const showpreview=()=>{
    if(pdfBlob){
      setshowprev(!showprev)
    }
  }

  const download=()=>{
    if(pdfBlob)
      {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name || 'modified.pdf';
      a.click();
    }
  }
      
  return (
    <Container fluid className={styles.container}>
      <ResponsiveNavbar />

      <div className='text-center mb-4'>
        <h1 className='font-italic' style={{textShadow:"0px 3px black"}}>Add page numbers to your PDF files</h1>
      </div>

      <h2 className='text-center mb-4'>Choose PDF file below</h2>

      <Row className='justify-content-center'>
        <Col xs={12} md={8} lg={4} className='text-center'>
          <Image src="pagenumberimg.svg" className={`${styles.image} img-fluid`} alt="Add Page Numbers" />
          <h4 className='mt-3'>Add page numbers to your file within seconds</h4>
          
          <br/>
          <div className='mb-3 justify-content-center' style={{display:"flex"}} >
          <UploadFileIcon className={styles.icon} style={{fontSize:"35px"}}/>
           <input type='file' accept='application/pdf' onChange={handleFileChange}className='mb-3'/>
          </div>
        
          
          <div className='mb-3'>
            <span className={`${styles.font} fontweightbold`}>Select where you want the page number in your PDF:</span><br />
    
              <input
                type='radio' value="top"
                checked={position === 'top'}
                style={{marginRight:"25px"}}
                onChange={handlePositionChange}
                height='300px'
                className='mr-2'
              />
              <span className={styles.font} style={{marginRight:"45px"}}>Top</span><br/>
         
              <input
                type='radio'
                value='bottom'
                checked={position === 'bottom'}
                onChange={handlePositionChange}
                style={{marginRight:"20px"}}
                className={`${styles.font}`}
              />
              <span className={styles.font}>Bottom</span>

          </div>

          <div >
            <span className={styles.font}>Enter name of generating PDF:</span><br />
            <DriveFileRenameOutlineIcon style={{fontSize:"35px",marginRight:"30px"}}/><input
              type='text'
              value={name}
              placeholder='Enter name for PDF to be generating'
              onChange={(e) => setName(e.target.value)}
              />
          </div><br/>
        
        <div style={{display:"inline-block"}}>
          <button
            onClick={addPageNumber} className={`${styles.buttonc} 'py-2 px-4' `}>
            Add page number to PDF 
          </button>

          <button
            onClick={showpreview} className={`${styles.buttonc} 'py-2 px-4' `}>
             {showprev?'Close Preview':'Show PDF Preview'}
          </button>

          <button
            onClick={download} className={`${styles.buttonc} 'py-2 px-4' `}>
            Download PDF <DownloadIcon/>
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
          </iframe>
        )}
      </Row>
    </Container>
  );
}

