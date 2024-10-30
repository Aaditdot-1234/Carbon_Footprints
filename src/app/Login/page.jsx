'use client'
import React, { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { account, ID } from '../appwrite'
import { useRouter } from 'next/navigation';
import Toast from '../../Components/Toast';
import './Login.css'

const Login = () => {
  const [userName , setUserName] = useState('');
  const [email , setEmail] = useState('');
  const [password , setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const router = useRouter();

  async function handleLogin(){
    if (!email || !password) {
        setToastMessage('Please fill in all fields.');
        return;
    }


    try{
        await account.createEmailPasswordSession( email, password)
        setUserName('')
        setEmail('')
        setPassword('')
        setToastMessage('Login successful!');

        setTimeout(() => {
            router.push('/profile'); // Redirect to the profile page
        }, 1000);
    }
    catch(e){
        console.error("Login error:",  e.message || e)
        setToastMessage('Login failed. Please try again.');
    }
  }  
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='Login'>
        {toastMessage && (
          <Toast message={toastMessage} onClose={() => setToastMessage('')} />
        )}
        <div className='form'>
            <div>
                <div>
                    <h4>Username</h4>
                    <input type="text" placeholder='Username' value={userName} onChange={(e) => setUserName(e.target.value)}/>
                </div>
                <div>
                    <h4>E-mail</h4>
                    <input type="email" placeholder='E-mail' value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div>
                    <h4>Password</h4>
                    <div style={{position:'relative', width:'100%', display: 'flex', flexDirection: 'row', alignItems:'center', marginTop:'0px'}}>
                        <input type={showPassword ? 'text' : 'password'} 
                            placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                        <span onClick={togglePasswordVisibility} style={{ cursor: 'pointer', position:'absolute', right: '10px', cursor:'pointer'}}>
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>
                </div>
            </div>
            <div className='divider'></div>
            <div>
                <div>
                    <button onClick={handleLogin}>
                        Login
                    </button>
                </div>
                <div>Don't have a account! <a href="/Signin">Sign in</a></div>
            </div>
        </div>
    </div>
  )
}

export default Login 