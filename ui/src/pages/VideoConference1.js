import React, { useEffect, useState } from 'react';
import {
  StreamVideo,
  StreamCall,
  StreamVideoClient,
  CallControls,
  SpeakerLayout,
  User,
  useCallStateHooks
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';

// Your Stream API key from dashboard
const apiKey = 'mmhfdzb5evj2';

function VideoConference1() {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [userId, setUserId] = useState('');
  const [callId, setCallId] = useState('kOxi7WQ6NK0w');
  const [userName, setUserName] = useState('');
  const [isJoiningCall, setIsJoiningCall] = useState(false);

  // Initialize client with user credentials
  const initializeClient = async () => {
    try {
      // In a real app, tokens should be generated on your backend
      // This is just for demonstration purposes
      const userData = {
        id: "Plo_Koon",
        name: userName || userId
      };

      // Initialize Stream Video client
      const client = new StreamVideoClient({
        apiKey,
        user: userData,
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL1Bsb19Lb29uIiwidXNlcl9pZCI6IlBsb19Lb29uIiwidmFsaWRpdHlfaW5fc2Vjb25kcyI6NjA0ODAwLCJpYXQiOjE3NDc0MDAzNDAsImV4cCI6MTc0ODAwNTE0MH0.TovHnNly23SdT5386MTvT0VQMwlE1nJoDs9_9Cvvvhk', // Replace with actual token from your backend
      });

      setClient(client);
      return client;
    } catch (error) {
      console.error('Error initializing client:', error);
    }
  };

  // Join or create a call
  const joinCall = async (e) => {
    e.preventDefault();
    setIsJoiningCall(true);

    try {
      const videoClient = client || await initializeClient();
      
      // Get or create the call
      const callType = 'default'; // Use your preferred call type
      const call = videoClient.call(callType, callId);
      
      // Join the call
      await call.join({ create: true });
      
      setCall(call);
    } catch (error) {
      console.error('Error joining call:', error);
    } finally {
      setIsJoiningCall(false);
    }
  };

  // Leave call and cleanup
  const leaveCall = async () => {
    try {
      await call?.leave();
      setCall(null);
    } catch (error) {
      console.error('Error leaving call:', error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      leaveCall();
      client?.disconnectUser();
    };
  }, [client]);

  return (
    <>
      
      {!call ? (
        <div className="join-form">
          <form onSubmit={joinCall}>
            <div className="form-group">
              <label>Your Name:</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>            
            <button type="submit" disabled={isJoiningCall}>
              {isJoiningCall ? 'Calling...' : 'Make a Call'}
            </button>
          </form>
        </div>
      ) : (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <div className="call-container">
              <SpeakerLayout />
              <CallControls onLeave={leaveCall} />
            </div>
          </StreamCall>
        </StreamVideo>
      )}
    </>
  );
}

// Add some basic styling
const styles = `
.join-form {
  width: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #006CFF;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0055CC;
}

.call-container {
  display: flex;
  flex-direction: column;
  height: 80vh;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}
`;

// Create a style tag to apply the styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default VideoConference1;