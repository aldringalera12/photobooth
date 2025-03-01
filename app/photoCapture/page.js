"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, ArrowLeft, Sliders, RefreshCw, Droplet, Sun, Contrast, Clock, Zap, Mountain, Image as LucideImage } from "lucide-react";
import { motion } from 'framer-motion';

// Create a client component to safely use useSearchParams
function PhotoCaptureContent() {
  const webcamRef = useRef(null);
  const router = useRouter();
  // Import useSearchParams inside a client component
  const { useSearchParams } = require("next/navigation");
  const searchParams = useSearchParams();
  const [shots, setShots] = useState(1);
  const [capturedImages, setCapturedImages] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [exitAnimation, setExitAnimation] = useState(false);

  
  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530); // Blinking speed
    
    return () => clearInterval(interval);
  }, []);

  // Filters configuration
  const filters = {
    none: "None",
    grayscale: "Grayscale",
    sepia: "Sepia",
    invert: "Negative",
    blur: "Soft Focus",
    brightness: "Bright",
    vintage: "Vintage"
  };

  const filterIcons = {
    none: Droplet,
    grayscale: Contrast, 
    sepia: Clock,
    invert: Zap,
    blur: Droplet,
    brightness: Sun,
    vintage: Mountain
  };

  // Filter CSS styles
  const filterStyles = {
    none: {},
    grayscale: { filter: "grayscale(1)" },
    sepia: { filter: "sepia(0.8)" },
    invert: { filter: "invert(0.8)" },
    blur: { filter: "blur(1px) brightness(1.1)" },
    brightness: { filter: "brightness(1.3) contrast(1.1)" },
    vintage: { filter: "sepia(0.3) contrast(1.1) brightness(0.9) saturate(1.5)" }
  };

  // Retrieve number of shots from URL parameters
  useEffect(() => {
    const shotsFromUrl = searchParams.get("shots");
    setShots(shotsFromUrl ? parseInt(shotsFromUrl) : 1);
  }, [searchParams]);

  // Check if all shots are captured to show the generate button
  useEffect(() => {
    if (capturedImages.length >= shots && shots > 0) {
      setShowGenerateButton(true);
    } else {
      setShowGenerateButton(false);
    }
  }, [capturedImages, shots]);

  // Function to take a photo
  const takePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImages((prev) => [...prev, { src: imageSrc, filter: selectedFilter }]);
      }
    }
    setIsCapturing(false);
  };

  // Countdown logic - Fixed dependency array to include takePhoto
  useEffect(() => {
    if (countdown === 0) {
      takePhoto();
      setCountdown(null);
    }
  }, [countdown, takePhoto]);

  const startCountdown = () => {
    if (!isCapturing && capturedImages.length < shots) {
      setIsCapturing(true);
      let count = 3;
      setCountdown(count);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Watermark animation
  const watermarkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const toggleWatermark = () => {
    setShowWatermark(prev => !prev);
  };

  const [showWatermark, setShowWatermark] = useState(false);

  const handleCameraError = () => {
    setCameraError(true);
  };

  const resetCapture = () => {
    setCapturedImages([]);
  };

  const handleGenerateBackground = async () => {
    try {
      // Apply the selected filter to all captured images
      const filteredImages = await Promise.all(
        capturedImages.map(async (image) => {
          const img = document.createElement('img'); // Use document.createElement
          img.src = image.src;

          // Wait for the image to load
          await new Promise((resolve) => {
            img.onload = resolve;
          });

          // Create a canvas and apply the filter
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');

          // Apply the selected filter
          ctx.filter = getFilterStyle(selectedFilter);
          ctx.drawImage(img, 0, 0);

          // Convert the filtered image back to a data URL
          const filteredImageSrc = canvas.toDataURL('image/png');

          return { src: filteredImageSrc, filter: selectedFilter };
        })
      );

      // Store the filtered images in localStorage
      localStorage.setItem('photoBoothImages', JSON.stringify(filteredImages));
      // Start exit animation and show loader
      setExitAnimation(true);
      setIsLoading(true);
      router.push("/background?complete=true");
    } catch (error) {
      console.error("Error processing images:", error);
      // Fallback if something goes wrong
      router.push("/background?complete=true");
    }
  };

  const getFilterStyle = (filter) => {
    switch (filter) {
      case 'grayscale':
        return 'grayscale(1)';
      case 'sepia':
        return 'sepia(0.8)';
      case 'invert':
        return 'invert(0.8)';
      case 'blur':
        return 'blur(1px) brightness(1.1)';
      case 'brightness':
        return 'brightness(1.3) contrast(1.1)';
      case 'vintage':
        return 'sepia(0.3) contrast(1.1) brightness(0.9) saturate(1.5)';
      default:
        return 'none';
    }
  };

  // Camera shutter animation
  const shutterVariants = {
    closed: { height: '100%' },
    open: { height: '0%' }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-blue-50 to-white p-4 md:p-6 relative overflow-hidden">
      {/* Abstract camera elements in background */}
      <motion.div 
        className="absolute top-20 right-24 w-16 h-16 border-4 border-blue-500 rounded-full opacity-50 pointer-events-none"
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
        className="absolute bottom-32 left-24 w-20 h-14 rounded border-2 border-purple-500 opacity-50 pointer-events-none"
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
      
      {/* Geometric decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-40 left-1/4 w-8 h-8 rounded bg-blue-300 opacity-20"
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute bottom-40 right-1/4 w-12 h-12 rounded-full bg-purple-300 opacity-20"
          animate={{ 
            x: [0, -20, 0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute top-1/3 right-1/3 w-6 h-6 rotate-45 bg-blue-400 opacity-15"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.15, 0.3, 0.15]
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
                  opacity: [0, 1, 0]
                }}
                transition={{
                  ease: "easeInOut",
                  times: [0, 0.5, 1],
                  repeat: Infinity,
                  duration: 1.5
                }}
              >
                Preparing your booth 
              </motion.span>
            </motion.p>
          </motion.div>
        </motion.div>
      )}
      
      {/* Main Content Area */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center z-10">
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center text-blue-500 hover:text-blue-700 transition bg-white p-2 rounded-full shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-light text-center text-gray-800">Photo Booth</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        {/* Main Content Area */}
        <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Enhanced Filters - Vertical on the left */}
          <div className="w-full md:w-1/6 bg-white rounded-xl p-4 shadow-sm h-min border border-gray-100">
            <div className="flex items-center mb-3">
              <Sliders size={16} className="mr-2 text-blue-500" />
              <h3 className="font-normal text-sm text-gray-700">Filters</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(filters).map(([key, name]) => {
                const FilterIcon = filterIcons[key];
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedFilter(key)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                      selectedFilter === key 
                        ? "bg-blue-50 text-blue-600 border border-blue-200" 
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent"
                    }`}
                  >
                    <FilterIcon 
                      size={16} 
                      className={`mb-1 ${selectedFilter === key ? "text-blue-500" : "text-gray-500"}`} 
                    />
                    <span className="text-xs">{name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Camera View */}
          <div className="w-full md:w-1/2 flex flex-col">
            {cameraError ? (
              <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                <p className="text-gray-500 text-center px-6 text-sm">
                  Unable to access camera. Please ensure you've granted camera permissions.
                </p>
              </div>
            ) : (
              <>
                <div className="relative aspect-video border-2 border-gray-200 rounded-xl overflow-hidden bg-black">
                  {/* Camera flash effect */}
                  {isCapturing && countdown === 0 && (
                    <motion.div
                      className="absolute inset-0 bg-white pointer-events-none z-10"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                  
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/png"
                    className="w-full h-full rounded-lg object-cover"
                    onUserMediaError={handleCameraError}
                    style={{ 
                      transform: "scaleX(-1)",
                      ...filterStyles[selectedFilter]
                    }}
                  />
                  
                  {/* Capture count indicator at the top */}
                  <div className="absolute top-3 right-3 bg-black bg-opacity-50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs">
                    <span>
                      {capturedImages.length === shots 
                        ? "All photos captured!" 
                        : `${capturedImages.length + 1} of ${shots}`}
                    </span>
                  </div>
                  
                  {/* Countdown now directly in the camera view */}
                  {countdown !== null && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="text-7xl font-light text-white"
                        style={{
                          textShadow: "0 0 10px rgba(0,0,0,0.5)",
                          animation: "pulse 1s ease-in-out infinite alternate",
                        }}
                      >
                        {countdown}
                      </div>
                    </div>
                  )}
                  
                  {/* Filter indicator */}
                  <div className="absolute top-3 left-3 bg-black bg-opacity-50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs">
                    <span>{filters[selectedFilter]}</span>
                  </div>
                </div>
                
                {/* Take Photo button moved below the camera view */}
                <div className="mt-4 flex justify-center gap-3">
                  {!showGenerateButton ? (
                    <motion.button
                      onClick={startCountdown}
                      disabled={isCapturing || capturedImages.length >= shots}
                      className="flex items-center px-6 py-2.5 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)" }}
                      whileTap={{ y: 0 }}
                    >
                      <Camera size={18} className="mr-2" /> 
                      {capturedImages.length >= shots ? "Done" : "Take Photo"}
                      <div className="flex items-center ml-1">
                      </div>
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handleGenerateBackground}
                      className="flex items-center px-6 py-2.5 bg-green-500 text-white rounded-full shadow-md hover:bg-blue-600 transition"
                      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(34, 197, 94, 0.2)" }}
                      whileTap={{ y: 0 }}
                    >
                      <LucideImage size={18} className="mr-2" /> 
                      Generate Background
                      <div className="flex items-center ml-1">
                      </div>
                    </motion.button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Captured Photos Gallery */}
          <div className="w-full md:w-1/3 bg-white rounded-xl p-4 h-min shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-normal text-gray-700 flex items-center">
                <RefreshCw size={14} className="mr-2 text-blue-500" /> Gallery
              </h2>
              {capturedImages.length > 0 && (
                <span className="text-xs text-blue-500">
                  {capturedImages.length} shot{capturedImages.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            {capturedImages.length === 0 ? (
              <div className="h-32 flex items-center justify-center border border-dashed border-gray-200 rounded-lg bg-gray-50">
                <p className="text-gray-400 text-center text-xs">No photos captured yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {capturedImages.map((image, index) => (
                  <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-white border border-gray-100">
                    {/* Using Next.js Image component instead of img */}
                    <div className="relative w-full h-full">
                      <Image 
                        src={image.src} 
                        alt={`Photo ${index + 1}`}
                        fill
                        style={{
                          objectFit: "cover",
                          ...filterStyles[image.filter],
                          transform: "scaleX(-1)" // Mirror the captured photos
                        }}
                        priority
                      />
                    </div>
                    <div className="absolute top-2 left-2 bg-black bg-opacity-50 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                      #{index + 1}
                    </div>
                    {image.filter !== 'none' && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                        {filters[image.filter]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {capturedImages.length > 0 && (
              <motion.button
                onClick={resetCapture}
                className="w-full mt-3 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition text-xs font-normal"
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
              >
                Reset & Capture Again
              </motion.button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-xs text-gray-500 max-w-2xl text-center bg-gray-50 p-3 rounded-lg">
          <p>Position yourself in the frame and select a filter if desired. Click "Take Photo" to start the countdown.
             All photos will be saved to the gallery with the same mirrored view as the camera.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          from { transform: scale(1); opacity: 0.8; }
          to { transform: scale(1.05); opacity: 1; }
        }
      `}</style>
    </main>
  );
}

// Wrap the component in Suspense to handle useSearchParams
export default function PhotoCapture() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-blue-500 text-center">
          <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading photo booth...
        </div>
      </div>
    }>
      <PhotoCaptureContent />
    </Suspense>
  );
}