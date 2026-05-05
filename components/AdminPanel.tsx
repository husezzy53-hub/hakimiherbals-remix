
import React, { useState } from 'react';
import { X, Upload, Copy, Check, Image as ImageIcon, Trash2 } from 'lucide-react';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../constants';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleUpload = () => {
    // @ts-ignore - Cloudinary is loaded via script tag
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: true,
        cropping: true,
        styles: {
          palette: {
            window: "#FDF8F1",
            windowBorder: "#728C69",
            tabIcon: "#2C3E2D",
            menuIcons: "#2C3E2D",
            textDark: "#2C3E2D",
            textLight: "#FFFFFF",
            link: "#C05A35",
            action: "#728C69",
            inactiveTabIcon: "#728C69",
            error: "#C05A35",
            inProgress: "#728C69",
            complete: "#728C69",
            sourceBg: "#FDF8F1"
          }
        }
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          setUploadedUrls(prev => [...prev, result.info.secure_url]);
        }
      }
    );
    widget.open();
  };

  const copyAllToClipboard = () => {
    if (uploadedUrls.length > 0) {
      navigator.clipboard.writeText(uploadedUrls.join(', '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const removeUrl = (index: number) => {
    setUploadedUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-hakimi-forest/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up border border-hakimi-sage/10 flex flex-col max-h-[90vh]">
        <div className="bg-hakimi-forest p-8 text-hakimi-cream flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Upload className="w-6 h-6 text-hakimi-terracotta" />
              Owner Portal
            </h2>
            <p className="text-hakimi-sage text-xs font-bold uppercase tracking-widest mt-1">Archive The Harvest</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-6 bg-hakimi-cream/30 overflow-y-auto flex-grow">
          <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-hakimi-sage/30 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-hakimi-sage/10 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="w-10 h-10 text-hakimi-sage" />
            </div>
            <h3 className="text-xl font-bold text-hakimi-forest mb-2">Capture Raw Assets</h3>
            <p className="text-gray-500 text-sm mb-8 max-w-xs font-medium">
              Upload multiple images to the Cloudinary vault. Paste the resulting comma-separated URLs into your Google Sheet's "image" column.
            </p>
            <button
              onClick={handleUpload}
              className="bg-hakimi-sage hover:bg-hakimi-forest text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl flex items-center gap-3 active:scale-95 uppercase tracking-widest"
            >
              <Upload className="w-5 h-5" /> Begin Upload
            </button>
          </div>

          {uploadedUrls.length > 0 && (
            <div className="animate-fade-in-up space-y-4">
              <div className="flex justify-between items-center px-2">
                <h4 className="text-xs font-black text-hakimi-forest uppercase tracking-widest">Uploaded Gallery ({uploadedUrls.length})</h4>
                <button 
                  onClick={copyAllToClipboard}
                  className="flex items-center gap-2 text-xs font-black text-hakimi-terracotta hover:text-hakimi-forest transition-colors uppercase tracking-widest"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Captured All!' : 'Copy All URLs'}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {uploadedUrls.map((url, index) => (
                  <div key={index} className="bg-white p-3 rounded-2xl border border-hakimi-sage/20 shadow-sm relative group">
                    <img src={url} alt={`Upload ${index}`} className="w-full h-24 object-cover rounded-xl border-2 border-hakimi-cream shadow-sm" />
                    <div className="mt-2 flex justify-between items-center">
                      <a href={url} target="_blank" rel="noreferrer" className="text-[10px] text-gray-400 hover:text-hakimi-sage truncate w-24">
                        {url}
                      </a>
                      <button 
                        onClick={() => removeUrl(index)}
                        className="text-gray-300 hover:text-hakimi-terracotta p-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-hakimi-forest px-8 py-5 flex justify-between items-center flex-shrink-0">
          <span className="text-[10px] text-hakimi-sage font-black tracking-[0.2em] uppercase">Cloudinary Powered</span>
          <button onClick={onClose} className="text-sm font-bold text-white hover:text-hakimi-terracotta transition-colors">Close Portal</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
