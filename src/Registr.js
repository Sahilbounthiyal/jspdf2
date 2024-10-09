import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import PersonIcon from '@mui/icons-material/Person';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import EmailIcon from '@mui/icons-material/Email';
import HttpsIcon from '@mui/icons-material/Https';
import styles from './CSSfiles/register.module.css';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from './Firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from 'react-google-recaptcha';
import emailjs from 'emailjs-com';
import axios from 'axios';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function Register() {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [nerror, setNerror] = useState('');
  const [eerror, setEerror] = useState('');
  const [perror, setPerror] = useState([]);
  const [verify,setverify]=useState(false)
  const [register, setRegister] = useState(false);

  const [enteredOtp, setEnteredOtp] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [thankYouSent, setThankYouSent] = useState(false);
  const navigate = useNavigate();
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passpattern={
    minlength:/.{8,}/,
    lowercase:/[a-z]/,
    uppercase:/[A-Z]/,
    special:/[@$%*?&]/
  }
   
  const handleName = (e) => {
    const value = e.target.value;
    const containsNumbers = /\d/;
    const containsSpecialCharacters = /[^a-zA-Z\s]/;

    setName(value);
    if(containsNumbers.test(value))
    {
      setError("Name does not contain the numbers")
      setRegister(false)
    }
    else if(containsSpecialCharacters.test(value))
      {
        setError("Name does not contain the Special Characters")
        setRegister(false)
      }
      else  if (value.length === 0) {
      setError('Name cannot be empty');
      setRegister(false);
      } 
      else if (value.length < 3) {
      setError('Name must be greater than three characters');
      setRegister(false);
      } 
      else {
      setError('');
      setRegister(true)
     }
  };
  function onverify(value) {
         setverify(true)
  }
  
  const handleNumber = (e) => {
    const value = e.target.value;
    setNumber(value);
    if (value.length !== 12) {
      setNerror('Number length must be 12 digits (including country code)');
      setRegister(false);
    } else {
      setNerror('');
    }
  };
  
  const handlePassword = (e) => {
    const passerror=[]
    const value = e.target.value;
    setPassword(value);
    if (!passpattern.minlength.test(value)) {
      passerror.push('Password length must be greater or equal to 8 characters');
      setRegister(false);
    }
    if(!passpattern.lowercase.test(value)){
      passerror.push("Password should contain atlest one lowercase letter");
      setRegister(false);
    }
    if(!passpattern.uppercase.test(value)){
      passerror.push("Password should contain atlest one Uppaercase letter")
      setRegister(false);
    }
    if(!passpattern.special.test(value)) {
      passerror.push("Password should contain atlest one special character")
      setRegister(false);
    }else{
      setRegister(true)
    }
    setPerror(passerror)
  };
  
  const handleEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!emailRegex.test(value)) {
      setEerror('Please enter a valid email');
      setRegister(false);
    } else {
      setEerror('');
    }
  };
  const generateOtp = () => {
    return (Math.floor(100000 + Math.random() * 900000)).toString();
  };

  const sendOtp = async () => {
  
    const generatedOtp = generateOtp();
    setOtp(generatedOtp);
    const formattedNumber = number.startsWith('+') ? number : `+${number}`;
  if(verify)
  {
    try {
      await axios.post('https://api.twilio.com/2010-04-01/Accounts/ACe2f76434998eb1c6a364824a86db13d9/Messages.json', 
        new URLSearchParams({
          To: formattedNumber,
          From: '+18564741605',
          Body: `Your OTP code is ${generatedOtp}`,
        }), 
        {
          auth: {
            username: 'ACe2f76434998eb1c6a364824a86db13d9',
            password: '58e1d12d8d5cdfaec08939a6227fd680'
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      setOtpSent(true);
      toast.success('OTP sent successfully!');
    } catch (error) {
      toast.error('Failed to send OTP');
      console.error('Error sending OTP:', error);
    }
  }
};
  const sendThankYouMessage = async () => {
    const formattedNumber = number.startsWith('+') ? number : `+${number}`;
    
    try {
      await axios.post('https://api.twilio.com/2010-04-01/Accounts/ACe2f76434998eb1c6a364824a86db13d9/Messages.json', 
        new URLSearchParams({
          To: formattedNumber,
          From: '+18564741605',
          Body: 'Thanks for registering with PDFify!',
        }), 
        {
          auth: {
            username: 'ACe2f76434998eb1c6a364824a86db13d9',
            password: '58e1d12d8d5cdfaec08939a6227fd680'
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      setThankYouSent(true);
    } catch (error) {
      console.error('Failed to send thank you message');
      console.error('Error sending thank you message:', error);
    }
  };

  const handleRegister = async () => {
    if (otpSent) 
      {
      if (enteredOtp === otp) {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          toast.success('Registration successful');
          await sendThankYouMessage(); 
          navigate('/');
        } catch (error) {
          console.error('Error:', error.response || error.message);
          toast.error('Registration failed');
        }
      } else {
        toast.error('Invalid OTP');
      }
    } else {
      if (!name || !number || !email || !password || !emailRegex.test(email)||register==false||error) {
        toast.error('Please fill out all fields correctly');
      } else {
        await sendOtp(); 
      }
    }
  };
  
  const signupWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        
        alert('Signed up with Google account');
        navigate('/');
        
        const temppara={
         from_name:"PDFify",
          to_email:result.user.email,
          to_send:'user',
          message:'thankyou for registering with pdfify !\n hope we will be helpful to you'

        }
       return emailjs.send('service_4elalsk','template_js1tuwl',temppara,'Hk_StrUe_Blvy_5bE')
      }).then((response)=>{
        toast.success("Email sent successfully check your email")
      }).catch((error)=>{
        toast.error("Some error while sending mail")
      })
      .catch(error => {
        toast.error('Google sign up failed');
        console.error(error);
      });
  };
  
  return (
    <Container fluid className={styles.container}>
      <Row>
        <Col lg={10} md={12} sm={12} xs={12}>
          <div className={styles.containerdiv1}>
            <div className={styles.containerdiv2}>
              <center><h2>Welcome to PDFify</h2></center><br/>
              <h4 style={{ marginLeft: '45px' }}>Create Your Account</h4>
              <h5 style={{ marginLeft: '45px' }}>Enter your name</h5>
              <div style={{ display: 'flex' }}>
                <PersonIcon className={styles.icon} />
                <input type='text' placeholder='Enter your name' onChange={handleName} className={styles.input}/>
              </div>
              <p className={styles.error}>{error}</p>
  
              <h5 style={{ marginLeft: '45px' }}>Enter your phone number</h5>
              <div style={{ display: 'flex' }}>
                <PhoneAndroidIcon  className={styles.icon} /><input type='number' placeholder='Enter your number'
                 onChange={handleNumber} className={styles.input} />
              </div>
              <p className={styles.error}>{nerror}</p>
  
              <h5 style={{ marginLeft: '45px' }}>Enter E-mail address</h5>
              <div style={{ display: 'flex' }}>
                <EmailIcon  className={styles.icon} /><input type='text' placeholder='Enter your E-mail address'
                 onChange={handleEmail} className={styles.input} />
              </div>
              <p className={styles.error}>{eerror}</p>
  
              <h5 style={{ marginLeft: '45px' }}>Enter your Password</h5>
              <div style={{ display: 'flex' }}>
                <HttpsIcon  className={styles.icon} /><input
                 type='password'
                 placeholder='Enter your password'
                 onChange={handlePassword}
                  className={styles.input} 
                  />
              </div>
              {perror.length>0 &&(
                <ul className={styles.error}>
                 {perror.map((perr,index)=>(
                  <li key={index}>{perr}</li>
                 ))}
                </ul>
               
              )}
              
           <div>
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={onverify}
              style={{ width: '20%', height: 'auto' }}
              /></div>
              {otpSent && (

              <div>
             <h5 style={{ marginLeft: '45px' }}>Enter OTP</h5>
             <div style={{ display: 'flex' ,marginLeft: '45px'}}>
        
            <input
            type='text'
            placeholder='Enter OTP'
           value={enteredOtp}
           onChange={(e) => setEnteredOtp(e.target.value)}
           /><br/>
         </div>
        </div>
          )}
           <center><button onClick={handleRegister} className={styles.registerbutton}>
             {otpSent ? 'Verify OTP' : 'Register'}
            </button></center><br/>
              <span className={styles.alreadyuser}>Already registered?<Link to="/logincomponent">Login now</Link></span>
              
            <div style={{ textAlign:"center" }}><h2 style={{ color: 'black' }}>OR</h2></div>
            <div style={{  textAlign:"center"}}><button onClick={signupWithGoogle} className={styles.signupwithgoogle}>Signup With Google</button></div>
            </div>
         
            <br/><br />
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
