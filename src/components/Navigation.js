import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 0rem 1rem 0rem;
  z-index: 100;
  background: rgba(17, 1, 1, 0.3);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Logo = styled(motion.div)`
  font-size: 1.5rem;
  font-weight: 500;
  cursor: pointer;
  color: white;
  margin-left: -1rem;
  font-family: 'Pacifico', cursive;
  background: linear-gradient(45deg, #ff3366, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-left: 0;
  }

  @font-face {
    font-family: 'Pacifico';
    src: url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const ResumeButton = styled(motion.button)`
  background: linear-gradient(45deg, #ff3366, #ff6b6b);
  border: none;
  padding: 0.75rem 1.5rem;
  color: white;
  border-radius: 50px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    
    span {
      display: none;
    }
  }
  
  svg {
    width: 18px;
    height: 18px;

    @media (max-width: 768px) {
      width: 16px;
      height: 16px;
    }
  }
`;

const MenuButton = styled(motion.button)`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  width: 50px;
  height: 50px;
  position: relative;
  z-index: 102;
`;

const MenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #0f0f0f;
  z-index: 101;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuItems = styled.div`
  text-align: center;
`;

const MenuItem = styled(motion.a)`
  display: block;
  font-size: 4rem;
  color: white;
  text-decoration: none;
  margin: 1rem 0;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }

  &:hover {
    color: #888;
  }
`;

const menuVariants = {
  closed: {
    y: "-100%",
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1],
    },
  },
  open: {
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled(motion.div)`
  background: rgb(17, 1, 1);
  padding: 2rem;
  border-radius: 1rem;
  position: relative;
  width: 90%;
  max-width: 1000px;
  height: 80vh;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
    width: 95%;
    height: 85vh;
  }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 2;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const PDFViewer = styled.iframe`
  width: 100%;
  height: calc(100% - 60px);
  border: none;
  border-radius: 0.5rem;
  background: white;
`;

const DownloadButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(45deg, #ff3366, #ff6b6b);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 500;
  margin-top: 1rem;

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }

  svg {
    width: 18px;
    height: 18px;

    @media (max-width: 768px) {
      width: 16px;
      height: 16px;
    }
  }
`;

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const menuItems = [
    { title: "Home", href: "#home" },
    { title: "About", href: "#about" },
    { title: "Projects", href: "#projects" },
    { title: "Contact", href: "#contact" },
  ];

  return (
    <>
      <Nav>
        <NavContent>
          <Logo
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Sambhrama's Portfolio
          </Logo>
          <NavRight>
            <ResumeButton
              onClick={() => setShowResume(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Resume</span>
            </ResumeButton>
            <MenuButton
              onClick={() => setIsOpen(!isOpen)}
              animate={{ rotate: isOpen ? 90 : 0 }}
            >
              <motion.span
                style={{
                  display: "block",
                  width: "25px",
                  height: "2px",
                  background: "white",
                  marginBottom: "6px",
                  transformOrigin: "center",
                }}
                animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
              />
              <motion.span
                style={{
                  display: "block",
                  width: "25px",
                  height: "2px",
                  background: "white",
                  transformOrigin: "center",
                }}
                animate={{ rotate: isOpen ? -45 : 0 }}
              />
            </MenuButton>
          </NavRight>
        </NavContent>
      </Nav>

      <AnimatePresence>
        {showResume && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowResume(false)}
          >
            <ModalContent
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton onClick={() => setShowResume(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </CloseButton>
              <PDFViewer src="/resume.pdf" />
              <DownloadButton 
                href="/resume.pdf" 
                download
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Resume
              </DownloadButton>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <MenuOverlay
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <MenuItems>
              {menuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {item.title}
                </MenuItem>
              ))}
            </MenuItems>
          </MenuOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation; 