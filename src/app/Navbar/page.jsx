"use client";
import React, { useEffect, useState } from 'react';
import { account, ID } from '../appwrite';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null); // null indicates loading state

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    async function handleUser() {
      try {
        const response = await account.get();
        setUser(true);
        console.log("Account Details:", response);
      } catch (error) {
        setUser(false);
        console.log("No user logged in:", error);
      }
    }
    handleUser();
  }, []);

  async function handleLogout() {
    try {
      await account.deleteSession('current');
      setUser(false);
      console.log("Logged out successfully.");
    } catch (error) {
      console.log("Logout failure:", error);
    }
  }

  return (
    <div className='navbar'>
      <div className='header'>
        <img src="/footprint2.png" alt="not found" />
      </div>
      {user === null ? (
        <div></div>
      ) : (
        <>
          <div className='navbarComp'>
            <a href='/'>Home</a>
            {user && <a href='/Profile'>Profile</a>}
            <a href={user ? '/Calculator' : '/Login'}>Calculate</a>
          </div>
          <div className='login'>
            {user ? (
              <>
                <img src='/user2.png' alt='not found' />
                <a onClick={handleLogout}>Logout</a>
              </>
            ) : (
              <a href='/Login'>Login</a>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
