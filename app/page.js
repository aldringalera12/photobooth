'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const [cursorVisible, setCursorVisible] = useState(true);
  const [showWatermark, setShowWatermark] = useState(false);
  
  // Blinking cursor effect
useEffect(() => {
  const interval = setInterval(() => {
    setCursorVisible(prev => !prev);
  }, 530); // Blinking speed

  return () => clearInterval(interval);
}, [setCursorVisible]); // Add `setCursorVisible` to the dependency array
  const handleStartClick = () => {
    router.push('/booth'); // Navigates to the new booth selection page
  };

  const toggleWatermark = () => {
    setShowWatermark(prev => !prev);
  };

  // Camera shutter animation
  const shutterVariants = {
    closed: { height: '100%' },
    open: { height: '0%' }
  };

  // Watermark animation
  const watermarkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white"></div>
      
      {/* Abstract camera elements */}
      <motion.div 
        className="absolute top-20 right-24 w-16 h-16 border-4 border-blue-500 rounded-full"
        animate={{ 
          scale: [1, 1.1, 1],
          borderColor: ['#3b82f6', '#8b5cf6', '#3b82f6']
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div 
          className="absolute inset-2 bg-blue-200 rounded-full"
          animate={{ 
            scale: [0.8, 1, 0.8],
            backgroundColor: ['#bfdbfe', '#c7d2fe', '#bfdbfe']
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-32 left-24 w-20 h-14 rounded border-2 border-purple-500"
        animate={{ 
          rotate: [0, 5, 0, -5, 0],
          borderColor: ['#8b5cf6', '#3b82f6', '#8b5cf6'] 
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div 
          className="absolute top-0 left-0 right-0 bg-purple-300 origin-bottom"
          variants={shutterVariants}
          initial="closed"
          animate="open"
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
        />
      </motion.div>
      
      {/* Camera flash effect */}
      <motion.div
        className="absolute inset-0 bg-white pointer-events-none"
        animate={{ opacity: [0, 0, 0.8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
      />
      
      {/* Geometric decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-40 left-1/4 w-8 h-8 rounded bg-blue-300 opacity-40"
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute bottom-40 right-1/4 w-12 h-12 rounded-full bg-purple-300 opacity-40"
          animate={{ 
            x: [0, -20, 0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute top-1/3 right-1/3 w-6 h-6 rotate-45 bg-blue-400 opacity-30"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {/* Main content */}
      <div className="z-10 text-center px-4 w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <h1 className="text-5xl font-bold mb-6 text-gray-800">Photobooth</h1>
          <p className="text-xl text-gray-600 mb-10 max-w-md mx-auto">
            Capture beautiful memories with our modern photobooth experience
          </p>
        </motion.div>
        
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            onClick={handleStartClick}
            className="bg-white text-blue-600 border border-blue-200 px-8 py-3 rounded-lg text-lg font-medium shadow-sm flex items-center gap-2 hover:bg-blue-50 transition-colors"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.1)" }}
            whileTap={{ y: 0 }}
          >
            Start
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </motion.button>
        </motion.div>
      </div>
      
    {/* Elevate Icon in Bottom Right - Highlighted */}
<motion.div 
  className="absolute bottom-6 right-6 z-20 cursor-pointer"
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
  onClick={toggleWatermark}
>
  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full shadow-lg flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  </div>
</motion.div>

{/* Watermark Overlay with 50% Transparency */}
{showWatermark && (
  <motion.div 
    className="absolute inset-0 bg-opacity-50 flex items-center justify-center z-30 backdrop-blur-sm"
    initial="hidden"
    animate="visible"
    variants={watermarkVariants}
    transition={{ duration: 0.5 }}
    onClick={toggleWatermark}
  >
    <motion.div 
      className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl p-8 max-w-md text-black shadow-xl"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Created By</h2>
        <p className="text-xl mb-4">Aldrin Galera</p>
        <div className="bg-black h-px w-32 mx-auto mb-4 opacity-70"></div>
        <p className="text-black text-opacity-90 mb-6">
        Aspiring Full Stack Developer
        </p>
      </div>
      
      {/* Contact Information Section */}
      <div className="mt-2">
        <p className="text-black text-opacity-90 font-medium mb-3 text-center">Get in Touch</p>
        
        {/* Email */}
        <div className="flex items-center mb-2 justify-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-black text-opacity-80">aldringalera12@gmail.com</p>
        </div>
        
        {/* Phone */}
        <div className="flex items-center mb-4 justify-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <p className="text-black text-opacity-80">092 928 41105</p>
        </div>
        
        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mt-2">
          {/* Instagram */}
          <a target="_blank" href="https://www.instagram.com/dringalera/" className="text-black hover:text-blue-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            
          </a>
          
          {/* Facebook */}
          <a target="_blank" href="https://www.facebook.com/aldringalera16/" className="text-black hover:text-blue-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
            </svg>
          </a>
          
          {/* Twitter */}
          <a href="#" className="text-black hover:text-blue-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
          </a>
          
          {/* LinkedIn */}
          <a href="#" className="text-black hover:text-blue-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
            </svg>
          </a>
        </div>
      </div>
      
      <p className="text-black text-opacity-70 text-sm mt-6 text-center">
        Tap anywhere to close
      </p>
    </motion.div>
  </motion.div>
)}
    </main>
  );
}