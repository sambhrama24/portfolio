import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture, PositionalAudio, Edges } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import useSound from 'use-sound';

// Styled Components
// Main section that holds everything
const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: visible;
  padding: 0 2rem;
  background-color:rgb(17, 1, 1);
  z-index: 1; // Base layer in z-index stacking
`;

// Container for the content (title and subtitle)
const HeroContent = styled.div`
  text-align: left;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4rem;
  position: relative;

  // Mobile responsiveness
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
`;

// Wrapper for text content
const TextContent = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;
`;

// Main title styling
const Title = styled(motion.h1)`
  font-size: clamp(3rem, 8vw, 8rem); // Responsive font size
  font-weight: 700;
  margin: 0;
  line-height: 1;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  transform-origin: left center; // For fluid animation when cube hits
`;

// Subtitle styling
const Subtitle = styled(motion.p)`
  font-size: clamp(1rem, 2vw, 1.5rem);
  margin-top: 2rem;
  color: #888;
  max-width: 600px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

// Wrapper for the 3D canvas
const CanvasWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none; // Allows clicking through to content
  z-index: 2; // Sits above content for 3D effect
  background: transparent;
`;

// Invisible collision plane for the title area
const TitleCollider = () => {
  return (
    <RigidBody type="fixed" restitution={0.5} friction={0.2}>
      <mesh position={[0, 2, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[4, 0.5, 4]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </RigidBody>
  );
};

// Final landing platform
const LandingPlatform = () => {
  return (
    <RigidBody type="fixed" restitution={0} friction={1}>
      <mesh position={[10, 2, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[3, 0.2, 3]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </RigidBody>
  );
};

// The glowing cube component
const GlowingCube = ({ onCollision }) => {
  const cubeRef = useRef();
  const [play] = useSound('/sounds/glass.wav', { volume: 0.5 });
  const [hovered, setHovered] = useState(false);
  const [hasCollided, setHasCollided] = useState(false);
  const [isLanded, setIsLanded] = useState(false);

  // Initial movement setup
  useEffect(() => {
    if (cubeRef.current) {
      cubeRef.current.setLinvel({ x: 2, y: -2, z: 0 });
    }
  }, []);

  // Handle collision with surfaces
  const handleCollision = () => {
    if (!hasCollided && !isLanded) {
      setHasCollided(true);
      onCollision();

      // Play sound using useSound hook
      play();

      setTimeout(() => {
        if (cubeRef.current) {
          cubeRef.current.setLinvel({ x: 8, y: -8, z: 0 });
          cubeRef.current.setAngvel({ x: 0, y: 0, z: -0.5 });
        }
      }, 50);

      setTimeout(() => {
        setIsLanded(true);
        if (cubeRef.current) {
          cubeRef.current.setLinvel({ x: 0, y: 0, z: 0 });
          cubeRef.current.setAngvel({ x: 0, y: 0, z: 0 });
        }
      }, 1200);
    }
  };

  return (
    <RigidBody
      ref={cubeRef}
      colliders="cuboid"
      restitution={0.2}
      friction={0.8}
      position={[-2, 12, 0]}
      linearDamping={isLanded ? 100 : 0.2}
      angularDamping={isLanded ? 100 : 0.2}
      onCollisionEnter={handleCollision}
      mass={1}
      type="dynamic"
    >
      <group>
        {/* Main cube */}
        <mesh
          castShadow
          receiveShadow
          scale={[4, 4, 4]}
          rotation={[Math.PI / 4, Math.PI / 4, 0]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <boxGeometry />
          <meshStandardMaterial
            color="rgb(255, 104, 104)"
            emissive="rgb(255, 104, 104)"
            emissiveIntensity={hasCollided ? 1.3 : hovered ? 0.9 : 0.5}
            metalness={0.3}
            roughness={0.2}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Multiple edge layers for thickness */}
        <mesh scale={[4.05, 4.05, 4.05]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <boxGeometry />
          <meshBasicMaterial
            color="white"
            transparent
            opacity={0.3}
            wireframe
            wireframeLinewidth={2}
          />
        </mesh>
        <mesh scale={[4.02, 4.02, 4.02]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <boxGeometry />
          <meshBasicMaterial
            color="white"
            transparent
            opacity={0.5}
            wireframe
            wireframeLinewidth={2}
          />
        </mesh>
        {/* Glow layer */}
        <mesh
          scale={[4.2, 4.2, 4.2]}
          rotation={[Math.PI / 4, Math.PI / 4, 0]}
        >
          <boxGeometry />
          <meshBasicMaterial
            color="rgb(255, 104, 104)"
            transparent
            opacity={0.1}
          />
        </mesh>
      </group>
    </RigidBody>
  );
};

// Shadow receiving plane
const ShadowPlane = () => (
  <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
    <planeGeometry args={[100, 100]} />
    <meshStandardMaterial transparent opacity={0} />
  </mesh>
);

// Main Hero component
const Hero = () => {
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const [titleAnimation, setTitleAnimation] = useState(false);

  const handleCubeCollision = () => {
    setTitleAnimation(true);
    setTimeout(() => setTitleAnimation(false), 600);
  };

  return (
    <>
      {/* 3D Canvas Setup */}
      <CanvasWrapper>
        <Canvas
          camera={{ position: [-6, 4, 10], fov: 45 }}
          shadows
        >
          <ambientLight intensity={0.3} />
          <spotLight
            position={[10, 15, 10]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <Physics gravity={[0, -15, 0]}>
            <GlowingCube onCollision={handleCubeCollision} />
            <TitleCollider />
            <LandingPlatform />
            <ShadowPlane />
          </Physics>
          <EffectComposer>
            <Bloom 
              intensity={0.5}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
            />
          </EffectComposer>
          <OrbitControls enabled={false} />
        </Canvas>
      </CanvasWrapper>

      {/* Content Section */}
      <HeroSection id="home" ref={heroRef}>
        <HeroContent>
          <TextContent>
            {/* Title with fluid animation */}
            <Title
              initial={{ opacity: 0, y: 100 }}
              animate={{
                opacity: 1,
                y: 0,
                // Animation sequence when cube hits
                scale: titleAnimation ? [1, 0.95, 1.02, 1] : 1, // Squish and expand
                rotateX: titleAnimation ? [0, -10, 5, 0] : 0, // Tilt back and forth
              }}
              transition={{
                duration: titleAnimation ? 0.6 : 1,
                ease: titleAnimation ? "easeOut" : "easeOut",
                times: titleAnimation ? [0, 0.2, 0.5, 1] : undefined,
              }}
            >
              Full Stack
              <br />
              Developer
            </Title>
            {/* Subtitle with fade-in animation */}
            <Subtitle
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            >
              Crafting immersive digital experiences through code and creativity
            </Subtitle>
          </TextContent>
        </HeroContent>
      </HeroSection>
    </>
  );
};

export default Hero; 