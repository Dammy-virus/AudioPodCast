import { useState, useRef, useCallback } from 'react';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  const animationFrame = useRef<number>();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      // Set up audio analysis
      audioContext.current = new AudioContext();
      const source = audioContext.current.createMediaStreamSource(stream);
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 256;
      source.connect(analyser.current);
      
      dataArray.current = new Uint8Array(analyser.current.frequencyBinCount);
      
      const updateAudioLevel = () => {
        if (analyser.current && dataArray.current) {
          analyser.current.getByteFrequencyData(dataArray.current);
          const average = dataArray.current.reduce((a, b) => a + b) / dataArray.current.length;
          setAudioLevel(average / 128); // Normalize to 0-1
          animationFrame.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      
      mediaRecorder.current.start();
      updateAudioLevel();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
    if (audioContext.current) {
      audioContext.current.close();
    }
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    setIsRecording(false);
    setAudioLevel(0);
  }, []);

  return {
    isRecording,
    audioLevel,
    startRecording,
    stopRecording
  };
}