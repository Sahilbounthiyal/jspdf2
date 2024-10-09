import React, { useState } from 'react';
import ResponsiveNavbar from './Navbar';
import { Row, Col, Container, Image as BootstrapImage } from 'react-bootstrap';
import styles from './CSSfiles/imagetopdf.module.css';
import jsPDF from 'jspdf';
import CollectionsIcon from '@mui/icons-material/Collections';
import { DriveFileRenameOutline } from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 


export default function Imagetopdf() {
  const [images, setImages] = useState([]);
  const [pdfname, setPdfName] = useState('');
  const [pdfurl,setpdfurl]=useState("")
  const [showprev,setshowprev]=useState(false)
  const [pdfdoc,setpdfdoc]=useState(null)
  const margin = 20;

  function handleImageChange(e) {
    const files = Array.from(e.target.files); 
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setImages(imageUrls);
    console.log('Images:', imageUrls);
  }

  async function loadImage(imageSrc) {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.src = imageSrc;
      img.onload = () => resolve(img);
      img.onerror = err => reject(err);
    });
  }

  async function generatePdf(e) {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("No images selected");
      return;
    } else {
      toast.success('Generating PDF...');
    }

    const pdf = new jsPDF();

    const pageWidth = 210;
    const pageHeight = 297;

    try {
      for (let index = 0; index < images.length; index++) {
        const imageSrc = images[index];
        const img = await loadImage(imageSrc);

        const imgWidth = Math.min(pageWidth - 2 * margin, img.width * 0.75);
        const imgHeight = (imgWidth / img.width) * img.height;

        if (imgHeight > (pageHeight - 2 * margin)) {
          const scaleFactor = (pageHeight - 2 * margin) / imgHeight;
          imgWidth *= scaleFactor;
          imgHeight *= scaleFactor;
        }

        if (index > 0) {
          pdf.addPage();
        }
        pdf.internal.pageSize.width = pageWidth;
        pdf.internal.pageSize.height = pageHeight;

        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        console.log('Adding image to PDF');
        pdf.addImage(img, 'JPEG', x, y, imgWidth, imgHeight);
        console.log('Added image to PDF successfully');
      }
      const pdfbloburl=pdf.output('bloburl')
      setpdfurl(pdfbloburl)
      setpdfdoc(pdf)
    

    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  }

  function changename(e) {
    setPdfName(e.target.value);
  }

  const showpreview=()=>{
    setshowprev(!showprev)
  }

  const downloadpdf=()=>{
    if(!pdfdoc)
    {
      toast.error("NO file to download")
    }
    else{
    setTimeout(() => {
      toast.success('Downloading and saving...',{autoClose:2000});
    },100)
    setTimeout(() => {
      pdfdoc.save(`${pdfname}.pdf`);
    }, 3000)  
  }
  }  
  return (
    <Container fluid className={styles.container3}>
      <ResponsiveNavbar />
      <div className={styles.headingdiv}>
        <h1 className={styles.heading1}><i>Convert Images Into PDF with Customizable Name</i></h1>
      </div>
      <h1 className={styles.heading2itp}>Import your images below</h1>
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={4} lg={7} sm={12}  className="text-center">
          <BootstrapImage src="jpg2pdf2.png" className={styles.imageclass} fluid /><br />
          <h4 className={`${styles.infoText} ${styles.txtcolor}`}>Convert jpg images to PDF easily within seconds</h4><br/>
          <div className='mb-3 justify-content-center' style={{display:"flex"}}>
          <CollectionsIcon style={{ fontSize: "35px", color: "blue" }} /> 
          <input 
            type='file' 
            multiple 
            accept='image/*' 
            onChange={handleImageChange} 
            className={styles.fileinput} 
          />
          </div><br/><br/>
          
          <h4 className={styles.txtcolor}>Enter the name of the generating pdf</h4>
          <DriveFileRenameOutline style={{ fontSize: "35px", color: "black" }} />
          <input 
            type='text' 
            placeholder='Enter here' 
            onChange={changename} 
            className={styles.nameInput} 
          />
          <br/>
          <div style={{display:"inline-block"}}>
          <button 
            type='button' 
            className={`${styles.btnitp} ${styles.btnitphover} ${styles.btnipthoverafter}`} 
            style={{ color: "white", fontSize: "20px" }}
            onClick={generatePdf}
          >Convert To PDF
          </button>
       
          <button 
            type='button' 
            className={`${styles.btnitp} ${styles.btnitphover} ${styles.btnipthoverafter}`} 
            style={{ color: "white", fontSize: "20px" }}
            onClick={showpreview}
          >{ showprev && pdfurl? "Hide preview":"Show PDF Preview"} </button>
           <button 
            type='button' 
            className={`${styles.btnitp} ${styles.btnitphover} ${styles.btnipthoverafter}`} 
            style={{ color: "white", fontSize: "20px" }}
            onClick={downloadpdf}
          >Download   <DownloadIcon style={{ fontSize: "25px" }} />
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
