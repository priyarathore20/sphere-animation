import { Canvas, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Particles = () => {
  const particlesRef = useRef();
  const renderingParentRef = useRef();

  const animProps = useRef({
    scale: 1,
    xRot: 0,
    yRot: 0,
  });

  useEffect(() => {
    const distance = 100; // Set the radius for the sphere
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    // Create 1600 particles
    for (let i = 0; i < 1600; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360); // Random angle in theta (longitude)
      const phi = THREE.MathUtils.randFloatSpread(360); // Random angle in phi (latitude)

      // Convert spherical to Cartesian coordinates
      const x =
        distance *
        Math.sin(THREE.MathUtils.degToRad(theta)) *
        Math.cos(THREE.MathUtils.degToRad(phi));
      const y =
        distance *
        Math.sin(THREE.MathUtils.degToRad(theta)) *
        Math.sin(THREE.MathUtils.degToRad(phi));
      const z = distance * Math.cos(THREE.MathUtils.degToRad(theta));

      vertices.push(x, y, z);
    }

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    if (particlesRef.current) {
      particlesRef.current.geometry = geometry;
    }

    // GSAP animations for scaling and rotation
    gsap.to(animProps.current, {
      duration: 3, // Faster scaling effect
      scale: 1.3,
      repeat: -1,
      yoyo: true,
      ease: 'sine',
      onUpdate: () => {
        if (renderingParentRef.current) {
          renderingParentRef.current.scale.set(
            animProps.current.scale,
            animProps.current.scale,
            animProps.current.scale
          );
        }
      },
    });

    gsap.to(animProps.current, {
      duration: 120,
      xRot: Math.PI * 2,
      yRot: Math.PI * 4,
      repeat: -1,
      yoyo: true,
      ease: 'none',
      onUpdate: () => {
        if (renderingParentRef.current) {
          renderingParentRef.current.rotation.set(
            animProps.current.xRot,
            animProps.current.yRot,
            0
          );
        }
      },
    });
  }, []);

  useFrame(({ mouse }) => {
    if (particlesRef.current) {
      gsap.to(particlesRef.current.rotation, {
        duration: 0.1,
        x: mouse.y * -1, // Rotate based on mouse Y position
        y: mouse.x, // Rotate based on mouse X position
      });
    }
  });

  return (
    <group ref={renderingParentRef}>
      <points ref={particlesRef}>
        <pointsMaterial color={'#3ED5DD'} size={2} />
      </points>
    </group>
  );
};

const SphereVideo = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height
        width: '100vw', // Full viewport width
        overflow: 'hidden', // Prevent scrollbars
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '500px', // Limit max width for larger screens
          aspectRatio: '1', // Maintain a square aspect ratio (1:1)
        }}
      >
        <Canvas
          camera={{
            position: [0, 0, 300], // Fixed camera position
            fov: 75, // Set the field of view
            near: 0.1,
            far: 1000,
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <Particles />
        </Canvas>
      </div>
    </div>
  );
};

export default SphereVideo;
