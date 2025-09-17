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

// Add Web Speech API types for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
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
    // Apply animation-based scaling
    const animationScale = animation === 'alert' ? 1.05 : 1.0;
    
    // Breathing animation
    if (avatarRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.02 + 1;
      avatarRef.current.scale.y = breathe * animationScale;
      
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
  const headRef = useRef<THREE.Group>(null);
  const eyesRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Group>(null);
  const eyebrowsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (avatarRef.current) {
      const time = state.clock.elapsedTime;
      
      // Breathing animation
      const breathe = Math.sin(time * 2) * 0.02 + 1;
      avatarRef.current.scale.y = breathe;
      
      // Natural head movement
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(time * 0.6) * 0.05;
        headRef.current.rotation.x = Math.sin(time * 0.8) * 0.02;
      }
      
      // Eye movements and blinking
      if (eyesRef.current) {
        // Natural eye movement
        const eyeMovement = Math.sin(time * 0.4) * 0.03;
        eyesRef.current.children.forEach((child: any) => {
          if (child.userData?.type === 'iris' || child.userData?.type === 'pupil') {
            child.position.x += eyeMovement * (child.userData.side === 'left' ? -1 : 1);
          }
        });
        
        // Random blinking
        if (Math.random() > 0.998) {
          eyesRef.current.children.forEach((child: any) => {
            if (child.userData?.type === 'eyelid') {
              child.visible = true;
              setTimeout(() => {
                child.visible = false;
              }, 150);
            }
          });
        }
      }
      
      // Enhanced lip sync animation
      if (lipSyncActive && mouthRef.current) {
        const lipIntensity = Math.sin(time * 12) * 0.4 + 0.6;
        const mouthOpen = Math.sin(time * 8) * 0.3 + 0.4;
        
        // Animate mouth opening and closing
        mouthRef.current.scale.x = 1 + mouthOpen * 0.5;
        mouthRef.current.scale.y = 1 + lipIntensity * 0.3;
        
        // Show teeth when mouth opens wide
        const teeth = avatarRef.current.getObjectByName('teeth');
        if (teeth && mouthOpen > 0.5) {
          teeth.visible = true;
        } else if (teeth) {
          teeth.visible = false;
        }
      } else if (mouthRef.current) {
        // Return to neutral mouth position
        mouthRef.current.scale.set(1, 1, 1);
      }
      
      // Facial expressions based on animation type
      if (eyebrowsRef.current) {
        eyebrowsRef.current.children.forEach((eyebrow: any) => {
          switch (animation) {
            case 'alert':
              eyebrow.position.y = 0.4; // Raised eyebrows
              eyebrow.rotation.z = eyebrow.userData.side === 'left' ? 0.2 : -0.2;
              break;
            case 'instruction':
              eyebrow.position.y = 0.35;
              eyebrow.rotation.z = eyebrow.userData.side === 'left' ? 0.05 : -0.05;
              break;
            case 'announcement':
              eyebrow.position.y = 0.38;
              break;
            default:
              eyebrow.position.y = 0.35;
              eyebrow.rotation.z = eyebrow.userData.side === 'left' ? 0.1 : -0.1;
          }
        });
      }
      
      // Animation effects
      switch (animation) {
        case 'alert':
          avatarRef.current.rotation.z = Math.sin(time * 4) * 0.1;
          // Alert expression: wider eyes
          if (eyesRef.current) {
            eyesRef.current.scale.set(1.2, 1.2, 1.2);
          }
          break;
        case 'instruction':
          avatarRef.current.rotation.y = Math.sin(time * 2) * 0.2;
          break;
        case 'announcement':
          avatarRef.current.position.y = Math.sin(time * 3) * 0.3;
          // Friendly expression
          if (mouthRef.current && !lipSyncActive) {
            mouthRef.current.scale.x = 1.2; // Slight smile
          }
          break;
        default:
          if (eyesRef.current) {
            eyesRef.current.scale.set(1, 1, 1);
          }
      }
    }
  });
  
  return (
    <group ref={avatarRef}>
      {/* Realistic Human Head Structure */}
      <group ref={headRef} position={[0, 2, 0]}>
        {/* Base head shape - human proportions */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.42, 64, 64]} />
          <meshStandardMaterial 
            color="#FDBCB4" 
            roughness={0.85}
            metalness={0.02}
            bumpScale={0.1}
          />
        </mesh>
        
        {/* Forehead with realistic curvature */}
        <mesh position={[0, 0.2, 0.25]} castShadow receiveShadow>
          <sphereGeometry args={[0.32, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial 
            color="#FDBCB4" 
            roughness={0.8}
            metalness={0.02}
          />
        </mesh>
        
        {/* Cheek definition - left */}
        <mesh position={[-0.2, 0.02, 0.28]} castShadow receiveShadow>
          <sphereGeometry args={[0.15, 24, 24]} />
          <meshStandardMaterial 
            color="#F5C6A0" 
            roughness={0.75}
            metalness={0.02}
          />
        </mesh>
        
        {/* Cheek definition - right */}
        <mesh position={[0.2, 0.02, 0.28]} castShadow receiveShadow>
          <sphereGeometry args={[0.15, 24, 24]} />
          <meshStandardMaterial 
            color="#F5C6A0" 
            roughness={0.75}
            metalness={0.02}
          />
        </mesh>
        
        {/* Jawline structure */}
        <mesh position={[0, -0.25, 0.18]} castShadow receiveShadow>
          <boxGeometry args={[0.35, 0.2, 0.25]} />
          <meshStandardMaterial 
            color="#FDBCB4" 
            roughness={0.8}
            metalness={0.02}
          />
        </mesh>
        
        {/* Chin definition */}
        <mesh position={[0, -0.32, 0.22]} castShadow receiveShadow>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial 
            color="#F5C6A0" 
            roughness={0.8}
            metalness={0.02}
          />
        </mesh>
        
        {/* Realistic Human Eyes with proper anatomy */}
        <group ref={eyesRef}>
          {/* Eye socket depressions */}
          <mesh position={[-0.16, 0.08, 0.32]} castShadow receiveShadow>
            <sphereGeometry args={[0.08, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
            <meshStandardMaterial 
              color="#E8C5A0" 
              roughness={0.9}
              metalness={0.0}
            />
          </mesh>
          <mesh position={[0.16, 0.08, 0.32]} castShadow receiveShadow>
            <sphereGeometry args={[0.08, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
            <meshStandardMaterial 
              color="#E8C5A0" 
              roughness={0.9}
              metalness={0.0}
            />
          </mesh>
          
          {/* Almond-shaped eye whites */}
          <mesh position={[-0.16, 0.08, 0.37]} userData={{ type: 'eyeball', side: 'left' }} castShadow>
            <sphereGeometry args={[0.045, 24, 24, 0, Math.PI * 2, Math.PI * 0.3, Math.PI * 0.4]} />
            <meshStandardMaterial 
              color="#FFFFFF" 
              roughness={0.05}
              metalness={0.0}
            />
          </mesh>
          <mesh position={[0.16, 0.08, 0.37]} userData={{ type: 'eyeball', side: 'right' }} castShadow>
            <sphereGeometry args={[0.045, 24, 24, 0, Math.PI * 2, Math.PI * 0.3, Math.PI * 0.4]} />
            <meshStandardMaterial 
              color="#FFFFFF" 
              roughness={0.05}
              metalness={0.0}
            />
          </mesh>
          
          {/* Realistic iris with detail */}
          <mesh position={[-0.16, 0.08, 0.385]} userData={{ type: 'iris', side: 'left' }}>
            <sphereGeometry args={[0.018, 24, 24]} />
            <meshStandardMaterial 
              color="#2E7D32" 
              roughness={0.2}
              metalness={0.3}
            />
          </mesh>
          <mesh position={[0.16, 0.08, 0.385]} userData={{ type: 'iris', side: 'right' }}>
            <sphereGeometry args={[0.018, 24, 24]} />
            <meshStandardMaterial 
              color="#2E7D32" 
              roughness={0.2}
              metalness={0.3}
            />
          </mesh>
          
          {/* Sharp pupils */}
          <mesh position={[-0.16, 0.08, 0.39]} userData={{ type: 'pupil', side: 'left' }}>
            <sphereGeometry args={[0.008, 16, 16]} />
            <meshStandardMaterial 
              color="#000000" 
              roughness={0.0}
              metalness={0.9}
            />
          </mesh>
          <mesh position={[0.16, 0.08, 0.39]} userData={{ type: 'pupil', side: 'right' }}>
            <sphereGeometry args={[0.008, 16, 16]} />
            <meshStandardMaterial 
              color="#000000" 
              roughness={0.0}
              metalness={0.9}
            />
          </mesh>
          
          {/* Natural eyelids */}
          <mesh 
            position={[-0.16, 0.12, 0.37]} 
            userData={{ type: 'eyelid', side: 'left' }}
            visible={false}
            castShadow
          >
            <sphereGeometry args={[0.048, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial 
              color="#FDBCB4" 
              roughness={0.85}
              metalness={0.02}
            />
          </mesh>
          <mesh 
            position={[0.16, 0.12, 0.37]} 
            userData={{ type: 'eyelid', side: 'right' }}
            visible={false}
            castShadow
          >
            <sphereGeometry args={[0.048, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial 
              color="#FDBCB4" 
              roughness={0.85}
              metalness={0.02}
            />
          </mesh>
        </group>
        
        {/* Natural Human Eyebrows */}
        <group ref={eyebrowsRef}>
          <mesh 
            position={[-0.16, 0.22, 0.35]} 
            rotation={[0, 0, 0.1]}
            userData={{ type: 'eyebrow', side: 'left' }}
            castShadow
          >
            <boxGeometry args={[0.12, 0.025, 0.015]} />
            <meshStandardMaterial 
              color="#654321" 
              roughness={0.95}
              metalness={0.0}
            />
          </mesh>
          <mesh 
            position={[0.16, 0.22, 0.35]} 
            rotation={[0, 0, -0.1]}
            userData={{ type: 'eyebrow', side: 'right' }}
            castShadow
          >
            <boxGeometry args={[0.12, 0.025, 0.015]} />
            <meshStandardMaterial 
              color="#654321" 
              roughness={0.95}
              metalness={0.0}
            />
          </mesh>
        </group>
        
        {/* Detailed Human Nose */}
        <group>
          {/* Nose bridge with realistic shape */}
          <mesh position={[0, 0.0, 0.32]} castShadow receiveShadow>
            <boxGeometry args={[0.025, 0.15, 0.08]} />
            <meshStandardMaterial 
              color="#F5C6A0" 
              roughness={0.8}
              metalness={0.02}
            />
          </mesh>
          
          {/* Nose tip with natural curve */}
          <mesh position={[0, -0.1, 0.37]} castShadow receiveShadow>
            <sphereGeometry args={[0.03, 20, 20]} />
            <meshStandardMaterial 
              color="#F5C6A0" 
              roughness={0.75}
              metalness={0.02}
            />
          </mesh>
          
          {/* Nose wings */}
          <mesh position={[-0.02, -0.08, 0.35]} castShadow receiveShadow>
            <sphereGeometry args={[0.018, 12, 12]} />
            <meshStandardMaterial 
              color="#F5C6A0" 
              roughness={0.8}
              metalness={0.02}
            />
          </mesh>
          <mesh position={[0.02, -0.08, 0.35]} castShadow receiveShadow>
            <sphereGeometry args={[0.018, 12, 12]} />
            <meshStandardMaterial 
              color="#F5C6A0" 
              roughness={0.8}
              metalness={0.02}
            />
          </mesh>
          
          {/* Natural nostrils */}
          <mesh position={[-0.012, -0.12, 0.35]}>
            <sphereGeometry args={[0.006, 8, 8]} />
            <meshStandardMaterial 
              color="#D4A574" 
              roughness={1.0}
              metalness={0.0}
            />
          </mesh>
          <mesh position={[0.012, -0.12, 0.35]}>
            <sphereGeometry args={[0.006, 8, 8]} />
            <meshStandardMaterial 
              color="#D4A574" 
              roughness={1.0}
              metalness={0.0}
            />
          </mesh>
        </group>
        
        {/* Realistic Human Mouth and Lips */}
        <group position={[0, -0.18, 0.32]}>
          <group ref={mouthRef}>
            {/* Upper lip with natural curve */}
            <mesh position={[0, 0.01, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.035, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial 
                color="#E8A598" 
                roughness={0.3}
                metalness={0.05}
              />
            </mesh>
            
            {/* Lower lip - fuller */}
            <mesh position={[0, -0.015, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.04, 20, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
              <meshStandardMaterial 
                color="#E8A598" 
                roughness={0.3}
                metalness={0.05}
              />
            </mesh>
            
            {/* Mouth corners */}
            <mesh position={[-0.03, -0.005, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.008, 12, 12]} />
              <meshStandardMaterial 
                color="#E8A598" 
                roughness={0.4}
                metalness={0.05}
              />
            </mesh>
            <mesh position={[0.03, -0.005, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.008, 12, 12]} />
              <meshStandardMaterial 
                color="#E8A598" 
                roughness={0.4}
                metalness={0.05}
              />
            </mesh>
            
            {/* Mouth opening - more natural */}
            <mesh position={[0, -0.002, 0.002]} userData={{ type: 'mouth' }}>
              <planeGeometry args={[0.05, 0.008]} />
              <meshStandardMaterial 
                color="#3A1A1A" 
                roughness={0.9}
                metalness={0.0}
              />
            </mesh>
            
            {/* Natural teeth */}
            <mesh 
              position={[0, 0.003, -0.003]} 
              visible={false}
              userData={{ type: 'teeth' }}
              name="teeth"
              castShadow
            >
              <boxGeometry args={[0.04, 0.008, 0.006]} />
              <meshStandardMaterial 
                color="#FEFEFE" 
                roughness={0.05}
                metalness={0.1}
              />
            </mesh>
          </group>
        </group>
        
        {/* Additional facial realism - subtle skin texture */}
        <mesh position={[-0.08, 0.02, 0.34]} castShadow receiveShadow>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial 
            color="#F5C6A0" 
            roughness={0.85}
            metalness={0.02}
            transparent
            opacity={0.6}
          />
        </mesh>
        <mesh position={[0.06, -0.05, 0.33]} castShadow receiveShadow>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial 
            color="#F5C6A0" 
            roughness={0.85}
            metalness={0.02}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>
      
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
      
      {/* Enhanced lighting for realistic human skin */}
      <ambientLight intensity={0.4} color="#fff8f0" />
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={1.2} 
        castShadow 
        shadow-mapSize={2048}
        color="#ffffff"
      />
      <pointLight 
        position={[-3, 3, 4]} 
        intensity={0.5} 
        color="#f0e6d2"
      />
      <spotLight 
        position={[0, 10, 0]} 
        intensity={0.4} 
        angle={0.15} 
        penumbra={1} 
        color="#ffffff" 
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
  const recognitionRef = useRef<any>(null);
  
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