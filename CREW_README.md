# 🛩️ Aircraft Crew 3D - Advanced Lip Sync Animation Platform

A sophisticated React-based 3D application featuring realistic aircraft crew avatars with advanced lip synchronization, voice recognition, and professional gesture animations.

## ✈️ Features

### 🎭 Realistic 3D Avatar
- **TalkingHead.js Integration**: Professional human-like crew member avatar
- **Professional Appearance**: Pilot/crew uniform with realistic facial features
- **Advanced Lighting**: Professional aviation-themed lighting setup
- **High-Quality Rendering**: Anti-aliasing, shadows, and reflections

### 🎤 Voice Recognition System
- **Advanced Speech Recognition**: Web Speech API with fuzzy matching
- **Smart Command Processing**: Levenshtein distance algorithm for better recognition
- **Synonym Support**: Recognizes variations and common aviation terms
- **6 Pre-defined Commands**: Turbulence, seatbelt, landing, safety, welcome, emergency

### 🗣️ Advanced Lip Sync Technology
- **Audio Analysis**: Real-time audio frequency analysis for realistic lip movement
- **TTS Fallback**: Professional text-to-speech with voice selection
- **Phoneme-based Sync**: Advanced lip synchronization with speech patterns
- **Audio File Support**: MP3/WAV audio files with fallback to TTS

### 🤲 Gesture Animation System
- **Professional Gestures**: Hand movements and body language for different announcements
- **Idle Animations**: Subtle breathing, blinking, and professional postures  
- **Context-aware Movements**: Different gestures for welcome, safety, emergency, etc.
- **Smooth Transitions**: Natural animation transitions between poses

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser with Web Speech API support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aircraft-crew-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🎮 Usage

### Voice Commands
Say any of these commands clearly:

| Command | Description | Example Phrase |
|---------|-------------|----------------|
| **turbulence** | Safety announcement for rough air | "turbulence", "rough", "bumpy" |
| **seatbelt** | Seatbelt sign announcement | "seatbelt", "belt", "buckle" |  
| **landing** | Landing preparation | "landing", "descent", "arrival" |
| **safety** | Safety demonstration | "safety", "demonstration" |
| **welcome** | Welcome aboard message | "welcome", "greeting" |
| **emergency** | Emergency announcement | "emergency", "urgent", "alert" |

### Controls
- **🎤 Voice Command**: Click to start listening for voice commands
- **Test Buttons**: Click any command button to test without voice input
- **⏹️ Stop**: Stop current announcement (appears during speech)

### Audio Files (Optional)
Place your custom audio files in `public/assets/audio/`:
- `turbulence.mp3` - Turbulence announcement
- `seatbelt.mp3` - Seatbelt announcement  
- `landing.mp3` - Landing announcement
- `safety.mp3` - Safety demonstration
- `welcome.mp3` - Welcome message
- `emergency.mp3` - Emergency announcement

## 🛠️ Key Technologies

- **React 19** with TypeScript
- **Three.js** for 3D rendering
- **TalkingHead.js** for realistic avatars
- **Web Speech API** for voice recognition
- **Web Audio API** for lip sync analysis
- **Vite** for fast development

## 🎨 Current Status

✅ **Completed Features:**
- TalkingHead.js integration for realistic human avatar
- Audio file support with TTS fallback
- Advanced voice recognition with fuzzy matching
- Professional crew avatar appearance and uniform
- Advanced lip sync with audio frequency analysis
- Gesture animation system with idle behaviors

## 🔧 Testing the Application

1. **Start the development server** (already running on http://localhost:5173/)

2. **Grant microphone permission** when prompted

3. **Test voice commands** by clicking "🎤 Voice Command" and saying:
   - "turbulence" 
   - "seatbelt"
   - "landing"
   - "safety" 
   - "welcome"
   - "emergency"

4. **Test without voice** using the test buttons in the control panel

5. **Observe the avatar** for:
   - Realistic human appearance
   - Professional crew uniform
   - Lip sync during speech
   - Hand gestures and body language
   - Idle animations (breathing, blinking, subtle movements)

The application now features a much more realistic and professional aircraft crew member compared to the previous geometric shapes, with advanced lip synchronization that responds to both audio files and text-to-speech.

---

**🎯 Mission Accomplished**: Successfully migrated from Angular to React with a significantly enhanced 3D aircraft crew avatar featuring professional appearance, advanced lip sync, and realistic gesture animations!