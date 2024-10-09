import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import HttpsIcon from '@mui/icons-material/Https';
import EmailIcon from '@mui/icons-material/Email';
import styles from './CSSfiles/Logincompo.module.css'
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app } from './Firebase';
import emailjs from 'emailjs-com';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [perror, setPerror] = useState("");

  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function handleEmail(e) {
    setEmail(e.target.value);
    if (!emailRegex.test(e.target.value)) {
      setError("Please enter a valid email");
    } else {
      setError("");
    }
  }

  function handlePassword(e) {
    setPassword(e.target.value);
    if (e.target.value.length < 8) {
      setPerror("Password length must be greater or equal to 8 characters");
    } else {
      setPerror("");
    }
  }

  function handleLogin() {
    if (error || perror || email === "" || password === "") {
      if (email === "") setError("Email cannot be empty");
      if (password === "") setPerror("Password cannot be empty");
      return;
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          toast.success("Signin Success");
          navigate("/");
        })
        .catch(() => {
          alert("No user found");
        });
    }
  }

  
  const signupWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        alert('Signed up with Google account');
        navigate('/');
        
        const temppara = {
          to_email: result.user.email,
          to_name: result.user.displayName || 'User',
          message: 'Thank you for registering with PDFify!'
        };
  
        return emailjs.send('service_4elalsk', 'template_js1tuwl', temppara, '7In2qCj3GiWa5akzpKuak');
      })
      .then((response) => {
        toast.success("Email sent successfully, check your email");
      })
      .catch((error) => {
        console.error('Error:', error);  
        toast.error("Some error occurred while sending the email");
      });
  };
  

  return (
    <Container fluid className={styles.container}>
      <Row>
        <Col>
        <div className={styles.containerdiv1} >
            <div className={styles.containerdiv2} >
              <h1>Welcome to PDFify</h1>
              <h3>Login to PDFify</h3>
              <h5 style={{ marginLeft: "45px" }}>Enter your email</h5>
              <div style={{ display: "flex" }}>
                <EmailIcon />
              <input type='text' placeholder='Enter your email' onChange={handleEmail} className={styles.input}/>
              </div>
              <p className='error'>{error}</p>
              <h5 style={{ marginLeft: "45px" }}>Enter your Password</h5>
              <div style={{ display: "flex" }}>
                <HttpsIcon /><input type='password' placeholder='Enter your password' onChange={handlePassword} className={styles.input} />
              </div>
              <p className='error'>{perror}</p>
              <button onClick={handleLogin} className={styles.loginbutton}>Login</button>
              <button onClick={signupWithGoogle} className={styles.loginbutton}>Login With Google</button><br /><br />
              <span className={styles.alreadyuser}>Go back to<Link to="/Register"> Register Page</Link></span>
            </div>
          </div>
          
        </Col>
      </Row>
      <ToastContainer 
       position="top-center" 
       autoClose={4000} 
       hideProgressBar={true} 
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
