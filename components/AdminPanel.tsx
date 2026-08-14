
import React, { useState, useEffect } from 'react';
import { X, Upload, Copy, Check, Image as ImageIcon, Trash2, LogIn, LogOut, ShieldCheck, MessageSquare, Table, ExternalLink, RefreshCw, Code2, AlertCircle } from 'lucide-react';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, GOOGLE_SHEET_URL, GOOGLE_SHEET_ID } from '../constants';
import { auth, googleSignIn, googleSignOut, getCachedAccessToken } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import ReviewAdmin from './ReviewAdmin';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchProducts, fetchProductsWithOAuth } from '../store/productsSlice';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading: productsLoading } = useSelector((state: RootState) => state.products);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'sheets' | 'reviews'>('sheets');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    try {
      const res = await googleSignIn();
      if (res?.accessToken) {
        setSyncMessage("Signed in with Google! Synchronizing sheet catalog...");
        const prods = await dispatch(fetchProductsWithOAuth(res.accessToken)).unwrap();
        setSyncMessage(`Successfully synchronized ${prods.length} remedies directly from your Google Sheet!`);
      }
    } catch (e: any) {
      console.error("Google Sign-in error:", e);
    }
  };

  const handleLogout = () => googleSignOut();

  const handleManualSync = async () => {
    setSyncMessage(null);
    setSyncError(null);
    try {
      const token = getCachedAccessToken();
      let res;
      if (token) {
        res = await dispatch(fetchProductsWithOAuth(token)).unwrap();
      } else {
        res = await dispatch(fetchProducts()).unwrap();
      }
      setSyncMessage(`Successfully synchronized ${res.length} remedies from the catalog!`);
    } catch (e: any) {
      setSyncError(e.message || `Sync completed with latest verified remedies.`);
    }
  };

  const appsScriptCode = `// Google Apps Script for Hakimi Herbals
// Sheet: https://docs.google.com/spreadsheets/d/1uKti8fdfGufHNfeY1fqb37inrNuKL7woTyXftH0xhRM/edit

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Products") || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0].map(function(h) { return String(h).toLowerCase().trim(); });
  var result = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    if (obj.name || obj.title) {
      result.push(obj);
    }
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Orders");
      sheet.appendRow(["Timestamp", "Customer Name", "Phone / WhatsApp", "Delivery Area", "Address", "Email", "Total (PKR)", "Items Ordered"]);
    }
    
    var data = JSON.parse(e.postData.contents);
    var itemsStr = (data.items || []).map(function(item) {
      return item.name + " (" + item.quantity + "x @ Rs. " + item.price + ")";
    }).join(", ");

    sheet.appendRow([
      data.date || new Date().toISOString(),
      data.customer ? data.customer.name : "",
      data.customer ? data.customer.whatsapp : "",
      data.customer ? data.customer.area : "",
      data.customer ? data.customer.address : "",
      data.customer ? data.customer.email : "",
      data.total || 0,
      itemsStr
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

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

  const copyScriptCode = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
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
                  onClick={() => setActiveTab('sheets')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'sheets' ? 'bg-hakimi-terracotta text-white' : 'hover:bg-white/10'}`}
                >
                  <Table className="w-3 h-3" /> Sheet Sync
                </button>
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
                className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-8 py-4 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center gap-3 active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                Sign in with Google
              </button>
            </div>
          ) : activeTab === 'sheets' ? (
            <div className="space-y-6 animate-fade-in">
              {/* Linked Sheet Status Card */}
              <div className="bg-white rounded-3xl p-6 border border-hakimi-sage/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Linked Google Sheet</span>
                  </div>
                  <h3 className="text-lg font-bold text-hakimi-forest">Hakimi Herbals Inventory & Orders</h3>
                  <p className="text-xs text-gray-500 font-mono mt-0.5 truncate max-w-md">
                    ID: {GOOGLE_SHEET_ID}
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={handleManualSync}
                    disabled={productsLoading}
                    className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-hakimi-forest hover:bg-hakimi-sage text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${productsLoading ? 'animate-spin' : ''}`} />
                    {productsLoading ? 'Syncing...' : 'Sync Inventory Now'}
                  </button>
                  <a
                    href={GOOGLE_SHEET_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-2xl bg-hakimi-cream border border-hakimi-sage/30 hover:bg-white text-hakimi-forest font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Sheet
                  </a>
                </div>
              </div>

              {syncMessage && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  {syncMessage}
                </div>
              )}

              {syncError && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  {syncError}
                </div>
              )}

              {/* Column Structure Reference */}
              <div className="bg-white rounded-3xl p-6 border border-hakimi-sage/20 shadow-sm space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-hakimi-forest flex items-center gap-2">
                  <Table className="w-4 h-4 text-hakimi-terracotta" />
                  Recommended Sheet Column Headers
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {[
                    { title: "ID", desc: "1, 2, 3..." },
                    { title: "Name", desc: "Product Title" },
                    { title: "Price", desc: "e.g. 3500" },
                    { title: "Description", desc: "Details & herbs" },
                    { title: "Category", desc: "Featured / Wellness" },
                    { title: "Images", desc: "URLs (separated by ,)" },
                  ].map((col, idx) => (
                    <div key={idx} className="p-3 bg-hakimi-cream/40 rounded-2xl border border-hakimi-sage/10 text-center">
                      <div className="text-xs font-black text-hakimi-forest uppercase">{col.title}</div>
                      <div className="text-[10px] text-gray-500 font-medium mt-0.5">{col.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/60 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-900 leading-relaxed font-medium">
                    <strong>Direct Link Tip:</strong> In your Google Sheet, click <strong>Share</strong> &gt; set <strong>General Access</strong> to <em>"Anyone with the link can view"</em>. This enables instantaneous catalog synchronization.
                  </p>
                </div>
              </div>

              {/* Apps Script Code */}
              <div className="bg-white rounded-3xl p-6 border border-hakimi-sage/20 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-hakimi-forest flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-hakimi-terracotta" />
                      Google Apps Script Web App (Optional for Live 2-Way Sync & Orders)
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 font-medium">
                      In Google Sheets: <em>Extensions &gt; Apps Script</em>, paste this code, then <em>Deploy &gt; New Deployment &gt; Web app (Who has access: Anyone)</em>.
                    </p>
                  </div>
                  <button
                    onClick={copyScriptCode}
                    className="px-4 py-2 rounded-xl bg-hakimi-terracotta hover:bg-hakimi-forest text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all flex-shrink-0"
                  >
                    {codeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {codeCopied ? 'Copied Script!' : 'Copy Script'}
                  </button>
                </div>

                <div className="bg-[#1e1e1e] text-emerald-400 p-4 rounded-2xl font-mono text-[11px] max-h-48 overflow-y-auto leading-relaxed border border-gray-800">
                  <pre>{appsScriptCode}</pre>
                </div>
              </div>
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

