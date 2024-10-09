import React from 'react'
import { Card, Container, Col, Row} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import cardData from './Cardgallery'
import ResponsiveNavbar from './Navbar'
import styles from "./CSSfiles/Option.module.css";
export default function Options() {
  const navigate=useNavigate()

  function handleclick(link)
  {
     navigate(link)
  }
  return (
      
    <Container fluid className={styles.container2}>
      <ResponsiveNavbar/>

      <div style={{textAlign:"center",color:'black',marginTop:"40px"}}>
        <h1>Explore Our Conversion Options</h1>
        <h4>Choose a conversion option below to get started</h4>
      </div>
      <Row className='g-4'>
      {cardData.map((card,index)=>(
      <Col  xs={12} sm={12} md={6} lg={4}  className="d-flex justify-content-center" >
        <Card  className={styles.cardd}  style={{ width: '100%', maxWidth: '300px',boxShadow:"5px 5px black"}}>
        <Card.Img src={card.image} style={{height:"200px",boxShadow:"3px 5px black"}}/>
          <Card.Body>   
          <Card.Title style={{color:"white"}}><b>{card.title}</b></Card.Title>
          <Card.Text style={{color:"white"}}>{card.text}</Card.Text>
          <button  onClick={()=>handleclick(card.link)} style={{borderRadius:"20px"}} className={`${styles.button} ${styles.buttonhoverafter} ${styles.buttonhover}`}>CLICK TO CONVERT</button>
          </Card.Body>
        </Card>
      </Col>
      ))
    }
</Row>
  </Container>
    )
}
