'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

export default function BoothSelection() {
  const router = useRouter();
  const [selectedShots, setSelectedShots] = useState(null);
  const [exitAnimation, setExitAnimation] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [showWatermark, setShowWatermark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530); // Blinking speed
    
    return () => clearInterval(interval);
  }, []);

  // Watermark animation
  const watermarkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Check for existing selection when component mounts
  useEffect(() => {
    // Try to get any previously saved selection from localStorage
    const savedShots = localStorage.getItem('selectedShots');
    if (savedShots) {
      setSelectedShots(parseInt(savedShots));
    }
  }, []);

  const toggleWatermark = () => {
    setShowWatermark(prev => !prev);
  };

  const handleContinue = () => {
    if (selectedShots) {
      // Store the selected shot count in localStorage
      localStorage.setItem('selectedShots', selectedShots.toString());
      
      // Start exit animation and show loader
      setExitAnimation(true);
      setIsLoading(true);
      
      // Navigate to next page
      setTimeout(() => {
        router.push(`/instructions?shots=${selectedShots}`);
      }, 800);
    } else {
      alert("Please select the number of shots before continuing!");
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.6 } },
  };

  // Camera shutter animation
  const shutterVariants = {
    closed: { height: '100%' },
    open: { height: '0%' }
  };

  const shotOptions = [
    { count: 1, label: "Single Shot", description: "Perfect for a profile picture" },
    { count: 3, label: "Triple Shot", description: "Explore different poses" },
    { count: 4, label: "Multi Shot", description: "Full photo session experience" }
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background subtle gradient - from landing page */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white"></div>
      
      {/* Abstract camera elements - from landing page */}
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

      {/* Cute Camera Loader - Replacing the previous loader */}
      {isLoading && (
        <motion.div 
          className="fixed inset-0 bg-white bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Cute Camera SVG with animations */}
            <motion.div 
              className="relative"
              animate={{ 
                rotate: [0, 0, 5, -5, 0],
                scale: [1, 1.05, 1, 1.05, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              {/* Camera body */}
              <motion.div className="w-20 h-16 bg-blue-500 rounded-lg relative">
                {/* Camera lens */}
                <motion.div 
                  className="absolute top-4 left-4 w-12 h-12 bg-blue-700 rounded-full border-4 border-blue-300"
                  animate={{
                    scale: [1, 0.95, 1.05, 0.95, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Inner lens */}
                  <motion.div 
                    className="absolute inset-2 bg-blue-900 rounded-full"
                    animate={{
                      scale: [0.8, 1, 0.8]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {/* Lens reflection */}
                    <motion.div 
                      className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-80"
                      animate={{
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity
                      }}
                    />
                  </motion.div>
                </motion.div>
                
                {/* Camera viewfinder */}
                <div className="absolute top-1 right-2 w-4 h-3 bg-blue-800 rounded-sm" />
                
                {/* Camera flash */}
                <motion.div 
                  className="absolute top-1 left-1 w-2 h-2 bg-yellow-300 rounded-full"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    boxShadow: [
                      "0 0 0px rgba(253, 224, 71, 0.5)",
                      "0 0 8px rgba(253, 224, 71, 0.8)",
                      "0 0 0px rgba(253, 224, 71, 0.5)"
                    ]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Shutter button */}
                <motion.div 
                  className="absolute -top-2 right-6 w-4 h-2 bg-red-500 rounded-full"
                  animate={{
                    y: [0, -2, 0]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatDelay: 1.2,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Camera strap */}
                <div className="absolute -left-4 top-4 w-4 h-1.5 bg-blue-300 rounded-full" />
                <div className="absolute -right-4 top-4 w-4 h-1.5 bg-blue-300 rounded-full" />
              </motion.div>
              
              {/* Camera flash animation */}
              <motion.div
                className="absolute inset-0 bg-white rounded-lg"
                animate={{
                  opacity: [0, 0, 0.6, 0]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            {/* Loading text */}
            <motion.p
              className="mt-6 text-blue-600 text-sm font-medium tracking-wide"
              animate={{
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.span
  animate={{
    opacity: [0, 1, 0],
    // Replace 'steps(3)' with a valid easing type
    transition: {
      ease: "easeInOut", // Using a valid easing function
      times: [0, 0.5, 1], // Control timing of opacity keyframes
      repeat: Infinity,
      duration: 1.5
    }
  }}
>
  Preparing your booth 
</motion.span>
            </motion.p>
          </motion.div>
        </motion.div>
      )}
      
      {/* Main content */}
      <motion.div 
        className="z-10 max-w-md w-full bg-white rounded-lg shadow-md p-6 border border-blue-100"
        initial="hidden"
        animate={exitAnimation ? 'exit' : 'visible'}
        variants={fadeIn}
      >
        <motion.div variants={fadeIn} className="mb-6 text-center">
          <Camera size={24} className="text-blue-500 mx-auto mb-2" />
          <h1 className="text-2xl font-medium text-gray-800">Choose Your Experience</h1>
          <p className="text-gray-500 text-sm">
            Select how many photos you'd like to capture
          </p>
        </motion.div>

        <motion.div 
          className="space-y-3 mb-6" 
          variants={fadeIn}
        >
          {shotOptions.map((option) => (
            <motion.div
              key={option.count}
              onClick={() => setSelectedShots(option.count)}
              className={`p-3 rounded-md cursor-pointer transition-all border ${
                selectedShots === option.count 
                  ? 'bg-white border-blue-500' 
                  : 'bg-white border-gray-200 hover:border-blue-300'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full mr-3 border ${
                  selectedShots === option.count 
                    ? 'border-blue-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedShots === option.count && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 text-sm">{option.label}</h3>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
                <div className="ml-auto text-xl font-medium text-blue-500">
                  {option.count}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          onClick={handleContinue}
          disabled={!selectedShots}
          className={`w-full py-3 rounded-md text-sm font-medium transition-all ${
            selectedShots 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          variants={fadeIn}
          whileHover={selectedShots ? { scale: 1.01 } : {}}
          whileTap={selectedShots ? { scale: 0.99 } : {}}
        >
          Continue to Booth
          {selectedShots && (
            <span className="ml-1 inline-flex items-center">
              
            </span>
          )}
        </motion.button>
      </motion.div>

      <motion.div 
        className="mt-4 text-xs text-blue-500 text-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.8 }}
      >
        Photos will be stored temporarily and available for download after your session
      </motion.div>

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