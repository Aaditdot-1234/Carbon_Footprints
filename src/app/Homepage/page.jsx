'use client'
import React, { useState, useEffect } from 'react';
import './Home.css';
import { motion } from 'framer-motion';
import Navbar from '../Navbar/page';

const features = [
  {
    id: 1,
    name: "Calculation",
    description: "Calculate the user's carbon footprint based on their daily activities.",
    info: 'Calculate',
    goto: '/Login'
  },
  {
    id: 2,
    name: "Visualization",
    description: "Show graphs and charts representing carbon footprint trends over time.", 
    info: 'Calculate',
    goto: '/Login'
  },
  {
    id: 3,
    name: "Leaderboard",
    description: "Rank users based on their carbon footprint reduction.",
    info: 'View',
    goto: '/Login'
  },
  {
    id: 4,
    name: "History",
    description: "Store and display the user’s past carbon footprint calculations.",
    info: 'View',
    goto: '/Login'
  }
];

const CarouselItem = ({currentStepIndex}) => {
  const featureKeys = Object.keys(features);

  const getClassName = (index) => {
      if (index === currentStepIndex) {
        return 'carouseltems center';
      } else if (index === (currentStepIndex - 1 + featureKeys.length) % featureKeys.length) {
        return 'carouseltems left';
      } else if (index === (currentStepIndex + 1) % featureKeys.length) {
        return 'carouseltems right';
      } else {
        return 'carouseltems hidden';
      }
  };

  return (
    <div className='Carousel'>
      {
        featureKeys.map((keys, index) => (
          <div key={keys} className={getClassName(index)}>
            <h1>{features[keys].name}</h1>
            <h3>{features[keys].description}</h3>
            <a href={features[keys].goto}>{features[keys].info}</a>
          </div>
        ))
      }
    </div>
  );
}

const HomePage = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)


  const Timeout = () => {
    if(currentStepIndex < (features.length - 1)){
        setCurrentStepIndex(currentStepIndex + 1)
    }
    else{
        setCurrentStepIndex(0)
    }
  }

  useEffect(() => {
    const timer = setTimeout(Timeout,5000); 
    return () => clearTimeout(timer);
  },[currentStepIndex])

  return (
    <>
      <Navbar/>
      <div className='Home'>
        <div className='section1'>
          <motion.div
            className="overlay"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay:2 ,duration: 3, type: 'spring', stiffness: 7 }}
          >
          </motion.div>
        </div>
        <div className='section2'>
          <div className='overlay2'>
            <motion.div
              initial={{ opacity:0, x :-100}}
              whileInView={{ opacity:1, x : 0}}
              transition={{ delay:1, duration: 3, type: 'spring', stiffness: 50}}
              viewport={{ once: true, amount: 0.5 }}  
              className='motiondiv'          
            >
              <img src="/foot.png" alt="not found"/>
              <h1>Measure</h1>
              <h3>Use our carbon footprint calculators for individuals, small businesses, charities and churches</h3>
            </motion.div>  
            <div>
              <motion.div
                  initial={{ opacity:0, x :+100}}
                  whileInView={{ opacity:1, x : 0}}
                  transition={{ delay:2, duration: 3, type: 'spring', stiffness: 50}}
                  viewport={{ once: true, amount: 0.5 }}  
                  className='motiondiv2'          
              >
                  <img src="/globe1.jpg" alt="not found"/>
              </motion.div>
              <motion.div
                  initial={{ opacity:0, x :+100}}
                  whileInView={{ opacity:1, x : 0}}
                  transition={{ delay:3, duration: 3, type: 'spring', stiffness: 50}}
                  viewport={{ once: true, amount: 0.5 }}  
                  className='motiondiv2'          
              >
                  <img src="/globe2.jpg" alt="not found"/>
              </motion.div>
            </div>
          </div>
        </div>
        <div className='section3'>
          <div className='overlay3'>
            <h1>What we offer</h1>
            <CarouselItem currentStepIndex={currentStepIndex}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;