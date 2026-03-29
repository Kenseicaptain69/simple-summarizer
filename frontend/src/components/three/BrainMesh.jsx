import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const BrainMesh = ({ size = 150 }) => {
  const meshRef = useRef()

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
      meshRef.current.rotation.x += 0.001
    }
  })

  return (
    <Canvas
      style={{
        width: size,
        height: size,
        borderRadius: '12px',
      }}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 3], fov: 50 }}
    >
      <color attach="background" args={['#0a0a0f']} />
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 4]} />
        <meshBasicMaterial
          color="#6c63ff"
          wireframe
          opacity={0.15}
          transparent
        />
      </mesh>
      <pointLight position={[3, 3, 3]} intensity={2} color="#6c63ff" />
    </Canvas>
  )
}

export default BrainMesh
