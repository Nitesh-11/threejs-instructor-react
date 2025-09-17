import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';

// Types for our avatar system
interface VoiceCommand {
  text: string;
  animation: string;
}

interface AvatarState {
  isListening: boolean;
  currentAnimation: string;
  lipSyncActive: boolean;
  recognizedText: string;
}

// Ready Player Me Avatar Component
const ReadyPlayerMeAvatar: React.FC<{ avatarUrl: string; animation: string; lipSyncActive: boolean }> = ({ 
  avatarUrl, 
  animation, 
  lipSyncActive 
}) => {
  const avatarRef = useRef<THREE.Group>(null);
  
  // Load GLTF model from Ready Player Me
  const { scene } = useGLTF(avatarUrl);
  
  // Animation frame updates
  useFrame((state) => {
    // Breathing animation
    if (avatarRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.02 + 1;
      avatarRef.current.scale.y = breathe;
      
      // Lip sync animation
      if (lipSyncActive) {
        const intensity = Math.sin(state.clock.elapsedTime * 8) * 0.3;
        avatarRef.current.rotation.x = intensity * 0.1;
      }
    }
  });
  
  return (
    <group ref={avatarRef} position={[0, -1, 0]} scale={[1.2, 1.2, 1.2]}>
      <primitive object={scene} />
    </group>
  );
};

// Fallback Avatar Component
const FallbackAvatar: React.FC<{ animation: string; lipSyncActive: boolean }> = ({ animation, lipSyncActive }) => {
  const avatarRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (avatarRef.current) {
      // Breathing animation
      const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.02 + 1;
      avatarRef.current.scale.y = breathe;
      
      // Lip sync animation
      if (lipSyncActive) {
        const intensity = Math.sin(state.clock.elapsedTime * 8) * 0.3;
        avatarRef.current.rotation.x = intensity * 0.1;
      }
      
      // Animation effects
      switch (animation) {
        case 'alert':
          avatarRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 4) * 0.1;
          break;
        case 'instruction':
          avatarRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
          break;
        case 'announcement':
          avatarRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.3;
          break;
      }
    }
  });
  
  return (
    <group ref={avatarRef}>
      {/* Professional Human Head */}
      <mesh position={[0, 2, 0]} castShadow>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#fdbcb4" roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.25, 2.15, 0.6]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[0.25, 2.15, 0.6]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 1.95, 0.65]} castShadow>
        <coneGeometry args={[0.08, 0.2, 8]} />
        <meshStandardMaterial color="#e8b4a3" />
      </mesh>
      
      {/* Mouth */}
      <mesh position={[0, 1.75, 0.6]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.05, 16]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 2.6, -0.1]} castShadow>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.8} />
      </mesh>
      
      {/* Professional Uniform Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.8, 2, 16]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-1, 0.8, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 1.5, 12]} />
        <meshStandardMaterial color="#fdbcb4" roughness={0.6} />
      </mesh>
      <mesh position={[1, 0.8, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 1.5, 12]} />
        <meshStandardMaterial color="#fdbcb4" roughness={0.6} />
      </mesh>
      
      {/* Professional Pilot Cap */}
      <mesh position={[0, 2.8, 0]} castShadow>
        <cylinderGeometry args={[0.9, 0.92, 0.25, 16]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.8} />
      </mesh>

      {/* Cap Badge */}
      <mesh position={[0, 2.95, 0.8]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.03, 8]} />
        <meshStandardMaterial color="#f39c12" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Professional Tie */}
      <mesh position={[0, 0.8, 0.75]} castShadow>
        <boxGeometry args={[0.15, 1.2, 0.05]} />
        <meshStandardMaterial color="#8b0000" roughness={0.6} />
      </mesh>

      {/* Wing Badges */}
      <mesh position={[-0.4, 1.2, 0.75]} castShadow>
        <boxGeometry args={[0.3, 0.08, 0.02]} />
        <meshStandardMaterial color="#f39c12" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.4, 1.2, 0.75]} castShadow>
        <boxGeometry args={[0.3, 0.08, 0.02]} />
        <meshStandardMaterial color="#f39c12" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Loading Component
const LoadingAvatar = () => {
  return (
    <group>
      <Text
        position={[0, 0, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Loading Professional Crew Avatar...
      </Text>
      <mesh>
        <boxGeometry args={[1, 2, 0.5]} />
        <meshStandardMaterial color="#cccccc" opacity={0.5} transparent />
      </mesh>
    </group>
  );
};

// Main Scene Component
const AvatarScene: React.FC<{ avatarState: AvatarState }> = ({ avatarState }) => {
  const [useReadyPlayerMe] = useState(false); // Start with fallback for now
  const avatarUrl = 'https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb';
  
  return (
    <>
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        minDistance={3}
        maxDistance={10}
        target={[0, 0, 0]}
      />
      
      <Environment preset="studio" />
      
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize={2048}
      />
      <spotLight 
        position={[0, 10, 0]} 
        intensity={0.3} 
        angle={0.15} 
        penumbra={1} 
        castShadow 
      />
      
      {useReadyPlayerMe ? (
        <Suspense fallback={<LoadingAvatar />}>
          <ReadyPlayerMeAvatar 
            avatarUrl={avatarUrl}
            animation={avatarState.currentAnimation}
            lipSyncActive={avatarState.lipSyncActive}
          />
        </Suspense>
      ) : (
        <FallbackAvatar 
          animation={avatarState.currentAnimation} 
          lipSyncActive={avatarState.lipSyncActive} 
        />
      )}
      
      <ContactShadows 
        rotation-x={Math.PI / 2} 
        position={[0, -2, 0]} 
        opacity={0.25} 
        width={10} 
        height={10} 
        blur={1.5} 
        far={2} 
      />
      
      {/* Professional Environment */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.8} />
      </mesh>
    </>
  );
};

// Professional Avatar Component
const AircraftCrewAvatar: React.FC = () => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const [avatarState, setAvatarState] = useState<AvatarState>({
    isListening: false,
    currentAnimation: 'idle',
    lipSyncActive: false,
    recognizedText: ''
  });

  const [currentStatus, setCurrentStatus] = useState('Ready for voice commands');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Voice commands for aircraft crew
  const voiceCommands: VoiceCommand[] = [
    { text: 'turbulence', animation: 'alert' },
    { text: 'seatbelt', animation: 'instruction' },
    { text: 'landing', animation: 'announcement' },
    { text: 'takeoff', animation: 'preparation' },
    { text: 'emergency', animation: 'urgent' },
    { text: 'welcome', animation: 'greeting' },
    { text: 'safety', animation: 'demonstration' }
  ];

  // Advanced lip sync animation system
  const performLipSync = (text: string) => {
    setAvatarState(prev => ({ ...prev, lipSyncActive: true }));
    
    const duration = text.length * 150; // Dynamic duration
    
    setTimeout(() => {
      setAvatarState(prev => ({ ...prev, lipSyncActive: false }));
    }, duration);
  };

  // Animation system for different crew actions
  const performAnimation = (animationType: string) => {
    setAvatarState(prev => ({ ...prev, currentAnimation: animationType }));
    
    // Return to idle after animation
    setTimeout(() => {
      setAvatarState(prev => ({ ...prev, currentAnimation: 'idle' }));
    }, 2500);
  };

  // Voice recognition setup
  const setupVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setAvatarState(prev => ({ ...prev, isListening: true }));
        setCurrentStatus('🎤 Listening for command...');
      };
      
      recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript.toLowerCase();
        
        setAvatarState(prev => ({ ...prev, recognizedText: text }));
        
        // Check for voice commands
        const matchedCommand = voiceCommands.find(cmd => 
          text.includes(cmd.text)
        );
        
        if (matchedCommand) {
          setCurrentStatus(`🎯 Executing: ${matchedCommand.text.toUpperCase()}`);
          performLipSync(matchedCommand.text);
          performAnimation(matchedCommand.animation);
          speak(getInstructionForCommand(matchedCommand.text));
        }
      };
      
      recognition.onerror = (event: any) => {
        console.log('Speech recognition error:', event.error);
        setAvatarState(prev => ({ ...prev, isListening: false }));
        setCurrentStatus('🎤 Voice recognition error. Please try again.');
      };
      
      recognition.onend = () => {
        setAvatarState(prev => ({ ...prev, isListening: false }));
        if (!isSpeaking) {
          setCurrentStatus('Ready for voice commands');
        }
      };
      
      recognitionRef.current = recognition;
    }
  };

  const getInstructionForCommand = (command: string): string => {
    const instructions: { [key: string]: string } = {
      'turbulence': 'Ladies and gentlemen, we are experiencing some turbulence. Please return to your seats and fasten your seatbelts immediately.',
      'seatbelt': 'The seatbelt sign has been turned on. Please fasten your seatbelts and return your seats to the upright position.',
      'landing': 'We are beginning our descent for landing. Please ensure your seat backs and tray tables are in their upright position.',
      'takeoff': 'Ladies and gentlemen, we are preparing for takeoff. Please ensure your seats are in the upright position.',
      'emergency': 'This is an emergency announcement. Please remain calm and follow the instructions of the cabin crew immediately.',
      'welcome': 'Welcome aboard this flight. We hope you have a pleasant journey with us today.',
      'safety': 'Please review the safety information card in your seat pocket and listen carefully to our safety demonstration.'
    };
    return instructions[command] || 'Command acknowledged.';
  };

  const speak = (text: string) => {
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Enhanced voice selection for professional crew
    const voices = speechSynthesis.getVoices();
    const professionalVoice = voices.find(voice => 
      voice.name.includes('David') || 
      voice.name.includes('Mark') ||
      (voice.lang.startsWith('en') && voice.name.toLowerCase().includes('male'))
    );
    
    if (professionalVoice) {
      utterance.voice = professionalVoice;
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentStatus('✅ Announcement completed');
    };
    
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    setupVoiceRecognition();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !avatarState.isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && avatarState.isListening) {
      recognitionRef.current.stop();
    }
  };

  const testCommand = (commandText: string) => {
    const command = voiceCommands.find(cmd => cmd.text === commandText);
    if (command) {
      setCurrentStatus(`🎯 Testing: ${command.text.toUpperCase()}`);
      performLipSync(command.text);
      performAnimation(command.animation);
      speak(getInstructionForCommand(command.text));
    }
  };

  return (
    <div className="avatar-container">
      <div className="three-container-canvas">
        <Canvas 
          camera={{ position: [0, 2, 6], fov: 50 }}
          shadows
          gl={{ antialias: true }}
        >
          <AvatarScene avatarState={avatarState} />
        </Canvas>
      </div>
      
      <div className="controls-panel">
        <h2>🛩️ Professional Aircraft Crew Avatar</h2>
        
        <div className="status-display-inline">
          <div className={`status-indicator ${avatarState.isListening ? 'listening' : ''}`}>
            {avatarState.isListening ? '🎤 Listening...' : '🔇 Not Listening'}
          </div>
          <div className="current-animation">
            Animation: {avatarState.currentAnimation}
          </div>
          {avatarState.lipSyncActive && (
            <div className="lip-sync-indicator">
              💬 Lip Sync Active
            </div>
          )}
          {avatarState.recognizedText && (
            <div className="recognized-text">
              Recognized: "{avatarState.recognizedText}"
            </div>
          )}
          <div className="current-status">
            Status: {currentStatus}
          </div>
        </div>
        
        <div className="voice-controls">
          <button 
            onClick={startListening} 
            disabled={avatarState.isListening || isSpeaking}
            className="voice-button"
          >
            🎤 Start Voice Recognition
          </button>
          <button 
            onClick={stopListening} 
            disabled={!avatarState.isListening}
            className="stop-button"
          >
            ⏹️ Stop Voice Recognition
          </button>
        </div>
        
        <div className="test-commands">
          <strong>Test Commands:</strong>
          {voiceCommands.map((cmd, index) => (
            <button
              key={index}
              className="command-button small"
              onClick={() => testCommand(cmd.text)}
              disabled={isSpeaking || avatarState.isListening}
            >
              {cmd.text.toUpperCase()}
            </button>
          ))}
        </div>
        
        <div className="avatar-info">
          <strong>Avatar System:</strong> Professional React Three Fiber Human Avatar
          <br />
          <strong>Framework:</strong> Modern 3D with Realistic Animations & Lip Sync
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return <AircraftCrewAvatar />;
};

export default App;