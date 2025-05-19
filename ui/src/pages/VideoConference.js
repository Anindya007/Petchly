import React, { useState, useEffect, useRef } from "react";
import CallControls from "../components/CallControls";
import { toast } from "react-toastify";

const VideoConference = () => {
  // State for call status and controls
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  // Refs for video elements
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  
  // Ref for local stream
  const localStreamRef = useRef(null);
  
  // Simulated remote stream , later it will be replaced with actual remote stream
  const simulateRemoteStream = () => {
    // For simulation, we'll just create a canvas with animation
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    // Create a simulated video stream from the canvas
    const stream = canvas.captureStream(30); // 30 FPS
    
    // Animation function to simulate video content
    const drawFrame = () => {
      if (!isConnected) return;
      
      // Clear canvas
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw a simple animation
      const time = Date.now() / 1000;
      ctx.fillStyle = '#3498db';
      ctx.beginPath();
      ctx.arc(
        canvas.width / 2 + Math.cos(time) * 100,
        canvas.height / 2 + Math.sin(time) * 100,
        50,
        0,
        2 * Math.PI
      );
      ctx.fill();
      
      // Add text
      ctx.fillStyle = '#333';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Remote User', canvas.width / 2, 50);
      
      requestAnimationFrame(drawFrame);
    };
    
    requestAnimationFrame(drawFrame);
    return stream;
  };
  
  // Handle starting local stream
  const startLocalStream = async () => {
    try {
      const constraints = {
        audio: true,
        video: true
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast.error("Could not access camera or microphone");
      throw error;
    }
  };
  
  // Handle connection
  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Start local stream
      await startLocalStream();
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set up remote stream (simulated)
      const remoteStream = simulateRemoteStream();
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      
      setIsConnected(true);
      toast.success("Call connected successfully!");
    } catch (error) {
      toast.error("Failed to connect call");
      console.error("Connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Handle disconnection
  const handleDisconnect = () => {
    // Stop all tracks in the local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    
    setIsConnected(false);
    setIsMicMuted(false);
    setIsVideoOff(false);
    toast.info("Call ended");
  };
  
  // Toggle microphone
  const handleToggleMic = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMicMuted;
      });
      setIsMicMuted(!isMicMuted);
      
      toast.info(isMicMuted ? "Microphone unmuted" : "Microphone muted");
    }
  };
  
  // Toggle video
  const handleToggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
      
      toast.info(isVideoOff ? "Camera turned on" : "Camera turned off");
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Video Conference</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Local video */}
        <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${isVideoOff && isConnected ? 'hidden' : ''}`}
          />
          {(isVideoOff && isConnected) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
              <span className="text-white text-xl">Camera Off</span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            You
          </div>
        </div>
        
        {/* Remote video */}
        <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
          {isConnected ? (
            <>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                Remote User
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-xl">Not Connected</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Call controls */}
      <div className="mt-4 flex justify-center">
        <CallControls
          isConnected={isConnected}
          isConnecting={isConnecting}
          isMicMuted={isMicMuted}
          isVideoOff={isVideoOff}
          onToggleMic={handleToggleMic}
          onToggleVideo={handleToggleVideo}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
      </div>
    </div>
  );
};

export default VideoConference;