import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import * as THREE from 'three';

interface VoiceCommand {
  command: string;
  instruction: string;
  gesture?: string;
}

const voiceCommands: VoiceCommand[] = [
  {
    command: 'turbulence',
    instruction: 'Ladies and gentlemen, we are experiencing some turbulence. Please return to your seats and fasten your seatbelts immediately for your safety.',
    gesture: 'wave'
  },
  {
    command: 'seatbelt',
    instruction: 'The seatbelt sign has been turned on. Please fasten your seatbelts and return your seats to the upright position.',
    gesture: 'point'
  },
  {
    command: 'landing',
    instruction: 'We are beginning our descent for landing. Please ensure your seat backs and tray tables are in their upright position.',
    gesture: 'explain'
  },
  {
    command: 'safety',
    instruction: 'Please review the safety information card in your seat pocket and listen carefully to our safety demonstration.',
    gesture: 'present'
  },
  {
    command: 'welcome',
    instruction: 'Welcome aboard this flight. We hope you have a pleasant journey with us today.',
    gesture: 'greet'
  },
  {
    command: 'emergency',
    instruction: 'This is an emergency announcement. Please remain calm and follow the instructions of the cabin crew immediately.',
    gesture: 'alert'
  }
];

const App: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  const [isListening, setIsListening] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('Loading professional avatar system...');
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  const [isAvatarReady, setIsAvatarReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Initialize Professional Avatar System
  useEffect(() => {
    const initializeTalkingHead = async () => {
      console.log('Initializing TalkingHead system...');

      if (!mountRef.current) {
        setTimeout(initializeTalkingHead, 100);
        return;
      }

      try {
        // Load TalkingHead from CDN via import maps
        const { TalkingHead } = await import('talkinghead');
        console.log('TalkingHead module loaded successfully');

        setCurrentStatus('� Creating realistic avatar...');

        // Create professional avatar instance
        const head = new TalkingHead(mountRef.current, {
          cameraView: 'upper',
          lipsyncModules: ['en'],
          modelRoot: 'Armature',
          modelPixelRatio: window.devicePixelRatio,
          cameraRotateEnable: true,
          cameraPanEnable: false,
          cameraZoomEnable: true,
          lightAmbientIntensity: 2.0,
          lightDirectIntensity: 15.0,
          lightSpotIntensity: 10.0
        });

        // Load professional Ready Player Me avatar (crew member)
        setCurrentStatus('👨‍✈️ Loading crew member avatar...');
        
        await head.showAvatar({
          url: 'https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb?morphTargets=ARKit,Oculus+Visemes,mouthOpen,mouthSmile,eyesClosed,eyesLookUp,eyesLookDown&textureSizeLimit=1024&textureFormat=png',
          body: 'M', // Male crew member
          avatarMood: 'neutral',
          ttsLang: 'en-US',
          ttsVoice: 'en-US-Standard-J' // Professional male voice
        }, (progress: any) => {
          if (progress.lengthComputable) {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setLoadingProgress(percent);
            setCurrentStatus(`Loading avatar: ${percent}%`);
          } else {
            const kb = Math.round(progress.loaded / 1024);
            setCurrentStatus(`Loading avatar: ${kb} KB`);
          }
        });

        avatarRef.current = head;
        setIsAvatarReady(true);
        setCurrentStatus('✅ Professional crew avatar ready!');
        
        // Set up professional poses and gestures
        await setupCrewGestures(head);
        
        console.log('TalkingHead avatar initialized successfully');

      } catch (error) {
        console.error('Error initializing TalkingHead:', error);
        setCurrentStatus('⚠️ Loading fallback avatar...');
        
        // Fallback to simple avatar
        createFallbackAvatar();
      }
    };

    initializeTalkingHead();
  }, []);

  const setupCrewGestures = async (head: any) => {
    try {
      // Set professional crew member posture
      head.setView('upper');
      
      // Add subtle professional animations
      head.playPose('https://cdn.jsdelivr.net/gh/met4citizen/TalkingHead@1.5/poses/professional.fbx', null, 3);
    } catch (error) {
      console.log('Gesture setup completed with basic posture');
    }
  };

  const createFallbackAvatar = () => {
    if (!mountRef.current) return;
    
    setCurrentStatus('🎨 Creating backup crew avatar...');
    
    // Enhanced fallback avatar with better styling
    const canvas = document.createElement('canvas');
    canvas.width = mountRef.current.clientWidth;
    canvas.height = mountRef.current.clientHeight;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear and create professional background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1e3c72');
    gradient.addColorStop(1, '#2a5298');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(canvas);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Professional crew member avatar
    // Head with better shading
    const headGradient = ctx.createRadialGradient(centerX, centerY - 50, 20, centerX, centerY - 50, 60);
    headGradient.addColorStop(0, '#fdbcb4');
    headGradient.addColorStop(1, '#e6a896');
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY - 50, 60, 0, 2 * Math.PI);
    ctx.fill();
    
    // Eyes with expression
    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    ctx.arc(centerX - 20, centerY - 65, 8, 0, 2 * Math.PI);
    ctx.arc(centerX + 20, centerY - 65, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = '#34495e';
    ctx.beginPath();
    ctx.arc(centerX - 20, centerY - 65, 4, 0, 2 * Math.PI);
    ctx.arc(centerX + 20, centerY - 65, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Professional smile
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(centerX, centerY - 30, 20, 0, Math.PI);
    ctx.stroke();
    
    // Pilot cap
    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    ctx.arc(centerX, centerY - 80, 65, Math.PI, 2 * Math.PI);
    ctx.fill();
    
    // Cap badge
    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.arc(centerX, centerY - 80, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Professional uniform
    const uniformGradient = ctx.createLinearGradient(centerX - 60, centerY + 10, centerX + 60, centerY + 130);
    uniformGradient.addColorStop(0, '#2c3e50');
    uniformGradient.addColorStop(1, '#34495e');
    ctx.fillStyle = uniformGradient;
    ctx.fillRect(centerX - 60, centerY + 10, 120, 120);
    
    // Collar and tie
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(centerX - 55, centerY + 15, 110, 15);
    
    // Professional tie
    ctx.fillStyle = '#8b0000';
    ctx.fillRect(centerX - 8, centerY + 30, 16, 80);
    
    // Wing badges
    ctx.fillStyle = '#f39c12';
    ctx.fillRect(centerX - 40, centerY + 45, 25, 8);
    ctx.fillRect(centerX + 15, centerY + 45, 25, 8);
    
    setIsAvatarReady(true);
    setCurrentStatus('✅ Backup crew avatar ready!');
  };

  // Enhanced Voice Recognition with airline-specific commands
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 3;
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        console.log('Voice recognized:', transcript);
        
        // Enhanced fuzzy matching for voice commands
        const matchedCommand = voiceCommands.find(cmd => {
          const words = transcript.split(' ');
          return words.some((word: string) => 
            word.includes(cmd.command) || 
            cmd.command.includes(word) ||
            word.length > 3 && cmd.command.includes(word)
          );
        });
        
        if (matchedCommand) {
          executeCommand(matchedCommand);
        } else {
          setCurrentStatus(`❓ Command "${transcript}" not recognized. Try: ${voiceCommands.map(c => c.command).join(', ')}`);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setCurrentStatus('🎤 Voice recognition error. Please try again.');
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      setSpeechRecognition(recognition);
    } else {
      console.warn('Speech recognition not supported');
    }
  }, []);

  const executeCommand = async (command: VoiceCommand) => {
    if (!isAvatarReady) return;
    
    setCurrentStatus(`🎯 Executing: ${command.command.toUpperCase()}`);
    
    try {
      if (avatarRef.current && typeof avatarRef.current.speakText === 'function') {
        // Use TalkingHead professional lip sync
        setIsSpeaking(true);
        
        // Add appropriate gesture
        if (command.gesture) {
          await performGesture(command.gesture);
        }
        
        // Speak with professional voice and lip sync
        await avatarRef.current.speakText(command.instruction, {
          ttsLang: 'en-US',
          ttsVoice: 'en-US-Standard-J',
          lipsyncLang: 'en'
        });
        
        setIsSpeaking(false);
        setCurrentStatus(`✅ ${command.command.toUpperCase()} announcement completed`);
      } else {
        // Fallback to basic text-to-speech
        speak(command.instruction);
      }
    } catch (error) {
      console.error('Error executing command:', error);
      speak(command.instruction); // Fallback
    }
  };

  const performGesture = async (gesture: string) => {
    if (!avatarRef.current) return;
    
    try {
      switch (gesture) {
        case 'wave':
          await avatarRef.current.playGesture('wave', 2000);
          break;
        case 'point':
          await avatarRef.current.playGesture('point', 1500);
          break;
        case 'explain':
          await avatarRef.current.playGesture('explain', 3000);
          break;
        case 'present':
          await avatarRef.current.playGesture('present', 2500);
          break;
        case 'greet':
          await avatarRef.current.playGesture('greet', 2000);
          break;
        case 'alert':
          await avatarRef.current.setMood('alert');
          break;
      }
    } catch (error) {
      console.log('Gesture not available:', gesture);
    }
  };

  const speak = (text: string) => {
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentStatus('✅ Announcement completed');
    };
    
    speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (speechRecognition && !isListening) {
      setIsListening(true);
      setCurrentStatus('🎤 Listening for command...');
      speechRecognition.start();
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    if (avatarRef.current && typeof avatarRef.current.stopSpeaking === 'function') {
      avatarRef.current.stopSpeaking();
    }
    setIsSpeaking(false);
    setCurrentStatus('🔇 Speech stopped');
  };

  const testCommand = (commandText: string) => {
    const command = voiceCommands.find(cmd => cmd.command === commandText);
    if (command) {
      executeCommand(command);
    }
  };

  return (
    <div className="App">
      <div
        ref={mountRef}
        className="avatar-container"
        style={{
          width: '100vw',
          height: '100vh',
          position: 'relative',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
        }}
      />
      
      <div className="controls-panel">
        <h2>🛩️ Aircraft Crew 3D</h2>
        
        <div className="voice-controls">
          {!isListening ? (
            <button
              className="voice-button"
              onClick={startListening}
              disabled={!isAvatarReady}
            >
              🎤 Voice Command
            </button>
          ) : (
            <button className="voice-button listening">
              🔴 Listening...
            </button>
          )}
        </div>
        
        {isSpeaking && (
          <button
            className="stop-button"
            onClick={stopSpeaking}
          >
            ⏹️ Stop
          </button>
        )}
        
        <div className="test-commands">
          <strong>Test Commands:</strong>
          {voiceCommands.map((cmd) => (
            <button
              key={cmd.command}
              className="command-button small"
              onClick={() => testCommand(cmd.command)}
              disabled={isSpeaking || !isAvatarReady}
            >
              {cmd.command.toUpperCase()}
            </button>
          ))}
        </div>
        
        <div className="avatar-info">
          Avatar System: 🤖 TalkingHead.js Professional
          {loadingProgress > 0 && loadingProgress < 100 && (
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
      
      <div className="status-display">
        <div className="status-row">
          <strong>Status:</strong> {currentStatus}
        </div>
        <div className="status-row">
          <strong>Voice Commands:</strong> {voiceCommands.map(cmd => cmd.command).join(' • ')}
        </div>
        <div className="status-row">
          <strong>Instructions:</strong> Say any command clearly, or use the test buttons
        </div>
      </div>
    </div>
  );
};

export default App;
