import React, { useState } from 'react';
import { Image, Col, Row, Container } from 'react-bootstrap';
import ResponsiveNavbar from './Navbar';
import styles from './CSSfiles/Wordtopdf.module.css';
import mammoth from 'mammoth';//socs to html
import html2pdf from 'html2pdf.js';//html to pdf
import DriveFileRenameOutline from '@mui/icons-material/DriveFileRenameOutline';
import DownloadIcon from '@mui/icons-material/Download';
import ArticleIcon from '@mui/icons-material/Article';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Wordtopdf() {
  const [fileContent, setFileContent] = useState('');
  const [filename, setFilename] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfurl, setPdfurl] = useState('');
  const [pdfblob,setPdfblob]=useState()
  const [showpreview,setshowpreview]=useState(false)
  
  const handleFileInput = async (e) => {
    const file = e.target.files[0];
    if (file && file.name.toLowerCase().endsWith('.docx')) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target.result;
          const result = await mammoth.convertToHtml({ arrayBuffer });
          setFileContent(result.value);
        } catch (error) {
          console.error('Error during mammoth conversion:', error);
          toast.error('Error reading the Word file. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        toast.error('Error reading the file. Please try again.');
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.error('Please upload a .docx (Word) file.');
    }
  };

  const createPdf = async () => {
    if (!fileContent.trim()) {
      toast.error('No content to convert. Please upload a valid Word file.');
      return;
    }

    setLoading(true);
    try {
      const processTabs = (text) => text.replace(/\t/g, '        '); 
      const htmlContent = processTabs(fileContent);

      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      element.style.fontFamily = 'Arial, sans-serif';
      element.style.fontSize = '12pt';
      element.style.padding = '20px';
      element.style.whiteSpace = 'pre-wrap';
      element.style.overflowWrap = 'break-word';

      const images = element.getElementsByTagName('img');
      for (let img of images) {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
      }

      const options = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: filename || 'converted-file.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };

      const pdfBlob = await html2pdf().from(element).set(options).outputPdf('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfblob(pdfBlob);
      setPdfurl(pdfUrl)

    } catch (error) {
      console.error('Error creating the PDF:', error);
      toast.error('Error creating PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handledownload=()=>{
    if(pdfblob)
    {
      const link=document.createElement('a')
      link.href=URL.createObjectURL(pdfblob)
      link.download=filename||'converted PDF';
      link.click();
    }else{
      toast.error("no pdf available to download.Please convert the file before download")
    }
  }
  const handlepreview=()=>{
    if(!pdfurl)
    {
      toast.error("NO PDF available to preview")
    }else{
      setshowpreview(!showpreview)
    }
  }
  return (
    <Container fluid className={`${styles.container} ${styles.p-3}`}>
      <ResponsiveNavbar />

      <h1 className={styles.headingwtp}>Convert Word file Into PDF</h1>
      <h2 className={styles.heading2wtp}>Import your Word file below</h2>

      <Row className="justify-content-center">
        <Col xs={12} md={4} lg={7} sm={12} className="text-center">
          <Image src="word2pdf2.jpg" className={`${styles.imageclasswtp} ${styles.imgfluidmb-3}`} /><br /><br />
          <h2 className="mb-4 text-white">Choose word file to convert here</h2>
          <div style={{display:"flex"}} className="justify-content-center">
             <ArticleIcon style={{color: "blue", marginRight: "10px", fontSize: "40px"}}/>
            <input
              type='file'
              accept='.docx'
              className="bg-gradient text-white"
              style={{ background: 'linear-gradient(65deg, pink, violet)', color: 'white', marginLeft: '10px' }}
              onChange={handleFileInput}
              disabled={loading}
            />
            </div>
             <br/>
             <b><h4>Enter your file name:</h4></b>
             <DriveFileRenameOutline style={{color: "black", marginRight: "20px", fontSize: "40px"}}/>
              <input
              type='text' value={filename} onChange={(e) => setFilename(e.target.value)} style={{marginRight: "8%"}}/><br/>
            <div style={{display:"inline-block"}}>
            <button type='button' className={`${styles.btnwtp} ${styles.mb3}`} style={{ color: 'white', fontSize: '20px' }} onClick={createPdf}
              disabled={loading}>
              {loading ? 'Processing...' : 'Convert To PDF'}
            </button>
        
         
            <button type='button' className={`${styles.btnwtp} ${styles.mb3}`} style={{ color: 'white', fontSize: '20px' }} onClick={handlepreview}>
              {showpreview && pdfurl ?
              "Hide Preview":"Preview PDF"}
              
            </button>

            <button type='button' className={`${styles.btnwtp} ${styles.mb3}`} style={{ color: 'white', fontSize: '20px' }} onClick={handledownload}
              disabled={loading || !pdfblob}>
              Download PDF
              <DownloadIcon style={{color: "white", marginLeft: "10px", fontSize: "25px"}}/>
            </button>
          </div>
        </Col>
      
     {showpreview && pdfurl &&(
          <div style={{textAlign: 'center',marginBottom:"50px"}}>
            <iframe
              src={pdfurl}
              width="80%"
              height="500px"
              title='pdf preview'>
            </iframe>
          </div>
      )}
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
  );
}
