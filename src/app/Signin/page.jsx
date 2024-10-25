'use client'
import React, { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { account, ID } from '../appwrite'
import { useRouter } from 'next/navigation';
import Toast from '../../Components/Toast';
import './Signin.css'

const Signin = () => {
    const [userName , setUserName] = useState('');
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [contact , setContact] = useState('');
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
            setContact('')
            setToastMessage('Login successful!');
            return true
        }
        catch(e){
            console.error("Login error:",  e.message || e)
            setToastMessage('Login failed. Please try again.');
            return false;
        }
    }  
  
    async function handleRegister(){ 
        if (!userName || !email || !password) {
            setToastMessage('Please fill in all fields.');
            return;
        }  
    
        try{
            const result = await account.create(ID.unique(), email, password, userName, contact);
            console.log("Registration successful:",result);
            const loginSuccess = await handleLogin();
            if (loginSuccess) {
              setToastMessage('Redirecting to Profile...');
              setTimeout(() => {
                router.push('/Profile');
              }, 2000);
            }
    
            setTimeout(() => {
                router.push('/Profile'); 
            }, 1000);
        }
        catch(e){
            console.error("Registration error:", e.message || e)
            setToastMessage('Registration failed. Please try again.');
        }
    }  
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
  
    return (
    <div className='signin'>
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
                    <h4>Contact</h4>
                    <input type="text" placeholder='Contact' value={contact} onChange={(e) => setContact(e.target.value)}/>
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
                <button>
                    <img src="/google.png" alt="not found"/>
                    Create using Google
                </button>
                <button>
                    <img src="/facebook.png" alt="not found"/>
                    Create using Facebook
                </button>
                <div>
                    <button onClick={handleRegister}>
                        Register
                    </button>
                </div>
            </div>
        </div>
    </div>
    )  
}

export default Signin