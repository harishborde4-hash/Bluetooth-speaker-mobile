import { useState, useRef, useEffect } from 'react';

interface LocationMarker {
  id: string;
  name: string;
  lat: number;
  lon: number;
  color: string;
}

const initialMarkers: LocationMarker[] = [
  { id: '1', name: 'New York, USA', lat: 40.7128, lon: -74.0060, color: '#ff6b6b' },
  { id: '2', name: 'London, UK', lat: 51.5074, lon: -0.1278, color: '#4ecdc4' },
  { id: '3', name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503, color: '#ffe66d' },
  { id: '4', name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093, color: '#95e1d3' },
  { id: '5', name: 'Paris, France', lat: 48.8566, lon: 2.3522, color: '#f38181' },
  { id: '6', name: 'Dubai, UAE', lat: 25.2048, lon: 55.2708, color: '#aa96da' },
  { id: '7', name: 'São Paulo, Brazil', lat: -23.5505, lon: -46.6333, color: '#fcbad3' },
  { id: '8', name: 'Mumbai, India', lat: 19.0760, lon: 72.8777, color: '#a8e6cf' },
  { id: '9', name: 'Cairo, Egypt', lat: 30.0444, lon: 31.2357, color: '#ffd3b6' },
  { id: '10', name: 'Moscow, Russia', lat: 55.7558, lon: 37.6173, color: '#ffaaa5' },
];

// Convert lat/lon to 3D coordinates
function latLonTo3D(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  
  return { x, y, z };
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [markers, setMarkers] = useState<LocationMarker[]>(initialMarkers);
  const [selectedMarker, setSelectedMarker] = useState<LocationMarker | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const radius = 150 * zoom;

    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#0a0e1a';
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 200; i++) {
        const x = (i * 137.508) % width;
        const y = (i * 49.731) % height;
        const size = (i % 3) * 0.5;
        ctx.fillRect(x, y, size, size);
      }

      const centerX = width / 2;
      const centerY = height / 2;

      // Create procedural earth texture points
      const points: Array<{ x: number; y: number; z: number; isLand: boolean }> = [];
      
      for (let lat = -90; lat <= 90; lat += 5) {
        for (let lon = -180; lon <= 180; lon += 5) {
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lon + 180) * (Math.PI / 180);
          
          // Rotate point
          let x = -radius * Math.sin(phi) * Math.cos(theta);
          let y = radius * Math.cos(phi);
          let z = radius * Math.sin(phi) * Math.sin(theta);

          // Apply rotation
          const cosX = Math.cos(rotation.x);
          const sinX = Math.sin(rotation.x);
          const cosY = Math.cos(rotation.y);
          const sinY = Math.sin(rotation.y);

          // Rotate around Y axis
          const tempX = x * cosY - z * sinY;
          const tempZ = x * sinY + z * cosY;
          x = tempX;
          z = tempZ;

          // Rotate around X axis
          const tempY = y * cosX - z * sinX;
          z = y * sinX + z * cosX;
          y = tempY;

          // Simple procedural land/ocean
          const noise = Math.sin(lat * 0.1) * Math.cos(lon * 0.08) + 
                        Math.sin(lat * 0.05) * Math.sin(lon * 0.12) +
                        Math.cos(lat * 0.15) * Math.cos(lon * 0.06);
          const isLand = noise > 0.2;

          points.push({ x, y, z, isLand });
        }
      }

      // Sort by z-index (painter's algorithm)
      points.sort((a, b) => b.z - a.z);

      // Draw globe points
      points.forEach(point => {
        if (point.z > 0) { // Only draw front-facing points
          const screenX = centerX + point.x;
          const screenY = centerY - point.y;
          
          const brightness = Math.max(0.3, (point.z + radius) / (radius * 2));
          
          if (point.isLand) {
            // Land - green
            const green = Math.floor(100 + brightness * 150);
            ctx.fillStyle = `rgb(34, ${green}, 34)`;
          } else {
            // Ocean - blue
            const blue = Math.floor(100 + brightness * 150);
            ctx.fillStyle = `rgb(30, 90, ${blue})`;
          }
          
          ctx.fillRect(screenX - 2, screenY - 2, 4, 4);
        }
      });

      // Draw atmosphere glow
      const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.9, centerX, centerY, radius * 1.2);
      gradient.addColorStop(0, 'rgba(136, 204, 255, 0)');
      gradient.addColorStop(1, 'rgba(136, 204, 255, 0.3)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Draw markers
      markers.forEach(marker => {
        const pos3d = latLonTo3D(marker.lat, marker.lon, radius);
        
        // Apply rotation
        const cosX = Math.cos(rotation.x);
        const sinX = Math.sin(rotation.x);
        const cosY = Math.cos(rotation.y);
        const sinY = Math.sin(rotation.y);

        let x = pos3d.x;
        let y = pos3d.y;
        let z = pos3d.z;

        // Rotate around Y axis
        const tempX = x * cosY - z * sinY;
        const tempZ = x * sinY + z * cosY;
        x = tempX;
        z = tempZ;

        // Rotate around X axis
        const tempY = y * cosX - z * sinX;
        z = y * sinX + z * cosX;
        y = tempY;

        if (z > 0) { // Only draw if on front side
          const screenX = centerX + x;
          const screenY = centerY - y;
          
          // Draw marker
          ctx.beginPath();
          ctx.arc(screenX, screenY, 6, 0, Math.PI * 2);
          ctx.fillStyle = marker.color;
          ctx.fill();
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Pulse effect
          const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
          ctx.beginPath();
          ctx.arc(screenX, screenY, 8 * pulse, 0, Math.PI * 2);
          ctx.strokeStyle = marker.color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 1 - pulse;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      animationRef.current = requestAnimationFrame(() => render());
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [markers, rotation, zoom]);

  // Auto-rotate
  useEffect(() => {
    if (!isDragging) {
      const interval = setInterval(() => {
        setRotation(prev => ({ ...prev, y: prev.y + 0.005 }));
      }, 16);
      return () => clearInterval(interval);
    }
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - lastMouse.x;
      const deltaY = e.clientY - lastMouse.y;
      
      setRotation(prev => ({
        x: prev.x + deltaY * 0.01,
        y: prev.y + deltaX * 0.01
      }));
      
      setLastMouse({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.5, Math.min(2, prev - e.deltaY * 0.001)));
  };

  const addRandomMarker = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da'];
    const newMarker: LocationMarker = {
      id: Date.now().toString(),
      name: `Location ${markers.length + 1}`,
      lat: Math.random() * 180 - 90,
      lon: Math.random() * 360 - 180,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setMarkers([...markers, newMarker]);
  };

  const clearMarkers = () => {
    setMarkers([]);
    setSelectedMarker(null);
  };

  const resetMarkers = () => {
    setMarkers(initialMarkers);
    setSelectedMarker(null);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
              <span className="text-4xl">🌍</span>
              Interactive Globe
            </h1>
            <p className="text-slate-300 text-sm">
              Drag to rotate • Scroll to zoom • Procedural rendering
            </p>
          </div>
          <button
            onClick={() => setShowControls(!showControls)}
            className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            {showControls ? 'Hide' : 'Show'} Controls
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={1200}
        height={800}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* Control Panel */}
      {showControls && (
        <div className="absolute bottom-6 left-6 z-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20 max-w-sm">
          <h2 className="text-xl font-semibold text-white mb-4">Controls</h2>
          <div className="space-y-3">
            <button
              onClick={addRandomMarker}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all font-medium shadow-lg"
            >
              + Add Random Marker
            </button>
            <button
              onClick={resetMarkers}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium shadow-lg"
            >
              ↻ Reset Markers
            </button>
            <button
              onClick={clearMarkers}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all font-medium shadow-lg"
            >
              ✕ Clear All Markers
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-slate-300 text-sm">
              Total Markers: <span className="font-bold text-white">{markers.length}</span>
            </p>
            <p className="text-slate-300 text-sm mt-1">
              Zoom: <span className="font-bold text-white">{(zoom * 100).toFixed(0)}%</span>
            </p>
          </div>
        </div>
      )}

      {/* Marker List */}
      <div className="absolute top-24 right-6 z-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20 max-w-xs max-h-96 overflow-y-auto">
        <h3 className="text-white font-semibold mb-3">📍 Locations ({markers.length})</h3>
        <div className="space-y-2">
          {markers.map(marker => (
            <div
              key={marker.id}
              className="flex items-center gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setSelectedMarker(marker)}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: marker.color }}
              />
              <span className="text-white text-sm flex-1">{marker.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Marker Info */}
      {selectedMarker && (
        <div className="absolute bottom-6 right-6 z-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20 max-w-sm">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Location Details</h2>
            <button
              onClick={() => setSelectedMarker(null)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-slate-400 text-sm mb-1">Name</p>
              <p className="text-white font-medium">{selectedMarker.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-slate-400 text-sm mb-1">Latitude</p>
                <p className="text-white font-medium">{selectedMarker.lat.toFixed(4)}°</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Longitude</p>
                <p className="text-white font-medium">{selectedMarker.lon.toFixed(4)}°</p>
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">Marker Color</p>
              <div
                className="w-full h-8 rounded-lg shadow-inner"
                style={{ backgroundColor: selectedMarker.color }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border border-white/10">
        <p className="text-white text-sm">
          <strong>Tip:</strong> This globe uses procedural generation with Canvas 2D - no heavy 3D libraries!
        </p>
      </div>
    </div>
  );
}
