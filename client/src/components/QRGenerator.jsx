import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, RefreshCw, MapPin } from 'lucide-react';

export default function QRGenerator({ eventName = "AI & ML Workshop", venue = "Seminar Hall" }) {
  const [timer, setTimer] = useState(10);
  const [qrToken, setQrToken] = useState('');

  // Generate dynamic payload & countdown timer loop
  useEffect(() => {
    const generateNewToken = () => {
      const newToken = `CAMPUS_CONNECT_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      setQrToken(newToken);
      setTimer(10);
    };

    generateNewToken();

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          generateNewToken();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col items-center text-center max-w-md mx-auto space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Proxy-Proof Active
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-800">{eventName}</h3>
        <p className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-0.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {venue}
        </p>
      </div>

      {/* Rotating QR Box */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative shadow-inner">
        {qrToken ? (
          <QRCodeSVG value={qrToken} size={200} level="H" includeMargin={true} />
        ) : (
          <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
            Generating...
          </div>
        )}
      </div>

      {/* Countdown Progress Indicator */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-4 py-2 rounded-xl w-full justify-center">
        <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
        <span>QR refreshes in: <strong className="text-blue-600 text-sm">{timer}s</strong></span>
      </div>

      <p className="text-[11px] text-slate-400 leading-tight">
        Screenshots will expire in {timer} seconds. Students must scan live on location.
      </p>
    </div>
  );
}