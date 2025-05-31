import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';

const AboutSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  position: relative;
  overflow: visible;
  background-color: rgb(17, 1, 1);
  z-index: 10;
`;

const Container = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 6fr 6fr;
  gap: 6rem;
  position: relative;
  background-color: rgb(17, 1, 1);
  
  @media (max-width: 1200px) {
    grid-template-columns: 6fr 5fr;
    gap: 4rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 4rem;
  }
`;

const TextContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
`;

const Title = styled(motion.h2)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 3rem;
  line-height: 1.1;
  background: linear-gradient(45deg, #ff3366, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Description = styled(motion.p)`
  font-size: clamp(1.1rem, 1.5vw, 1.25rem);
  line-height: 1.8;
  color: #888;
  margin-bottom: 2rem;
  letter-spacing: 0.02em;
  max-width: 750px;
`;

const SkillsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1.5rem;
  margin-top: 4rem;
  width: 100%;
`;

const Skill = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 1.25rem;
  border-radius: 12px;
  font-size: 1rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  color: #fff;
  letter-spacing: 0.02em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(255, 51, 102, 0.1), rgba(255, 107, 107, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }

  span.emoji {
    font-size: 1.2rem;
  }

  span.skill-name {
    font-size: 1rem;
  }
`;

const ImageContainer = styled(motion.div)`
  position: relative;
  height: 700px;
  width: 100%;
  border-radius: 24px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(255, 51, 102, 0.1), rgba(255, 107, 107, 0.1));
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(50%);
    transition: all 0.6s cubic-bezier(0.43, 0.13, 0.23, 0.96);
  }

  &:hover img {
    filter: grayscale(0%);
    transform: scale(1.05);
  }

  @media (max-width: 1200px) {
    height: 600px;
  }

  @media (max-width: 768px) {
    height: 500px;
  }
`;

const FloatingShape = styled(motion.div)`
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(255, 51, 102, 0.1), transparent);
  pointer-events: none;
  z-index: 1;
`;

const LandingZone = styled(motion.div)`
  position: absolute;
  top: -50px;
  right: 15%;
  width: 500px;
  height: 100px;
  border-radius: 20px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 51, 102, 0.1) 50%,
    transparent
  );
  opacity: 0;
  pointer-events: none;
  
  @media (max-width: 768px) {
    width: 300px;
    right: 50%;
    transform: translateX(50%);
  }
`;

const About = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-20%" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1]);

  const landingZoneOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.2, 0.3],
    [0, 1, 0]
  );

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!imageRef.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = imageRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;
      
      gsap.to(imageRef.current, {
        rotateY: x * 15,
        rotateX: -y * 15,
        translateX: x * 25,
        translateY: y * 25,
        scale: 1.1,
        duration: 1,
        ease: "power3.out"
      });
    };

    const handleMouseLeave = () => {
      if (!imageRef.current) return;
      
      gsap.to(imageRef.current, {
        rotateY: 0,
        rotateX: 0,
        translateX: 0,
        translateY: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out"
      });
    };

    const imageContainer = imageRef.current;
    if (imageContainer) {
      imageContainer.addEventListener('mousemove', handleMouseMove);
      imageContainer.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (imageContainer) {
        imageContainer.removeEventListener('mousemove', handleMouseMove);
        imageContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <AboutSection id="about" ref={sectionRef}>
      <LandingZone
        style={{
          opacity: landingZoneOpacity,
          scale: useTransform(scrollYProgress, [0.1, 0.2, 0.3], [0.8, 1.2, 0.8])
        }}
      />
      <FloatingShape
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
        style={{
          top: '10%',
          left: '5%',
        }}
      />
      <Container>
        <TextContent>
          <Title
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Sambhrama K
          </Title>
          <Description
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            Software Engineer at Kulicke and Soffa, specializing in full-stack development with expertise in building scalable enterprise applications.
            I combine technical expertise with artistic vision to create unique and engaging websites.
          </Description>
          <Description
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            My approach focuses on the intersection of design and technology, 
            creating seamless interactions that surprise and delight users.
          </Description>
          <SkillsGrid
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
            {[
              { name: "React.js", emoji: "⚛️" },
              { name: "Node.js", emoji: "🟢" },
              { name: "ElasticSearch", emoji: "🔍" },
              { name: "Docker", emoji: "🐳" },
              { name: "Python", emoji: "🐍" },
              { name: "JavaScript ES6+", emoji: "🟡" },
              { name: "MongoDB", emoji: "🍃" },
              { name: "PostgreSQL", emoji: "🐘" },
              { name: "REST APIs", emoji: "🔌" },
              { name: "Agile", emoji: "🔄" },
              { name: "System Design", emoji: "🏗️" },
              { name: "CI/CD", emoji: "⚡" },
            ].map((skill, index) => (
              <Skill
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.8 + index * 0.1,
                  ease: "easeOut"
                }}
              >
                <span className="emoji" role="img" aria-label={skill.name}>{skill.emoji}</span>
                <span className="skill-name">{skill.name}</span>
              </Skill>
            ))}
          </SkillsGrid>
        </TextContent>
        <ImageContainer
          ref={imageRef}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            y: imageY,
            scale: imageScale,
          }}
        >
          <motion.img
            src="/about-image.jpg"
            alt="About"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            whileHover={{ 
              filter: "grayscale(0%)",
              transition: { duration: 0.3 }
            }}
          />
        </ImageContainer>
      </Container>
    </AboutSection>
  );
};

export default About; 