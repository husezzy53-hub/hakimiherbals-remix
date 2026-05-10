
import React, { useState } from 'react';
import { Star, Camera, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../constants';
import AudioRecorder from './AudioRecorder';

interface ReviewFormProps {
  onSuccess: () => void;
  initialName?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSuccess, initialName = '' }) => {
  const [userName, setUserName] = useState(initialName);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleImageUpload = () => {
    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        multiple: true,
        maxFiles: 5,
        sources: ['local', 'camera'],
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          setImages(prev => [...prev, result.info.secure_url]);
        }
      }
    );
    widget.open();
  };

  const uploadAudio = async (blob: Blob): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', blob);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error('Audio upload failed', err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let audioUrl = '';
      if (audioBlob) {
        audioUrl = await uploadAudio(audioBlob) || '';
      }

      await addDoc(collection(db, 'reviews'), {
        userName,
        rating,
        comment,
        imageUrls: images,
        audioUrl,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (err) {
      console.error('Failed to submit review', err);
      alert('Failed to submit review. Nature is healing our servers, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="w-20 h-20 bg-hakimi-sage/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-hakimi-sage" />
        </div>
        <h3 className="text-2xl font-serif font-black text-hakimi-forest mb-2">Review Submitted</h3>
        <p className="text-gray-500 font-medium">Thank you for sharing your journey. Our curators will review it shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
      <div>
        <label className="block text-[10px] font-black text-hakimi-forest uppercase tracking-widest mb-3 ml-1">Overall Experience</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setRating(num)}
              className={`p-2 transition-all ${rating >= num ? 'text-hakimi-terracotta scale-110' : 'text-gray-200'}`}
            >
              <Star className={`w-8 h-8 ${rating >= num ? 'fill-current' : ''}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] font-black text-hakimi-forest uppercase tracking-widest mb-1.5 ml-1">Your Name</label>
          <input
            required
            type="text"
            className="w-full px-5 py-3.5 rounded-2xl bg-hakimi-cream/50 border border-transparent focus:bg-white focus:border-hakimi-sage focus:ring-4 focus:ring-hakimi-sage/10 outline-none transition-all font-medium"
            placeholder="Display name..."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-[10px] font-black text-hakimi-forest uppercase tracking-widest mb-1.5 ml-1">Voice Reflection</label>
          <AudioRecorder onRecordingComplete={setAudioBlob} />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-black text-hakimi-forest uppercase tracking-widest mb-1.5 ml-1">Written Review</label>
        <textarea
          required
          rows={4}
          className="w-full px-5 py-3.5 rounded-2xl bg-hakimi-cream/50 border border-transparent focus:bg-white focus:border-hakimi-sage focus:ring-4 focus:ring-hakimi-sage/10 outline-none transition-all resize-none font-medium text-hakimi-forest"
          placeholder="How did our herbals help you?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-[10px] font-black text-hakimi-forest uppercase tracking-widest mb-3 ml-1">Visual Proof (Max 5)</label>
        <div className="flex flex-wrap gap-3">
          {images.map((url, idx) => (
            <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden shadow-sm">
              <img src={url} alt="Review" className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => setImages(images.filter((_, i) => i !== idx))}
                className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-hakimi-terracotta hover:bg-white"
              >
                <Star className="w-3 h-3 rotate-45" />
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <button
              type="button"
              onClick={handleImageUpload}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-hakimi-sage/30 flex flex-col items-center justify-center text-hakimi-sage hover:bg-hakimi-sage/5 transition-colors gap-1"
            >
              <Camera className="w-6 h-6" />
              <span className="text-[8px] font-bold uppercase tracking-tight">Add Photo</span>
            </button>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-hakimi-forest hover:bg-hakimi-sage text-white py-5 rounded-2xl font-black shadow-lg shadow-hakimi-forest/20 flex items-center justify-center gap-3 transition-all disabled:opacity-70 active:scale-[0.97] uppercase tracking-widest"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Archiving...
          </>
        ) : (
          <>
            Post Review <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};

export default ReviewForm;
