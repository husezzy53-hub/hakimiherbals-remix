
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, Play, Pause } from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  maxDuration?: number; // In seconds
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete, maxDuration = 45 }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecordingBlob(blob);
        onRecordingComplete(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      setRecordingBlob(null);

      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const deleteRecording = () => {
    setRecordingBlob(null);
    setDuration(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-hakimi-cream/50 rounded-2xl border border-hakimi-sage/10">
        <div className="flex items-center gap-4">
          {!recordingBlob ? (
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isRecording 
                ? 'bg-hakimi-terracotta text-white animate-pulse' 
                : 'bg-hakimi-forest text-white hover:bg-hakimi-sage shadow-lg'
              }`}
            >
              {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          ) : (
            <button
              type="button"
              onClick={togglePlayback}
              className="w-12 h-12 bg-hakimi-sage text-white rounded-full flex items-center justify-center hover:bg-hakimi-forest transition-colors shadow-lg"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <audio 
                ref={audioRef} 
                src={URL.createObjectURL(recordingBlob)} 
                onEnded={() => setIsPlaying(false)}
                hidden
              />
            </button>
          )}

          <div>
            <span className="text-xs font-black uppercase tracking-widest text-hakimi-forest">
              {isRecording ? 'Recording...' : recordingBlob ? 'Recorded Message' : 'Voice Review'}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${isRecording ? 'bg-hakimi-terracotta' : 'bg-hakimi-sage'}`} 
                  style={{ width: `${(duration / maxDuration) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-gray-400 tabular-nums">
                {duration}s / {maxDuration}s
              </span>
            </div>
          </div>
        </div>

        {recordingBlob && (
          <button
            type="button"
            onClick={deleteRecording}
            className="p-2 text-gray-300 hover:text-hakimi-terracotta transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {!isRecording && !recordingBlob && (
        <p className="text-[10px] text-gray-400 italic px-1">
          Share your experience in audio (max 45 seconds).
        </p>
      )}
    </div>
  );
};

export default AudioRecorder;
