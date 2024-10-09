import React, { useState } from 'react';
import ResponsiveNavbar from './Navbar';
import { Row, Col, Container, Image, Button } from 'react-bootstrap';
import styles from './CSSfiles/Merge_compo.module.css';
import { PDFDocument } from 'pdf-lib';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

export default function Mergepdf() {
  const [mergePdfUrl, setMergePdfUrl] = useState(null);
  const [filename, setFilename] = useState("default");
  const [pdfUrl, setPdfUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const mergePdfs = async (pdfBytesArray) => {
    const pdfDoc = await PDFDocument.create();

    for (const pdfBytes of pdfBytesArray) {
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => pdfDoc.addPage(page));
    }
    
    const mergedPdfBytes = await pdfDoc.save();
    const mergedPdfBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const mergedPdfUrl = URL.createObjectURL(mergedPdfBlob);

    setMergePdfUrl(mergedPdfUrl);
    setPdfUrl(mergedPdfUrl);
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (files.length >= 2) {
      const pdfBytesArray = [];
      for (const file of files)
      {
        const pdfBytes = await file.arrayBuffer();
        pdfBytesArray.push(pdfBytes);
      }
      await mergePdfs(pdfBytesArray);
    } else {
      toast.error("Please select at least 2 files");
    }
  };

  const handlePreview = () => {
    if (mergePdfUrl) {
      setShowPreview(!showPreview);
    }
  };

  const handleDownload = () => {
    if (mergePdfUrl) {
      const a = document.createElement('a');
      a.href = mergePdfUrl;
      a.download = filename || 'merged.pdf';
      a.click();
    }
  };

  return (
    <Container fluid className={styles.containerm}>
      <ResponsiveNavbar />
      <div className='text-center mb-4'>
        <h1 className='display-4 font-weight-bold text-primary'>
          <i><b>Merge your PDF files</b></i>
        </h1>
      </div>
      <h2 className='text-center mb-4'>Choose files to merge below</h2>

      <Row className='justify-content-center'>
        <Col xs={12} md={8} lg={7}>
          <div className='text-center mb-4'>
            <Image src="mergepdf.png" className={`${styles.image} img-fluid`} alt="Merge PDF" />
            <h3 className='mt-3'>Merge PDF files easily within seconds</h3>
            <h3>Select your files to merge</h3>
          </div>
          <br/>

          <div className='mb-3 justify-content-center' style={{display:"flex",marginLeft:"40px"}}>
            <PictureAsPdfIcon className={styles.icon} style={{fontSize:"35px"}}/>
            <input
              type='file' multiple onChange={handleFileChange} accept="application/pdf"/><br/>
              </div>
            <div className='mb-3 text-center'>
              <b>Enter your file name:</b><br/>
              <DriveFileRenameOutlineIcon/> <input
                type='text'
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder='Enter the merged file name'/>
            </div>
            <div style={{display:"flex"}} className='justify-content-center'>
            <button
              onClick={() => handleFileChange({ target: { files: document.querySelector('input[type="file"]').files } })} 
              className={`${styles.buttonmerge}`}
            >Merge PDF
            </button>

            <button
              onClick={handlePreview}
              // disabled={!mergePdfUrl}
              className={`${styles.buttonmerge}`}
            > {showPreview && pdfUrl ?"Hide Preview":
              "Show PDF Preview"}
            
            </button>

            <button
              onClick={handleDownload}
              // disabled={!mergePdfUrl}
              className={`${styles.buttonmerge}`}
            >
              Download PDF <DownloadIcon/>
            </button>
            </div>
        </Col>
      </Row>
      {showPreview && pdfUrl && (
        <div className='text-center mt-4'>
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            style={{border:'none'}}
            title='PDF Preview'>
          </iframe>
        </div>
      )}
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
  );
}
