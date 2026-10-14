import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, MeshDistortMaterial, Environment, Text3D, Center } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Animated floating document
function FloatingDocument({ position, color, scale = 1 }) {
  const meshRef = useRef();
  const time = useRef(0);

  useFrame((state, delta) => {
    time.current += delta;
    meshRef.current.rotation.x = Math.sin(time.current * 0.3) * 0.1;
    meshRef.current.rotation.y += delta * 0.2;
    meshRef.current.position.y = position[1] + Math.sin(time.current * 0.5) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <boxGeometry args={[1, 1.4, 0.05]} />
      <meshStandardMaterial
        color={color}
        metalness={0.3}
        roughness={0.4}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

// Particle system
function Particles({ count = 100 }) {
  const points = useRef();

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    points.current.rotation.y = state.clock.elapsedTime * 0.05;
    points.current.rotation.x = state.clock.elapsedTime * 0.03;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#60a5fa"
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  );
}

// Central distorted sphere
function DistortedSphere() {
  const sphereRef = useRef();

  useFrame((state) => {
    sphereRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    sphereRef.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={sphereRef} args={[1.2, 100, 100]} scale={1.5}>
        <MeshDistortMaterial
          color="#3b82f6"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive="#1e40af"
          emissiveIntensity={0.3}
        />
      </Sphere>
    </Float>
  );
}

// Glowing rings
function GlowingRings() {
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame((state) => {
    ring1Ref.current.rotation.x = state.clock.elapsedTime * 0.5;
    ring2Ref.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  return (
    <>
      <mesh ref={ring1Ref} position={[0, 0, 0]}>
        <torusGeometry args={[2.5, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#3b82f6"
          emissiveIntensity={0.5}
          metalness={0.8}
        />
      </mesh>
      <mesh ref={ring2Ref} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.8, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#818cf8"
          emissive="#6366f1"
          emissiveIntensity={0.5}
          metalness={0.8}
        />
      </mesh>
    </>
  );
}

// Main 3D scene
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#60a5fa" />
      <pointLight position={[10, -10, 10]} intensity={0.5} color="#818cf8" />

      {/* Central distorted sphere */}
      <DistortedSphere />

      {/* Glowing rings */}
      <GlowingRings />

      {/* Floating documents */}
      <FloatingDocument position={[-3, 2, 0]} color="#3b82f6" scale={0.6} />
      <FloatingDocument position={[3, 1, -2]} color="#60a5fa" scale={0.7} />
      <FloatingDocument position={[-2, -1, -1]} color="#818cf8" scale={0.5} />
      <FloatingDocument position={[2.5, -2, 1]} color="#6366f1" scale={0.6} />

      {/* Particle system */}
      <Particles count={150} />

      {/* Environment for reflections */}
      <Environment preset="city" />

      {/* Camera controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  );
}

// Main component
export default function Hero3D() {
  return (
    <div className="w-full h-[600px] relative">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        className="bg-transparent"
      >
        <Scene />
      </Canvas>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-900 pointer-events-none" />
    </div>
  );
}
