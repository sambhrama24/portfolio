import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

// Components
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Cursor from './components/Cursor';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const StyledMain = styled.main`
  background-color: #0f0f0f;
  color: #ffffff;
  min-height: 100vh;
  position: relative;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: 0.5,
    ease: "easeInOut"
  }
};

function App() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Initialize ScrollTrigger
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <StyledMain className="App">
      <Cursor position={cursorPosition} />
      <Navigation />
      <ContentWrapper>
        <AnimatePresence mode="wait">
          <motion.div
            {...pageTransition}
          >
            <Hero />
            <About />
            <Projects />
            <Contact />
          </motion.div>
        </AnimatePresence>
      </ContentWrapper>
    </StyledMain>
  );
}

export default App;
