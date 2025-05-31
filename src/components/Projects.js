import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const CursorText = styled(motion.div)`
  position: fixed;
  pointer-events: none;
  z-index: 1000;
  mix-blend-mode: difference;
  font-family: 'Permanent Marker', cursive;
  font-size: 2rem;
  color: white;
  transform: translate(-50%, -50%) rotate(-5deg);
  text-shadow: 2px 2px 0px #ff00ff, -2px -2px 0px #00ffff;
`;

const ProjectsSection = styled.section`
  min-height: 100vh;
  padding: 8rem 5vw;
  background-color: rgb(17, 1, 1);
  position: relative;
  z-index: 2;
  overflow: hidden;

  @font-face {
    font-family: 'Permanent Marker';
    src: url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Title = styled(motion.h2)`
  font-size: clamp(3rem, 8vw, 5rem);
  margin-bottom: 4rem;
  text-align: center;
  background: linear-gradient(45deg, #ffffff, rgba(255, 255, 255, 0.7));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  position: relative;
  min-height: 400px;

  &.active {
    display: flex;
    gap: 2rem;
    flex-wrap: nowrap;
    
    .inactive-projects {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 22%;
      order: ${props => {
        const idx = props.activeIndex;
        return idx === 0 ? 1 : idx === 1 ? 1 : -1;
      }};
    }

    .active-project {
      width: 78%;
      order: ${props => {
        const idx = props.activeIndex;
        return idx === 0 ? 0 : idx === 1 ? 0 : 1;
      }};
    }
  }

  @media (max-width: 1024px) {
    &.active {
      flex-direction: column;
      
      .inactive-projects {
        width: 100%;
        order: 1;
        flex-direction: row;
        overflow-x: auto;
        padding: 1rem 0;
      }

      .active-project {
        width: 100%;
        order: 0;
      }
    }
  }
`;

const ProjectCard = styled(motion.div)`
  position: relative;
  background: ${props => props.isActive ? '#1a1a1a' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  height: ${props => props.isActive ? '600px' : props.isInactive ? '180px' : '400px'};
  width: ${props => props.isInactive ? '100%' : 'auto'};
  transition: background 0.3s ease;
  display: flex;
  flex-direction: column;

  @media (max-width: 1024px) {
    height: ${props => props.isActive ? '500px' : props.isInactive ? '150px' : '300px'};
    width: ${props => props.isInactive ? '250px' : '100%'};
    flex-shrink: 0;
  }
`;

const ProjectImage = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => `url(${props.image}) center center/cover no-repeat`};
  filter: brightness(0.8);
  transition: filter 0.3s ease;

  &:hover {
    filter: brightness(1);
  }
`;

const ProjectCover = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(58, 8, 8, 0.4),
    rgba(0, 0, 0, 0.8)
  );
  opacity: ${props => props.isActive ? 1 : 0.7};
  transition: opacity 0.3s ease;
`;

const ProjectContent = styled(motion.div)`
  position: relative;
  z-index: 2;
  padding: ${props => props.isActive ? '3rem' : '2rem'};
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.isActive ? 'flex-end' : 'center'};
  gap: ${props => props.isActive ? '1.5rem' : '1rem'};
  max-width: ${props => props.isActive ? '800px' : '100%'};
  align-items: flex-start;
  text-align: left;

  > * {
    width: 100%;
  }
`;

const ProjectHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 2rem;
  z-index: 2;
`;

const ProjectNumber = styled.span`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
`;

const ProjectTitle = styled.h3`
  font-size: ${props => props.isActive ? '2.5rem' : '2rem'};
  font-weight: 600;
  color: white;
  line-height: 1.2;
  margin: 0;
  text-align: ${props => props.isActive ? 'left' : 'center'};
  transition: all 0.3s ease;
`;

const ProjectDescription = styled(motion.p)`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  line-height: 1.6;
  margin: 0;
  text-align: left;
  width: 100%;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const ProjectTags = styled(motion.div)`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin: 0;
  align-items: flex-start;
  justify-content: flex-start;
  padding-top: 1rem;
  width: 100%;
`;

const Tag = styled(motion.span)`
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
  backdrop-filter: blur(4px);
`;

const ViewButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #0f0f0f;
  border-radius: 2rem;
  font-weight: 500;
  text-decoration: none;
  margin-top: 2rem;
  margin-left: 0;
  position: relative;
  left: 0;
  
  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

const getStackOrder = (projectId, activeId, projects) => {
  if (activeId === null) return 0;
  const activeIndex = projects.findIndex(p => p.id === activeId);
  const currentIndex = projects.findIndex(p => p.id === projectId);
  
  // Custom stacking order based on active project
  const orderMap = {
    0: [1, 2, 3],
    1: [2, 3, 0],
    2: [3, 0, 1],
    3: [0, 1, 2]
  };
  
  if (projectId === activeId) return 0;
  const position = orderMap[activeIndex].indexOf(currentIndex);
  return position + 1;
};

const Projects = () => {
  const [activeProject, setActiveProject] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredProject, setHoveredProject] = useState(null);

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const projects = [
    {
      id: 1,
      number: "01",
      title: "Dynamic Gesture Recognition",
      description: "Real-time vision-based sign language-to-text and speech system achieving 99.8% accuracy. Awarded Best Project Presentation in Computer Science Department (out of 71 teams) and presented at the State Level Project Exhibition by KSCST.",
      coverImage: "/images/projects/project1.png",
      image: "/images/projects/project1.png",
      tags: ["Python", "PyTorch", "YOLO v5", "R-CNN", "Deep Learning"],
      link: "https://github.com/vinubhat10/Dynamic_Gesture" 
    },
    {
      id: 2,
      number: "02",
      title: "Decrypt - Cryptocurrency Tracker",
      description: "A personalized cryptocurrency collection web app for real-time tracking of favorite coins in INR. Features real-time price updates using WebSocket connections and customizable portfolio management.",
      coverImage: "/images/projects/project2.png",
      image: "/images/projects/project2.png",
      tags: ["JavaScript", "Express.js", "MongoDB", "WebSocket", "Binance API"],
      link: "https://github.com/sambhrama24/decrypt"
    },
    {
      id: 3,
      number: "03",
      title: "Enterprise Licensing System",
      description: "Leading the development of a reusable licensing module with RSA/AES encryption and hardware fingerprinting. Designed to support offline validation and scale across multiple products organization-wide.",
      coverImage: "/images/projects/project3.png",
      image: "/images/projects/project3.png",
      tags: ["Node.js", "React.js", "Encryption", "Enterprise Architecture"],
      link: "#"
    },
    {
      id: 4,
      number: "04",
      title: "Real-time Data Analytics Dashboard",
      description: "Enhanced UI features for a real-time big-data application using React.js and ElasticSearch, achieving data retrieval across a 2-year span within minutes. Implemented configuration export feature reducing fleet-wide deployment time by 90%.",
      coverImage: "/images/projects/project4.png",
      image: "/images/projects/project4.png",
      tags: ["React.js", "ElasticSearch", "Docker", "Performance Optimization"],
      link: "#"
    }
  ];

  return (
    <ProjectsSection id="projects">
      <Container>
        <Title
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          Featured Work
        </Title>
        <ProjectsGrid
          className={activeProject ? 'active' : ''}
          activeIndex={projects.findIndex(p => p.id === activeProject)}
        >
          <AnimatePresence>
            {hoveredProject && !activeProject && (
              <CursorText
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: mousePosition.x,
                  y: mousePosition.y,
                  rotate: [0, -5, 5, -5, 0]
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  rotate: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
              >
                click me!
              </CursorText>
            )}
          </AnimatePresence>
          {activeProject ? (
            <>
              <motion.div className="active-project" layout>
                {projects.map((project) => 
                  project.id === activeProject && (
                    <ProjectCard
                      key={project.id}
                      isActive={true}
                      onClick={() => setActiveProject(null)}
                      onMouseEnter={() => setHoveredProject(project.id)}
                      onMouseLeave={() => setHoveredProject(null)}
                      layout="position"
                      initial={false}
                      animate={{ 
                        scale: 1,
                        transition: { 
                          type: "spring",
                          stiffness: 300,
                          damping: 30
                        }
                      }}
                    >
                      <ProjectImage image={project.image} layout />
                      <ProjectCover isActive={true} />
                      <ProjectContent isActive={true}>
                        <ProjectTitle isActive={true}>{project.title}</ProjectTitle>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.4 }}
                        >
                          <ProjectDescription>
                            {project.description}
                          </ProjectDescription>
                          <ProjectTags>
                            {project.tags.map((tag, index) => (
                              <Tag
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                              >
                                {tag}
                              </Tag>
                            ))}
                          </ProjectTags>
                          {project.link !== "#" && (
                            <ViewButton
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              View Project on Github
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </ViewButton>
                          )}
                        </motion.div>
                      </ProjectContent>
                    </ProjectCard>
                  )
                )}
              </motion.div>
              <motion.div className="inactive-projects" layout>
                {projects
                  .filter(project => project.id !== activeProject)
                  .sort((a, b) => getStackOrder(a.id, activeProject, projects) - getStackOrder(b.id, activeProject, projects))
                  .map((project) => (
                    <ProjectCard
                      key={project.id}
                      isInactive={true}
                      onClick={() => setActiveProject(project.id)}
                      onMouseEnter={() => setHoveredProject(project.id)}
                      onMouseLeave={() => setHoveredProject(null)}
                      layout="position"
                      initial={false}
                      animate={{ 
                        scale: 1,
                        transition: { 
                          type: "spring",
                          stiffness: 300,
                          damping: 30
                        }
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <ProjectImage image={project.coverImage || project.image} layout />
                      <ProjectCover />
                      <ProjectContent>
                        <ProjectTitle>{project.title}</ProjectTitle>
                      </ProjectContent>
                    </ProjectCard>
                  ))}
              </motion.div>
            </>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                onClick={() => setActiveProject(project.id)}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                layout="position"
                initial={false}
                animate={{ 
                  scale: 1,
                  transition: { 
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }
                }}
                whileHover={{ scale: 1.02 }}
              >
                <ProjectImage image={project.coverImage || project.image} layout />
                <ProjectCover />
                <ProjectContent>
                  <ProjectTitle>{project.title}</ProjectTitle>
                </ProjectContent>
              </ProjectCard>
            ))
          )}
        </ProjectsGrid>
      </Container>
    </ProjectsSection>
  );
};

export default Projects; 