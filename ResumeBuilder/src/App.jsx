import { useState} from 'react';
import { motion } from 'framer-motion';
import PersonalInfo from './components/PersonalInfo';
import Experience from './components/Experience';
import Education from './components/Education';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Preview from './components/Preview';
import ThemeSelector from './components/ThemeSelector';
import LayoutSelector from './components/LayoutSelector';
import { FaFileAlt, FaPalette, FaMagic } from 'react-icons/fa';
import YashwantImg from './assets/Yashwant.jpg'
import './App.css'
function App() {
  const [activeTab, setActiveTab] = useState('personal');
  const [resumeData, setResumeData] = useState({
    personal: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      profileImage: null,
      linkedin: '',
      github: '',
      website: ''
    },
    experience: [
      {
        id: Date.now(),
        position: '',
        company: '',
        duration: '',
        description: '',
      },
    ],
    education: [
      {
        id: Date.now(),
        degree: '',
        institution: '',
        year: '',
      },
    ],
    skills: [{ id: Date.now(), name: '', level: 3 }],
    projects: [
      {
        id: Date.now(),
        name: '',
        technologies: '',
        description: '',
      }
    ]
  });
  
  const [theme, setTheme] = useState('blue');
  const [font, setFont] = useState('sans');
  const [layout, setLayout] = useState('modern');
  const [activeSection, setActiveSection] = useState('form');
  const [autoFillEnabled, setAutoFillEnabled] = useState(false);
  
  const fonts = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
  };

  const updatePersonalData = (data) => {
    setResumeData({ ...resumeData, personal: data });
  };

  const updateExperienceData = (data) => {
    setResumeData({ ...resumeData, experience: data });
  };

  const updateEducationData = (data) => {
    setResumeData({ ...resumeData, education: data });
  };

  const updateSkillsData = (data) => {
    setResumeData({ ...resumeData, skills: data });
  };

  const updateProjectsData = (data) => {
    setResumeData({ ...resumeData, projects: data });
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          id: Date.now(),
          position: '',
          company: '',
          duration: '',
          description: '',
        },
      ],
    });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          id: Date.now(),
          degree: '',
          institution: '',
          year: '',
        },
      ],
    });
  };

  const addSkill = () => {
    setResumeData({
      ...resumeData,
      skills: [
        ...resumeData.skills,
        { id: Date.now(), name: '', level: 3 },
      ],
    });
  };

  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        { id: Date.now(), name: '', technologies: '', description: '' }
      ],
    });
  };

  const removeExperience = (id) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter(exp => exp.id !== id),
    });
  };

  const removeEducation = (id) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id),
    });
  };

  const removeSkill = (id) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter(skill => skill.id !== id),
    });
  };

  const removeProject = (id) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.filter(project => project.id !== id),
    });
  };

  const autoFillSampleData = () => {
    setAutoFillEnabled(true);
    setResumeData({
      personal: {
        name: 'Yashwant Kumar Singh',
        title: 'MERN Developer',
        email: 'yashwantkumarsingh439@gmail.com',
        phone: '9911215154',
        location: 'GovindPuri, Delhi',
        summary: 'Passionate about building scalable real-time applications and secure backend systems using modern technologies. Skilled in Full-Stack Development with hands-on project experience.',
        profileImage: YashwantImg,
        linkedin: 'linkedin.com/in/yashwantkumarsingh',
        github: 'github.com/Yashwant439',
        website: 'portfolio-6sct.onrender.com'
      },
      experience: [
        {
          id: Date.now(),
          position: 'Intern – Result ERP Portal',
          company: 'GB Pant Okhla Campus',
          duration: 'JUL 2025 - Present',
          description: 'Working on the Result ERP Portal, handling data cleaning, validation, and optimization to ensure accurate and efficient result management.',
        },
        
      ],
      education: [
        {
          id: Date.now() + 1,
          degree: 'B.Tech Computer Engineering',
          institution: 'DSEU',
          year: '2024 - 2028',
        },
        {
          id: Date.now(),
          degree: 'Higher Seconday',
          institution: 'Saltlake Shiksha Niketan',
          year: '2021 - 2023',
        },
      ],
      skills: [
        { id: Date.now(), name: 'JavaScript', level: 3 },
        { id: Date.now() + 1, name: 'React.js', level: 3 },
        { id: Date.now() + 2, name: 'Node.js', level: 4 },
        { id: Date.now() + 3, name: 'UI/UX Design', level: 4 },
      ],
      projects: [
        {
          id: Date.now(),
          name: 'Wanderlust – Travel Experience Platform',
          technologies: 'React, Node.js, Express, MongoDB',
          description: 'A dynamic, feature-rich travel booking web application enabling users to explore destinations, create listings, and book experiences.',
        },
        {
          id: Date.now() + 1,
          name: 'Personal Portfolio',
          technologies: 'HTML, CSS, JS',
          description: 'A sleek, responsive personal portfolio website to showcase my projects, skills, and achievements.',
        }
      ]
    });
  };

  return (
    <div className={`min-h-screen ${fonts[font]} bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800`}>
      {/* NavBar */}
      <motion.header 
        className="bg-white shadow-lg py-6"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <FaFileAlt className="text-3xl text-blue-600 mr-3" />
            <motion.h1 
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
              whileHover={{ scale: 1.05 }}
            >
              CVWizaard
            </motion.h1>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
            <button
              onClick={() => setActiveSection('form')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeSection === 'form'
                  ? `bg-${theme}-500 text-white`
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaFileAlt className="mr-2" /> Edit Resume
            </button>
            <button
              onClick={() => setActiveSection('design')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeSection === 'design'
                  ? `bg-${theme}-500 text-white`
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaPalette className="mr-2" /> Design
            </button>
          </div>
        </div>
      </motion.header>

      {/* Body */}
      <main className="container mx-auto px-4 py-8">
        {activeSection === 'form' ? (
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Left-Side */}
            <motion.div 
              className="bg-white rounded-xl shadow-xl p-6"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Build Your Resume</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={autoFillSampleData}
                  disabled={autoFillEnabled}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
                    autoFillEnabled ? 'bg-gray-400' : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
                  }`}
                >
                  <FaMagic /> Auto-Fill Sample
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {['personal', 'experience', 'education', 'skills', 'projects'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 rounded-lg capitalize transition-all ${
                      activeTab === tab
                        ? `bg-${theme}-500 text-white`
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'personal' && 'Personal Info'}
                    {tab === 'experience' && 'Experience'}
                    {tab === 'education' && 'Education'}
                    {tab === 'skills' && 'Skills'}
                    {tab === 'projects' && 'Projects'}
                  </button>
                ))}
              </div>

              <div className="h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {activeTab === 'personal' && (
                  <PersonalInfo 
                    data={resumeData.personal} 
                    updateData={updatePersonalData} 
                    theme={theme}
                  />
                )}
                
                {activeTab === 'experience' && (
                  <Experience 
                    data={resumeData.experience} 
                    updateData={updateExperienceData} 
                    addExperience={addExperience}
                    removeExperience={removeExperience}
                    theme={theme}
                  />
                )}
                
                {activeTab === 'education' && (
                  <Education 
                    data={resumeData.education} 
                    updateData={updateEducationData} 
                    addEducation={addEducation}
                    removeEducation={removeEducation}
                    theme={theme}
                  />
                )}
                
                {activeTab === 'skills' && (
                  <Skills 
                    data={resumeData.skills} 
                    updateData={updateSkillsData} 
                    addSkill={addSkill}
                    removeSkill={removeSkill}
                    theme={theme}
                  />
                )}
                
                {activeTab === 'projects' && (
                  <Projects 
                    data={resumeData.projects} 
                    updateData={updateProjectsData} 
                    addProject={addProject}
                    removeProject={removeProject}
                    theme={theme}
                  />
                )}
              </div>
            </motion.div>

            {/* Right-Side */}
            <motion.div 
              className="bg-white rounded-xl shadow-xl p-6 sticky top-8"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Live Preview</h2>
              </div>
              
              <div className="overflow-y-auto h-[500px] border-2 border-dashed border-gray-300 rounded-lg p-4 custom-scrollbar">
                <Preview 
                  resumeData={resumeData} 
                  theme={theme}
                  font={font}
                  layout={layout}
                />
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            className="bg-white rounded-xl shadow-xl p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FaPalette className="mr-3 text-blue-500" /> Design Your Resume
              </h2>
              <div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="overflow-y-auto h-[600px] border-2 border-dashed border-gray-300 rounded-lg p-4 custom-scrollbar">
                  <Preview 
                    resumeData={resumeData} 
                    theme={theme}
                    font={font}
                    layout={layout}
                    fullPreview={true}
                  />
                </div>
              </div>
              
              <div>
                <ThemeSelector 
                  theme={theme} 
                  setTheme={setTheme} 
                  font={font}
                  setFont={setFont}
                />
                
                <div className="mt-8">
                  <LayoutSelector layout={layout} setLayout={setLayout} theme={theme} />
                </div>
                
                <div className="mt-8 bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Design Tips</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">1</span>
                      Choose a layout that highlights your strengths
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">2</span>
                      Use colors that match your industry
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">3</span>
                      Professional fonts improve readability
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">4</span>
                      Keep your design clean and uncluttered
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>CVWizaard © {new Date().getFullYear()} - Create professional resumes in minutes 😉</p>
          <p className="mt-2 text-gray-400">All your data stays in your browser - nothing is saved on our servers ✌️</p>
          <p className="mt-2 text-gray-400">Made by Yashwant with ❤️</p>
        </div>
      </footer>
    </div>
  );
}

export default App;