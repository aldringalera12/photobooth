"use client";


import { useRouter, useSearchParams } from "next/navigation";

import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Download, Share, Calendar, Plus, Sliders, Move, Trash, Palette, Maximize, Minimize, Image } from "lucide-react";
import html2canvas from 'html2canvas';

export default function BackgroundPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [images, setImages] = useState([]);
  const [cardColor, setCardColor] = useState("#f5a9b8"); // Default pink for the card background
  const [showDate, setShowDate] = useState(true); // Toggle for date display
  const [customColor, setCustomColor] = useState("#f5a9b8");
  const [stripWidth, setStripWidth] = useState(320); // Default width
  const [stripGap, setStripGap] = useState(12); // Gap between photos
  const [stripPadding, setStripPadding] = useState(24); // Padding inside the strip
  const [borderRadius, setBorderRadius] = useState(12); // Border radius for photos
  const [borderWidth, setBorderWidth] = useState(2); // Border width for photos
  const [borderColor, setBorderColor] = useState("#ffffff"); // Border color for photos
  const [dateFormat, setDateFormat] = useState("short"); // Date format options
  const [stripMinimized, setStripMinimized] = useState(false); // Toggle for minimized view
  const [activeTab, setActiveTab] = useState("colors"); // Active customization tab
  const [isSaving, setIsSaving] = useState(false); // State for save operation
  const [saveSuccess, setSaveSuccess] = useState(false); // State for save success feedback
  const [dateFontColor, setDateFontColor] = useState("#000000");

  const fontColorPresets = [
    "#000000", // Black
    "#ffffff", // White
    "#ff0000", // Red
    "#00ff00", // Green
    "#0000ff", // Blue
    "#ffff00", // Yellow
    "#ff00ff", // Magenta
    "#00ffff", // Cyan
    "#808080", // Gray
  ];
  
  const photoStripRef = useRef(null); // Reference to the photo strip for html2canvas

  useEffect(() => {
    // Check if we're coming from the photo capture page
    const isComplete = searchParams.get("complete") === "true";
    
    if (isComplete) {
      try {
        // Retrieve the images from localStorage
        const storedImages = localStorage.getItem('photoBoothImages');
        if (storedImages) {
          const parsedImages = JSON.parse(storedImages);
          setImages(parsedImages);
        } else {
          // Fallback to placeholder images if no stored images found
          setImages([
            { src: "/api/placeholder/400/400", filter: "none" },
            { src: "/api/placeholder/400/400", filter: "sepia" },
            { src: "/api/placeholder/400/400", filter: "grayscale" },
            { src: "/api/placeholder/400/400", filter: "vintage" }
          ]);
        }
      } catch (error) {
        console.error("Error retrieving images:", error);
        // Fallback to placeholder images
        setImages([
          { src: "/api/placeholder/400/400", filter: "none" },
          { src: "/api/placeholder/400/400", filter: "sepia" },
          { src: "/api/placeholder/400/400", filter: "grayscale" },
          { src: "/api/placeholder/400/400", filter: "vintage" }
        ]);
      }
    } else {
      // Redirect if no images are available
      router.push("/");
    }
  }, [searchParams, router]);

  // Filter CSS styles - copied from PhotoCapture for consistent rendering
  const filterStyles = {
    none: {},
    grayscale: { filter: "grayscale(1)" },
    sepia: { filter: "sepia(0.8)" },
    invert: { filter: "invert(0.8)" },
    blur: { filter: "blur(1px) brightness(1.1)" },
    brightness: { filter: "brightness(1.3) contrast(1.1)" },
    vintage: { filter: "sepia(0.3) contrast(1.1) brightness(0.9) saturate(1.5)" }
  };

  const handleCustomColorChange = (e) => {
    setCustomColor(e.target.value);
    // Apply color immediately for better UX
    setCardColor(e.target.value);
  };

  const handleSave = async () => {
    if (!photoStripRef.current) return;
    
    try {
      setIsSaving(true);
      
      // Temporarily remove minimized state for capture
      const wasMinimized = stripMinimized;
      if (wasMinimized) setStripMinimized(false);
  
      // Apply inline styles for filters
      const imagesWithFilters = photoStripRef.current.querySelectorAll("img");
      imagesWithFilters.forEach((img) => {
        const filterType = img.getAttribute("data-filter");
        if (filterType && filterStyles[filterType]) {
          img.style.filter = filterStyles[filterType].filter; // Apply filter inline
        }
      });
      
      // Small delay to ensure the DOM has updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Use html2canvas to capture the photo strip
      const canvas = await html2canvas(photoStripRef.current, {
        useCORS: true,
        scale: 2, // Higher quality
        backgroundColor: null, // Transparent background
      });
      
      // Convert to image and trigger download
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `photo-strip-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Reset minimized state if needed
      if (wasMinimized) setStripMinimized(true);
      
      // Show success feedback
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving photo strip:", error);
      alert("There was a problem saving your photo strip. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Function to handle sharing the photo strip
  const handleShare = async () => {
    if (!photoStripRef.current) return;
    
    try {
      setIsSaving(true);
      
      // Temporarily remove minimized state for capture
      const wasMinimized = stripMinimized;
      if (wasMinimized) setStripMinimized(false);
      
      // Small delay to ensure the DOM has updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Use html2canvas to capture the photo strip
      const canvas = await html2canvas(photoStripRef.current, {
        useCORS: true,
        scale: 2, // Higher quality
        backgroundColor: null, // Transparent background
      });
      
      // Convert to blob for sharing
      canvas.toBlob(async (blob) => {
        try {
          if (!blob) throw new Error("Failed to create image blob");
          
          // Check if Web Share API is available
          if (navigator.share) {
            await navigator.share({
              title: 'My Photo Strip',
              files: [new File([blob], 'photo-strip.png', { type: 'image/png' })]
            });
          } else {
            // Fallback if Web Share API is not available
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `photo-strip-${new Date().toISOString().split('T')[0]}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } catch (error) {
          console.error("Error sharing photo strip:", error);
          alert("There was a problem sharing your photo strip. You can try saving it instead.");
        } finally {
          // Reset minimized state if needed
          if (wasMinimized) setStripMinimized(true);
          setIsSaving(false);
        }
      }, 'image/png');
      
    } catch (error) {
      console.error("Error sharing photo strip:", error);
      alert("There was a problem preparing your photo strip for sharing. Please try again.");
      setIsSaving(false);
    }
  };

  // Date format options
  const dateFormats = {
    short: new Date().toLocaleDateString(),
    long: new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    time: new Date().toLocaleString()
  };

  // Generate range slider with label
  const RangeSlider = ({ label, value, onChange, min, max, step = 1 }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-xs text-gray-500">{value}px</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );

  // Color picker component
  const ColorPicker = ({ color, onChange, label }) => (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2 text-gray-700">{label}</h3>
      <div className="flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-lg border border-gray-200" 
          style={{ backgroundColor: color }}
        ></div>
        <div className="flex-1">
          <input 
            type="color" 
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-8 cursor-pointer rounded"
          />
        </div>
      </div>
    </div>
  );

  // Presets for background color
  const colorPresets = [
    "#f5a9b8", "#a9def5", "#d4f5a9", "#f5d6a9", "#e5a9f5", 
    "#f5f5f5", "#000000", "#ffffff", "#ff4d4d", "#4d79ff"
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-4 md:p-6 bg-gray-50">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Header - Minimalist version */}
        <div className="w-full flex justify-between items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-500 bg-white hover:bg-gray-50 transition p-2 rounded-full shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-xl font-light text-center text-gray-800">Your Photo Strip</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        {/* Content area with side panel and photo strip */}
        <div className="w-full flex flex-col md:flex-row gap-6 items-start">
          {/* Left sidebar for customization - Simplified */}
          <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-medium">Customize</h2>
              <button 
                onClick={() => setStripMinimized(!stripMinimized)}
                className="text-gray-400 hover:text-gray-600 transition"
                title={stripMinimized ? "Maximize Strip" : "Minimize Strip"}
              >
                {stripMinimized ? <Maximize size={16} /> : <Minimize size={16} />}
              </button>
            </div>
            
            {/* Customization Tabs - Simplified */}
            <div className="flex border-b border-gray-100 mb-4">
              <button 
                onClick={() => setActiveTab("colors")}
                className={`flex items-center px-3 py-1.5 text-xs ${activeTab === "colors" ? "text-blue-500 border-b border-blue-500" : "text-gray-500"}`}
              >
                <Palette size={14} className="mr-1" /> Colors
              </button>
              <button 
                onClick={() => setActiveTab("layout")}
                className={`flex items-center px-3 py-1.5 text-xs ${activeTab === "layout" ? "text-blue-500 border-b border-blue-500" : "text-gray-500"}`}
              >
                <Sliders size={14} className="mr-1" /> Layout
              </button>
              <button 
                onClick={() => setActiveTab("extras")}
                className={`flex items-center px-3 py-1.5 text-xs ${activeTab === "extras" ? "text-blue-500 border-b border-blue-500" : "text-gray-500"}`}
              >
                <Image size={14} className="mr-1" /> Extras
              </button>
            </div>
            
            {/* Tab content container with fixed height and scrolling */}
            <div className="h-56 overflow-y-auto pr-2 mb-4">
              {/* Colors Tab */}
              {activeTab === "colors" && (
                <div className="space-y-4">
                  {/* Background Color selection */}
                  <ColorPicker 
                    color={cardColor} 
                    onChange={setCardColor} 
                    label="Background Color" 
                  />
                  
                  {/* Color presets */}
                  <div className="mb-4">
                    <h3 className="text-xs font-medium mb-2 text-gray-500">Presets</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {colorPresets.map((color, index) => (
                        <button 
                          key={index}
                          onClick={() => setCardColor(color)} 
                          className="w-6 h-6 rounded-full border hover:scale-110 transition"
                          style={{ 
                            backgroundColor: color,
                            borderColor: color === "#ffffff" ? "#e0e0e0" : "white"
                          }}
                        ></button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Border Color */}
                  <ColorPicker 
                    color={borderColor} 
                    onChange={setBorderColor} 
                    label="Border Color" 
                  />
                </div>
              )}
              
              {/* Layout Tab */}
              {activeTab === "layout" && (
                <div className="space-y-3">
                  <RangeSlider 
                    label="Strip Width" 
                    value={stripWidth} 
                    onChange={setStripWidth} 
                    min={200} 
                    max={500} 
                  />
                  
                  <RangeSlider 
                    label="Photo Spacing" 
                    value={stripGap} 
                    onChange={setStripGap} 
                    min={4} 
                    max={24} 
                  />
                  
                  <RangeSlider 
                    label="Strip Padding" 
                    value={stripPadding} 
                    onChange={setStripPadding} 
                    min={8} 
                    max={40} 
                  />
                  
                  <RangeSlider 
                    label="Border Radius" 
                    value={borderRadius} 
                    onChange={setBorderRadius} 
                    min={0} 
                    max={24} 
                  />
                  
                  <RangeSlider 
                    label="Border Width" 
                    value={borderWidth} 
                    onChange={setBorderWidth} 
                    min={0} 
                    max={8} 
                  />
                </div>
              )}
              
              {/* Extras Tab */}
              {activeTab === "extras" && (
                <div className="space-y-3">
                  {/* Date format options */}
                  <div>
                    <h3 className="text-xs font-medium mb-2 text-gray-700">Date Format</h3>
                    <div className="grid grid-cols-1 gap-1.5">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="dateNone" 
                          checked={!showDate} 
                          onChange={() => setShowDate(false)} 
                          className="mr-2" 
                        />
                        <label htmlFor="dateNone" className="text-xs text-gray-600">No date</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="dateShort" 
                          checked={showDate && dateFormat === "short"} 
                          onChange={() => {setShowDate(true); setDateFormat("short")}} 
                          className="mr-2" 
                        />
                        <label htmlFor="dateShort" className="text-xs text-gray-600">Short ({dateFormats.short})</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="dateLong" 
                          checked={showDate && dateFormat === "long"} 
                          onChange={() => {setShowDate(true); setDateFormat("long")}} 
                          className="mr-2" 
                        />
                        <label htmlFor="dateLong" className="text-xs text-gray-600">Long</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="dateTime" 
                          checked={showDate && dateFormat === "time"} 
                          onChange={() => {setShowDate(true); setDateFormat("time")}} 
                          className="mr-2" 
                        />
                        <label htmlFor="dateTime" className="text-xs text-gray-600">Date & Time</label>
                      </div>
                    </div>
                  </div>

                  {/* Font Color Picker */}
                  <div>
                    <h3 className="text-xs font-medium mb-2 text-gray-700">Date Font Color</h3>
                    <div className="flex items-center gap-2">
                      {/* Color Preview */}
                      <div 
                        className="w-6 h-6 rounded-lg border border-gray-200"
                        style={{ backgroundColor: dateFontColor }}
                      ></div>
                      {/* Color Input */}
                      <input 
                        type="color" 
                        value={dateFontColor}
                        onChange={(e) => setDateFontColor(e.target.value)}
                        className="w-full h-6 cursor-pointer rounded"
                      />
                    </div>
                    {/* Preset Colors */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {fontColorPresets.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => setDateFontColor(color)}
                          className="w-5 h-5 rounded-full border hover:scale-110 transition"
                          style={{ 
                            backgroundColor: color,
                            borderColor: color === "#ffffff" ? "#e0e0e0" : "white"
                          }}
                        ></button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Action buttons - Simplified */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              {saveSuccess && (
                <div className="bg-green-50 text-green-700 text-xs p-1.5 rounded mb-2 text-center">
                  Photo strip saved successfully!
                </div>
              )}
              
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:bg-blue-300 disabled:cursor-not-allowed text-sm"
              >
                {isSaving ? "Saving..." : (
                  <>
                    <Download size={14} className="mr-1.5" /> 
                    Save Photo
                  </>
                )}
              </button>
              <button 
                onClick={handleShare}
                disabled={isSaving}
                className="w-full flex items-center justify-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed text-sm"
              >
                {isSaving ? "Processing..." : (
                  <>
                    <Share size={14} className="mr-1.5" /> 
                    Share
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Photo Strip with preview area */}
          <div className="flex-1 flex justify-center items-center">
            <div 
              ref={photoStripRef}
              className="rounded-lg shadow-sm transition-all duration-300 flex justify-center items-center"
              style={{ 
                backgroundColor: cardColor,
                padding: `${stripPadding}px`,
                width: stripMinimized ? '160px' : `${stripWidth}px`,
                transform: stripMinimized ? 'scale(0.6)' : 'scale(1)'
              }}
            >
              {/* Vertical photo strip layout */}
              <div className="flex flex-col w-full" style={{ gap: `${stripGap}px` }}>
                {images.map((image, index) => (
                  <div 
                    key={index} 
                    className="relative overflow-hidden bg-white"
                    data-filter={image.filter} // Store filter type
                    style={{ 
                      borderRadius: `${borderRadius}px`,
                      border: `${borderWidth}px solid ${borderColor}`
                    }}
                  >
                    <img 
                      src={image.src} 
                      alt={`Photo ${index + 1}`} 
                      className="w-full h-auto"
                      style={{
                        ...filterStyles[image.filter],
                        transform: "scaleX(-1)" // Keep consistent with camera view
                      }}
                    />
                  </div>
                ))}
                
                {/* Date stamp at bottom - only show if enabled */}
                {showDate && (
                  <div 
                    className="text-center mt-1"
                    style={{ 
                      color: dateFontColor,
                      fontSize: stripMinimized ? '9px' : '11px',
                      lineHeight: '1',
                    }}
                  >
                    <span>
                      {dateFormats[dateFormat]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}