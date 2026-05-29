'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, PerspectiveCamera, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Single interactive 3D book
function Book3D({
  position,
  rotation,
  color,
  accentColor,
  scale = 1,
  floatDelay = 0,
  title,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  color: string
  accentColor: string
  scale?: number
  floatDelay?: number
  title?: string
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  const W = 1.2 * scale
  const H = 1.7 * scale
  const D = 0.18 * scale

  const coverColor = new THREE.Color(color)
  const spineColor = new THREE.Color(color).multiplyScalar(0.6)
  const pageColor = new THREE.Color('#f5f0e8')
  const accent = new THREE.Color(accentColor)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime() + floatDelay
    groupRef.current.position.y = position[1] + Math.sin(t * 0.7) * 0.08
    groupRef.current.rotation.y = rotation[1] + Math.sin(t * 0.4) * 0.06
    if (hovered) {
      groupRef.current.rotation.y += (Math.PI * 0.15 - groupRef.current.rotation.y + rotation[1]) * 0.08
    }
  })

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'default' }}
    >
      {/* Cover (front face) */}
      <mesh position={[0, 0, D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color={coverColor} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Cover decoration stripe */}
      <mesh position={[-W / 2 + 0.12 * scale, 0, D / 2 + 0.001]}>
        <planeGeometry args={[0.05 * scale, H * 0.85]} />
        <meshStandardMaterial color={accent} roughness={0.2} metalness={0.3} emissive={accent} emissiveIntensity={0.3} />
      </mesh>

      {/* Back face */}
      <mesh position={[0, 0, -D / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color={coverColor.clone().multiplyScalar(0.85)} roughness={0.4} metalness={0.05} />
      </mesh>

      {/* Spine (left) */}
      <mesh position={[-W / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color={spineColor} roughness={0.35} metalness={0.15} />
      </mesh>

      {/* Pages (right edge — visible) */}
      <mesh position={[W / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color={pageColor} roughness={0.9} metalness={0} />
      </mesh>

      {/* Top edge */}
      <mesh position={[0, H / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color={pageColor} roughness={0.9} />
      </mesh>

      {/* Bottom edge */}
      <mesh position={[0, -H / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color={pageColor} roughness={0.9} />
      </mesh>

      {/* Cover highlight gloss strip */}
      <mesh position={[0.1 * scale, 0.3 * scale, D / 2 + 0.002]}>
        <planeGeometry args={[W * 0.3, H * 0.5]} />
        <meshStandardMaterial color="white" transparent opacity={0.04} roughness={0} metalness={1} />
      </mesh>

      {/* Shadow plane beneath */}
      <mesh position={[0, -H / 2 - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[W * 2, D * 4]} />
        <meshStandardMaterial color="black" transparent opacity={0.0} />
      </mesh>
    </group>
  )
}

// Floating sparkle particle
function Particle({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const speed = 0.4 + Math.random() * 0.6
  const offset = Math.random() * Math.PI * 2

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime() * speed + offset
    meshRef.current.position.y = position[1] + Math.sin(t) * 0.3
    (meshRef.current.material as any).opacity = 0.2 + Math.sin(t * 1.5) * 0.15
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.015, 6, 6]} />
      <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={2} transparent opacity={0.3} />
    </mesh>
  )
}

// Floating ring accent
function GlowRing() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.3
    ref.current.rotation.z = state.clock.getElapsedTime() * 0.1
  })
  return (
    <mesh ref={ref} position={[0, 0, -1]}>
      <torusGeometry args={[2.2, 0.008, 16, 100]} />
      <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1.5} transparent opacity={0.25} />
    </mesh>
  )
}

function GlowRing2() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.15 + 1) * 0.4
    ref.current.rotation.z = -state.clock.getElapsedTime() * 0.07
  })
  return (
    <mesh ref={ref} position={[0.3, 0.2, -1.2]}>
      <torusGeometry args={[1.8, 0.005, 16, 100]} />
      <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1.2} transparent opacity={0.2} />
    </mesh>
  )
}

// Orbiting small book
function OrbitBook({ radius, speed, offset, color }: { radius: number; speed: number; offset: number; color: string }) {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime() * speed + offset
    groupRef.current.position.x = Math.cos(t) * radius
    groupRef.current.position.z = Math.sin(t) * radius * 0.3 - 0.5
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.3
    groupRef.current.rotation.y = -t
  })
  const c = new THREE.Color(color)
  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[0.18, 0.26, 0.03]} />
        <meshStandardMaterial color={c} roughness={0.3} metalness={0.2} emissive={c} emissiveIntensity={0.2} />
      </mesh>
    </group>
  )
}

// Particles array
const PARTICLES: [number, number, number][] = Array.from({ length: 24 }, (_, i) => [
  (Math.sin(i * 1.3) * 2.5),
  (Math.cos(i * 0.9) * 1.8),
  (Math.sin(i * 0.5) * 1.2 - 0.5),
])

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.2, 5.5]} fov={45} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" castShadow />
      <directionalLight position={[-4, 2, 3]} intensity={0.8} color="#818cf8" />
      <pointLight position={[2, 3, 2]} intensity={2} color="#60a5fa" distance={8} />
      <pointLight position={[-2, -1, 2]} intensity={1.5} color="#c084fc" distance={6} />
      <pointLight position={[0, -2, 3]} intensity={1} color="#f472b6" distance={5} />

      {/* Main hero book — center */}
      <Book3D
        position={[0, 0, 0]}
        rotation={[0.06, -0.35, 0.02]}
        color="#1d4ed8"
        accentColor="#93c5fd"
        scale={1.4}
        floatDelay={0}
      />

      {/* Secondary books */}
      <Book3D
        position={[-1.9, 0.4, -0.8]}
        rotation={[0.05, 0.5, -0.04]}
        color="#7c3aed"
        accentColor="#c4b5fd"
        scale={0.85}
        floatDelay={1.2}
      />
      <Book3D
        position={[1.85, -0.2, -0.7]}
        rotation={[0.03, -0.6, 0.03]}
        color="#0f766e"
        accentColor="#5eead4"
        scale={0.8}
        floatDelay={2.1}
      />
      <Book3D
        position={[-1.2, -1.2, -1.2]}
        rotation={[0.08, 0.3, 0.06]}
        color="#be185d"
        accentColor="#f9a8d4"
        scale={0.65}
        floatDelay={0.7}
      />
      <Book3D
        position={[1.2, 1.3, -1.5]}
        rotation={[-0.05, -0.4, -0.03]}
        color="#92400e"
        accentColor="#fcd34d"
        scale={0.6}
        floatDelay={1.8}
      />

      {/* Orbiting mini books */}
      <OrbitBook radius={2.6} speed={0.25} offset={0} color="#60a5fa" />
      <OrbitBook radius={2.6} speed={0.25} offset={Math.PI} color="#f472b6" />
      <OrbitBook radius={2.0} speed={0.18} offset={Math.PI / 2} color="#34d399" />

      {/* Glow rings */}
      <GlowRing />
      <GlowRing2 />

      {/* Particles */}
      {PARTICLES.map((pos, i) => (
        <Particle key={i} position={pos} />
      ))}

      <Environment preset="city" />
    </>
  )
}

export default function BookScene3D() {
  return (
    <Canvas shadows dpr={[1, 1.5]} style={{ background: 'transparent' }}>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
