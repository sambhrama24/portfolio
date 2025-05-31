import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CursorWrapper = styled(motion.div)`
  position: fixed;
  left: 0;
  top: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
`;

const CursorDot = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 50%;
  transform-origin: center;
`;

const Cursor = ({ position }) => {
  return (
    <CursorWrapper
      style={{
        x: position.x - 16,
        y: position.y - 16,
      }}
    >
      <CursorDot
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </CursorWrapper>
  );
};

export default Cursor; 