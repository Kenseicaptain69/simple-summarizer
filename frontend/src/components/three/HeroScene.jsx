import React, { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from '../../context/ThemeContext'

const ParticleField = ({ isDark }) => {
  const pointsRef = useRef()

  useEffect(() => {
    if (!pointsRef.current) return

    const particleCount = 2000
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const material = new THREE.PointsMaterial({
      color: isDark ? 0xffffff : 0x333344,
      size: 0.05,
      opacity: isDark ? 0.3 : 0.4,
      transparent: true,
      sizeAttenuation: true,
    })

    pointsRef.current.geometry = geometry
    pointsRef.current.material = material
  }, [isDark])

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001
      if (pointsRef.current.material) {
        const baseOpacity = isDark ? 0.3 : 0.4
        pointsRef.current.material.opacity = baseOpacity + Math.sin(clock.elapsedTime) * 0.1
      }
    }
  })

  return <points ref={pointsRef} />
}

const FloatingOrb = ({ isDark }) => {
  const sphereRef = useRef()
  const wireframeRef = useRef()

  const orbColor = isDark ? '#6c63ff' : '#0097A7'
  const wireColor = isDark ? '#6c63ff' : '#0097A7'

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.004
      sphereRef.current.rotation.x += 0.002
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y -= 0.003
      wireframeRef.current.rotation.x -= 0.001
    }
  })

  return (
    <group>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          color={orbColor}
          emissive={orbColor}
          emissiveIntensity={isDark ? 0.4 : 0.2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      <mesh ref={wireframeRef}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial
          color={wireColor}
          wireframe
          opacity={isDark ? 0.15 : 0.1}
          transparent
        />
      </mesh>
    </group>
  )
}

const SceneBackground = ({ isDark }) => {
  const { scene } = useThree()

  useEffect(() => {
    scene.background = new THREE.Color(isDark ? '#0a0a0f' : '#e8eaf0')
  }, [isDark, scene])

  return null
}

const Lights = ({ isDark }) => (
  <>
    <pointLight position={[3, 3, 3]} intensity={isDark ? 3 : 2} color={isDark ? '#6c63ff' : '#0097A7'} />
    <pointLight position={[-3, -2, 2]} intensity={isDark ? 2 : 1.5} color={isDark ? '#00d4ff' : '#0097A7'} />
    <pointLight position={[0, 5, 0]} intensity={isDark ? 1 : 2} color="#ffffff" />
    {!isDark && <ambientLight intensity={0.5} />}
  </>
)

const HeroScene = () => {
  const { isDark } = useTheme()

  return (
    <Canvas
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
      }}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5], fov: 60 }}
    >
      <SceneBackground isDark={isDark} />
      <ParticleField isDark={isDark} />
      <FloatingOrb isDark={isDark} />
      <Lights isDark={isDark} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        dampingFactor={0.05}
      />
    </Canvas>
  )
}

export default HeroScene
