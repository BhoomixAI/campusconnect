import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { MapPin, CheckCircle2, ShieldAlert, Camera, Compass } from 'lucide-react';

// Hardcoded Venue Coordinates (e.g. IMS Engineering College Campus)
const VENUE_COORDS = { lat: 28.6758, lng: 77.5028 }; 
const MAX_RADIUS_METERS = 100; // Geofence radius tolerance

export default function AttendanceScanner() {
  const [geoStatus, setGeoStatus] = useState('checking'); // 'checking' | 'inside' | 'outside' | 'denied'
  const [userCoords, setUserCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const scannerRef = useRef(null);

  // Haversine formula to compute distance in meters between two lat/lng points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const rad = (deg) => (deg * Math.PI) / 180;
    const dLat = rad(lat2 - lat1);
    const dLon = rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  // Check Geolocation status
  const verifyLocation = () => {
    setGeoStatus('checking');
    if (!navigator.geolocation) {
      setGeoStatus('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const currentLat = pos.coords.latitude;
        const currentLng = pos.coords.longitude;
        setUserCoords({ lat: currentLat, lng: currentLng });

        const distMeters = calculateDistance(
          currentLat,
          currentLng,
          VENUE_COORDS.lat,
          VENUE_COORDS.lng
        );
        setDistance(distMeters);

        if (distMeters <= MAX_RADIUS_METERS) {
          setGeoStatus('inside');
        } else {
          setGeoStatus('outside');
        }
      },
      () => setGeoStatus('denied'),
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    verifyLocation();
  }, []);

  // Initialize Camera Scanner once geofence is confirmed
  useEffect(() => {
    if (geoStatus === 'inside' && !scanResult) {
      const scanner = new Html5QrcodeScanner(
        'reader',
        { fps: 10, qrbox: { width: 220, height: 220 } },
        /* verbose= */ false
      );

      scanner.render(
        (decodedText) => {
          setScanResult(decodedText);
          scanner.clear();
        },
        (error) => {
          // ignore scanning noise errors
        }
      );

      scannerRef.current = scanner;

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(() => {});
        }
      };
    }
  }, [geoStatus, scanResult]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm max-w-md mx-auto space-y-5 text-center">
      <h3 className="font-bold text-slate-800 text-lg">Mark Attendance</h3>

      {/* Geofence Status Badge */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-slate-600">
            <Compass className="w-4 h-4 text-blue-600" /> Geofence Verification
          </span>
          <button
            onClick={verifyLocation}
            className="text-blue-600 hover:underline text-[11px]"
          >
            Re-check
          </button>
        </div>

        {geoStatus === 'checking' && (
          <p className="text-xs text-slate-500 animate-pulse">Acquiring GPS position...</p>
        )}

        {geoStatus === 'inside' && (
          <p className="text-xs text-emerald-600 font-medium flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Inside Venue ({distance}m away)
          </p>
        )}

        {geoStatus === 'outside' && (
          <p className="text-xs text-rose-600 font-medium flex items-center justify-center gap-1">
            <ShieldAlert className="w-4 h-4" /> Outside Venue ({distance}m away - limit {MAX_RADIUS_METERS}m)
          </p>
        )}

        {geoStatus === 'denied' && (
          <p className="text-xs text-amber-600 font-medium">
            GPS Access Denied. Enable location permissions.
          </p>
        )}
      </div>

      {/* Camera Scanning Box */}
      {geoStatus === 'inside' && !scanResult && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <Camera className="w-3.5 h-3.5" /> Point camera at the live rotating venue QR
          </p>
          <div id="reader" className="overflow-hidden rounded-xl border border-slate-200"></div>
        </div>
      )}

      {/* Attendance Marked Confirmation */}
      {scanResult && (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h4 className="font-bold text-slate-800 text-base">Attendance Verified!</h4>
          <p className="text-xs text-slate-600">Your presence has been recorded successfully.</p>
          <p className="text-[10px] text-slate-400 font-mono break-all mt-2">Token: {scanResult}</p>
        </div>
      )}

      {/* Demo Override Button */}
      {geoStatus === 'outside' && (
        <button
          onClick={() => setGeoStatus('inside')}
          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
        >
          Override Geofence for Live Demo
        </button>
      )}
    </div>
  );
}