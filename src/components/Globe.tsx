import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface LocationMarker {
  id: string;
  name: string;
  lat: number;
  lon: number;
  color: string;
}

interface GlobeProps {
  markers: LocationMarker[];
  onMarkerClick?: (marker: LocationMarker) => void;
}

// Convert lat/lon to 3D coordinates
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  
  return new THREE.Vector3(x, y, z);
}

// Shader for procedural earth
const earthVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const earthFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Create landmass pattern
    float pattern = 0.0;
    pattern += noise(uv * 4.0) * 0.5;
    pattern += noise(uv * 8.0) * 0.25;
    pattern += noise(uv * 16.0) * 0.125;
    
    // Ice caps
    float polarFactor = abs(cos(uv.y * 3.14159));
    float ice = step(0.95, polarFactor);
    
    // Land vs ocean
    float isLand = step(0.45, pattern);
    
    // Colors
    vec3 ocean = vec3(0.1, 0.3, 0.6);
    vec3 land = vec3(0.2, 0.5, 0.2);
    vec3 iceColor = vec3(0.9, 0.95, 1.0);
    
    vec3 color = mix(ocean, land, isLand);
    color = mix(color, iceColor, ice);
    
    // Lighting
    vec3 light = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(vNormal, light), 0.0);
    color *= 0.6 + diff * 0.4;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

function Marker({ marker, onClick }: { marker: LocationMarker; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const position = useMemo(() => {
    return latLonToVector3(marker.lat, marker.lon, 2.05);
  }, [marker.lat, marker.lon]);

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.2);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial
        color={marker.color}
        emissive={marker.color}
        emissiveIntensity={hovered ? 1 : 0.5}
      />
    </mesh>
  );
}

export default function Globe({ markers, onMarkerClick }: GlobeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const rotationVelocity = useRef({ x: 0, y: 0 });
  const { camera, gl } = useThree();

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
    });
  }, []);

  useFrame(() => {
    if (groupRef.current && !isDragging.current) {
      groupRef.current.rotation.y += rotationVelocity.current.y;
      groupRef.current.rotation.x += rotationVelocity.current.x;
      
      rotationVelocity.current.x *= 0.95;
      rotationVelocity.current.y *= 0.95;
      
      if (Math.abs(rotationVelocity.current.y) < 0.001) {
        rotationVelocity.current.y = 0.002;
      }
    }
  });

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const deltaX = e.clientX - previousMousePosition.current.x;
        const deltaY = e.clientY - previousMousePosition.current.y;
        
        rotationVelocity.current.y = deltaX * 0.005;
        rotationVelocity.current.x = deltaY * 0.005;
        
        previousMousePosition.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.001;
      camera.position.z = Math.max(3, Math.min(10, camera.position.z + delta));
    };

    gl.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    gl.domElement.addEventListener('wheel', handleWheel);

    return () => {
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      gl.domElement.removeEventListener('wheel', handleWheel);
    };
  }, [camera, gl]);

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[2, 50, 50]} />
        <primitive object={shaderMaterial} attach="material" />
      </mesh>

      <mesh scale={1.05}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#88ccff"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {markers.map((marker) => (
        <Marker
          key={marker.id}
          marker={marker}
          onClick={() => onMarkerClick?.(marker)}
        />
      ))}

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={1} />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#4488ff" />
    </group>
  );
}
