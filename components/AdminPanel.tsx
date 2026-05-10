
import React, { useState, useEffect } from 'react';
import { X, Upload, Copy, Check, Image as ImageIcon, Trash2, LogIn, LogOut, ShieldCheck, MessageSquare } from 'lucide-react';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../constants';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from 'firebase/auth';
import ReviewAdmin from './ReviewAdmin';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'reviews'>('upload');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogin = () => {
    signInWithPopup(auth, new GoogleAuthProvider());
  };

  const handleLogout = () => signOut(auth);

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
      
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in-up border border-hakimi-sage/10 flex flex-col h-[90vh]">
        <div className="bg-hakimi-forest p-8 text-hakimi-cream flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-hakimi-terracotta" />
                Owner Portal
              </h2>
              <p className="text-hakimi-sage text-[10px] font-black uppercase tracking-widest mt-1">Archive {user ? `| ${user.email}` : ''}</p>
            </div>
            
            {user && (
              <div className="flex gap-2 bg-white/5 p-1 rounded-2xl ml-4">
                <button 
                  onClick={() => setActiveTab('upload')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'upload' ? 'bg-hakimi-terracotta text-white' : 'hover:bg-white/10'}`}
                >
                  <Upload className="w-3 h-3" /> Assets
                </button>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'reviews' ? 'bg-hakimi-terracotta text-white' : 'hover:bg-white/10'}`}
                >
                  <MessageSquare className="w-3 h-3" /> Reviews
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-hakimi-terracotta hover:text-white transition-colors">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            ) : (
              <button onClick={handleLogin} className="flex items-center gap-2 px-6 py-2.5 bg-hakimi-terracotta hover:bg-hakimi-sage rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 bg-hakimi-cream/30 overflow-y-auto flex-grow">
          {!user ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-hakimi-forest/5 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-12 h-12 text-hakimi-sage opacity-20" />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-black text-hakimi-forest">Authentication Required</h3>
                <p className="text-gray-500 max-w-xs mx-auto mt-2 font-medium">Please sign in with your authorized Google account to manage the archive.</p>
              </div>
              <button 
                onClick={handleLogin}
                className="bg-hakimi-forest hover:bg-hakimi-sage text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-hakimi-forest/20 transition-all flex items-center gap-3"
              >
                <LogIn className="w-5 h-5" /> Authorized Entrance
              </button>
            </div>
          ) : activeTab === 'upload' ? (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-3xl p-12 border-2 border-dashed border-hakimi-sage/30 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-hakimi-sage/10 rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="w-10 h-10 text-hakimi-sage" />
                </div>
                <h3 className="text-xl font-bold text-hakimi-forest mb-2">Capture Raw Assets</h3>
                <p className="text-gray-500 text-sm mb-8 max-w-sm font-medium">
                  Upload multiple images to the Cloudinary vault. Paste the resulting URLs into your Google Sheet to update the collection.
                </p>
                <button
                  onClick={handleUpload}
                  className="bg-hakimi-sage hover:bg-hakimi-forest text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl flex items-center gap-3 active:scale-95 uppercase tracking-widest"
                >
                  <Upload className="w-5 h-5" /> Begin Upload
                </button>
              </div>

              {uploadedUrls.length > 0 && (
                <div className="space-y-4">
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
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {uploadedUrls.map((url, index) => (
                      <div key={index} className="bg-white p-3 rounded-2xl border border-hakimi-sage/20 shadow-sm relative group">
                        <img src={url} alt={`Upload ${index}`} className="w-full h-24 object-cover rounded-xl border-2 border-hakimi-cream shadow-sm" />
                        <div className="mt-2 flex justify-between items-center">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(url);
                            }}
                            className="text-[8px] font-black uppercase tracking-tighter text-gray-400 hover:text-hakimi-sage truncate w-24"
                          >
                            Copy URL
                          </button>
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
          ) : (
            <ReviewAdmin />
          )}
        </div>
        
        <div className="bg-hakimi-forest px-8 py-5 flex justify-between items-center flex-shrink-0">
          <span className="text-[10px] text-hakimi-sage font-black tracking-[0.2em] uppercase">Security Level: {user ? 'Authorized' : 'Public'}</span>
          <button onClick={onClose} className="text-sm font-bold text-white hover:text-hakimi-terracotta transition-colors">Exit Portal</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
