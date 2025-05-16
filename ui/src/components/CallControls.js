import React from "react";
// Removing the Button import
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";

const CallControls = ({
  isConnected,
  isConnecting,
  isMicMuted,
  isVideoOff,
  onToggleMic,
  onToggleVideo,
  onConnect,
  onDisconnect,
}) => {
  const iconSize = "text-lg";
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {!isConnected ? (
        <button 
          onClick={onConnect}
          disabled={isConnecting}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? "Connecting..." : "Start Call"}
        </button>
      ) : (
        <>
          <button
            onClick={onToggleMic}
            className={`p-3 ${isMicMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-full flex items-center justify-center`}
          >
            <span className={iconSize}>
              {isMicMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </span>
          </button>
          
          <button 
            onClick={onToggleVideo}
            className={`p-3 ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-full flex items-center justify-center`}
          >
            <span className={iconSize}>
              {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
            </span>
          </button>
          
          <button 
            onClick={onDisconnect}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
            End Call
          </button>
        </>
      )}
    </div>
  );
};

export default CallControls;