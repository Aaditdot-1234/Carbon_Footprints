import React, { useState } from 'react'
import { motion } from 'framer-motion'
const Card = ({
    children, 
    className='',   
    initial = { opacity: 0 },
    final = { opacity: 1 },
    delay = 0,
    duration = 1.5,
    scaleOnClick = false, 
    scale=1,
    transformOrigin= 'top left',
    ontoggle
  }) => {

  const [isFullScreen ,setIsFullScreen] = useState(false)  
  const handleClick = () => {
    if(scaleOnClick){
      setIsFullScreen(!isFullScreen)
      ontoggle && ontoggle();
    }
  }  

  return ( 
    <motion.div
      className={`rounded-2xl shadow-2 p-2.5 flex items-center justify-center bg-white ${className}`}
      initial={initial}
      animate={{
        scale: isFullScreen ? scale : 1,
        opacity: 1,
        zIndex: isFullScreen ? 50 : 1,
      }}
      transition={{ delay, duration, type: 'spring', stiffness: 50 }}
      onClick={handleClick}
      style={{ transformOrigin }} 
      viewport={{ once: true, amount: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

export default Card