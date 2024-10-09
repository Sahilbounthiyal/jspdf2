import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from './Firebase'; 
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
const auth = getAuth(app);

const ResponsiveNavbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/logincomponent');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Navbar style={{ background: 'linear-gradient(black,grey)', borderRadius: '10px' }} expand="lg" >
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" style={{ width: "100vw" }}>
              <Col sm={12} md={1} lg={1} xs={12}>
                <Nav.Link as={Link} to="/" style={{ color: 'white', fontSize: "2rem", fontStyle: "italic" }}><b>PDFify</b></Nav.Link>
              </Col>
              <Col sm={12} md={2} lg={2} xs={12}><Nav.Link as={Link} to="/" style={{ color: 'white', fontSize: "1.1rem", padding: '0.4rem', flex: 1, textAlign: 'center' }}>Home</Nav.Link></Col>
              <Col sm={12} md={2} lg={1} xs={12}><Nav.Link as={Link} to="/imagetopdf" style={{ color: 'white', fontSize: "1.1rem", padding: '0.4rem', flex: 1, textAlign: 'center' }}>Image to PDF</Nav.Link></Col>
              <Col sm={12} md={2} lg={1} xs={12}><Nav.Link as={Link} to="/wordtopdf" style={{ color: 'white', fontSize: "1.1rem", padding: '0.4rem', flex: 1, textAlign: 'center' }}>Word to PDF</Nav.Link></Col>
              <Col sm={12} md={2} lg={1} xs={12}><Nav.Link as={Link} to="/Exceltopdf" style={{ color: 'white', fontSize: "1.1rem", padding: '0.4rem', flex: 1, textAlign: 'center' }}>Excel to PDF</Nav.Link></Col>
              <Col sm={12} md={1} lg={1} xs={12}><Nav.Link as={Link} to="/Mergepdf" style={{ color: 'white', fontSize: "1.1rem", padding: '0.4rem', flex: 1, textAlign: 'center' }}>Merge PDF</Nav.Link></Col>
              <Col sm={12} md={1} lg={2} xs={12}><Nav.Link as={Link} to="/Addpagenumbers" style={{ color: 'white', fontSize: "1.1rem", padding: '0.4rem', flex: 1, textAlign: 'center' }}>Add page numbers</Nav.Link></Col>
              {user ? (
                <Col sm={12} md={1} lg={1} xs={12}>
                  <Nav.Link onClick={handleLogout} style={{ color: 'white', fontSize: "1.4rem", padding: '0.4rem', flex: 1, textAlign: 'center' }}><ExitToAppIcon/>Logout</Nav.Link>
                </Col>
              ) : (
                <>
                  <Col sm={12} md={1} lg={1} xs={12}>
                    <Nav.Link as={Link} to="/logincomponent" style={{ color: 'white', fontSize: "1.4rem", padding: '0.4rem', flex: 1, textAlign: 'center' ,display:"flex" ,}}><PersonIcon style={{marginTop:"6px"}}/>Login</Nav.Link>
                  </Col>
                  <Col sm={12} md={1} lg={1} xs={12}>
                    <Nav.Link as={Link} to="/register" style={{ color: 'white', fontSize: "1.4rem", padding: '0.4rem', flex: 1, textAlign: 'center',display:"flex" }}><AccountCircleIcon style={{marginTop:"7px"}}/>Register</Nav.Link>
                  </Col>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Row>
    </Container>
  );
};

export default ResponsiveNavbar;
