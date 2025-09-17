# Audio Assets for Aircraft Crew 3D

This directory contains pre-recorded audio instructions for different aircraft crew announcements.

## Required Audio Files:

1. **turbulence.mp3** - Turbulence safety announcement
2. **seatbelt.mp3** - Seatbelt sign announcement  
3. **landing.mp3** - Landing preparation announcement
4. **safety.mp3** - Safety demonstration announcement
5. **welcome.mp3** - Welcome aboard announcement
6. **emergency.mp3** - Emergency announcement

## Audio Specifications:
- Format: MP3 or WAV
- Quality: 16-bit, 44.1kHz minimum
- Duration: 10-30 seconds per announcement
- Voice: Professional, clear, calm crew member voice

## Adding New Audio Files:
1. Place your audio files in this directory
2. Update the `voiceCommands` array in `App.tsx` 
3. Add the audioPath property to the corresponding command

Example:
```javascript
{
  command: 'turbulence',
  audioPath: '/assets/audio/turbulence.mp3',
  instruction: 'Ladies and gentlemen, we are experiencing some turbulence...',
  gesture: 'wave'
}
```

## Text-to-Speech Fallback:
If audio files are not available, the application will use text-to-speech with the instruction text as fallback.