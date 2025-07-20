import { motion } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Preview = ({ resumeData, theme, font, layout, fullPreview = false }) => {
  const { personal, experience, education, skills, projects } = resumeData;
  
  const themeColors = {
    blue: { 
      white:'bg-yellow-100',
      primary: 'bg-blue-600', 
      secondary: 'bg-blue-100', 
      text: 'text-blue-700',
      border: 'border-blue-300',
      light: 'bg-blue-50'
    },
    green: { 
      white:'bg-yellow-100',
      primary: 'bg-green-600', 
      secondary: 'bg-green-100', 
      text: 'text-green-700',
      border: 'border-green-300',
      light: 'bg-green-50'
    },
    purple: { 
      white:'bg-yellow-100',
      primary: 'bg-purple-600', 
      secondary: 'bg-purple-100', 
      text: 'text-purple-700',
      border: 'border-purple-300',
      light: 'bg-purple-50'
    },
    red: { 
      white:'bg-yellow-100',
      primary: 'bg-red-600', 
      secondary: 'bg-red-100', 
      text: 'text-red-700',
      border: 'border-red-300',
      light: 'bg-red-50'
    },
    amber: { 
      white:'bg-yellow-100',
      primary: 'bg-amber-600', 
      secondary: 'bg-amber-100', 
      text: 'text-amber-700',
      border: 'border-amber-300',
      light: 'bg-amber-50'
    },
  };
  
  const color = themeColors[theme] || themeColors.blue;
  
  const layoutClasses = {
    modern: 'flex flex-col md:flex-row',
    classic: 'flex flex-col',
    creative: 'flex flex-col',
    professional: 'flex flex-col md:flex-row',
    minimalist: 'flex flex-col',
    bold: 'flex flex-col md:flex-row'
  };
  
  const layoutStyles = {
    modern: {
      sidebar: `w-full md:w-1/3 ${color.primary} text-white p-8 print:p-4`,
      main: 'w-full md:w-2/3 p-8 print:p-4'
    },
    classic: {
      sidebar: `w-full p-8 print:p-4 border-b-4 ${color.primary}`,
      main: 'w-full p-8 print:p-4'
    },
    creative: {
      sidebar: `w-full ${color.secondary} p-8 print:p-4`,
      main: 'w-full p-8 print:p-4'
    },
    professional: {
      sidebar: `w-full md:w-1/3 bg-gray-50 p-8 print:p-4 border-r border-gray-200`,
      main: 'w-full md:w-2/3 p-8 print:p-4'
    },
    minimalist: {
      sidebar: 'w-full p-8 print:p-4 border-b border-gray-200',
      main: 'w-full p-8 print:p-4'
    },
    bold: {
      sidebar: `w-full md:w-1/3 ${color.primary} text-white p-8 print:p-4`,
      main: `w-full md:w-2/3 p-8 print:p-4 ${color.light}`
    }
  };
  
  const currentLayout = layoutStyles[layout] || layoutStyles.modern;
  
  // Fonts
  const fontClasses = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono'
  };
  
  const currentFont = fontClasses[font] || 'font-sans';
  
  return (
    <motion.div 
      id="resume-preview"
      className={`bg-white shadow-lg rounded-lg overflow-hidden min-h-[400px] ${layoutClasses[layout] || 'flex flex-col'} ${fullPreview ? 'min-h-[297mm] w-[210mm]' : ''} ${currentFont}`}
      style={fullPreview ? { width: '210mm' } : {}}
      whileHover={{ scale: fullPreview ? 1 : 1.005 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Sidebar */}
      <div className={`${currentLayout.sidebar} ${layout === 'creative' ? 'border-r-4 border-gray-200' : ''}`}>
        {personal.name && (
          <motion.div 
            className="mb-6 print:mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex flex-col items-center mb-4 print:mb-2">
              {personal.profileImage ? (
                <motion.img 
                  src={personal.profileImage} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg print:w-24 print:h-24"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                />
              ) : (
                <motion.div 
                  className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center shadow-lg print:w-24 print:h-24"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-gray-500">No Image</span>
                </motion.div>
              )}
              <motion.h1 
                className={`text-2xl font-bold mt-4 text-center print:text-xl ${layout === 'bold' ? 'text-white' : ''}`}
                initial={{ y: -10 }}
                animate={{ y: 0 }}
              >
                {personal.name}
              </motion.h1>
              {personal.title && (
                <motion.h2 
                  className={`text-lg mt-2 text-center print:text-base ${layout === 'modern' || layout === 'bold' ? 'text-blue-200 print:text-gray-700' : 'text-gray-700'}`}
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {personal.title}
                </motion.h2>
              )}
            </div>
          </motion.div>
        )}
        
        <div className="space-y-4 print:space-y-2">
          {(personal.email || personal.phone || personal.location) && (
            <motion.div 
              className="space-y-2 print:space-y-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className={`text-lg font-bold mb-2 print:text-base print:mb-1 ${layout === 'modern' || layout === 'bold' ? 'text-white print:text-black' : 'text-gray-800'}`}>Contact</h3>
              {personal.email && (
                <p className="flex items-start gap-2 print:text-sm">
                  <EmailIcon fontSize="small" className="print:h-3 print:w-3" /> {personal.email}
                </p>
              )}
              {personal.phone && (
                <p className="flex items-start gap-2 print:text-sm">
                  <PhoneIcon fontSize="small" className="print:h-3 print:w-3" /> {personal.phone}
                </p>
              )}
              {personal.location && (
                <p className="flex items-start gap-2 print:text-sm">
                  <LocationPinIcon fontSize="small" className="print:h-3 print:w-3" /> {personal.location}
                </p>
              )}
              {personal.linkedin && (
                <p className="flex items-start gap-2 print:text-sm">
                  <LinkedInIcon fontSize="small" className="print:h-3 print:w-3" /> {personal.linkedin}
                </p>
              )}
              {personal.github && (
                <p className="flex items-start gap-2 print:text-sm">
                  <GitHubIcon fontSize="small" className="print:h-3 print:w-3" /> {personal.github}
                </p>
              )}
              {personal.website && (
                <p className="flex items-start gap-2 print:text-sm">
                  <TravelExploreIcon fontSize="small" className="print:h-3 print:w-3" /> {personal.website}
                </p>
              )}
            </motion.div>
          )}
          
          {skills.length > 0 && skills[0].name && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className={`text-lg font-bold mb-3 print:text-base print:mb-2 ${layout === 'modern' || layout === 'bold' ? 'text-white print:text-black' : 'text-gray-800'}`}>Skills</h3>
              <div className="space-y-2 print:space-y-1">
                {skills.filter(skill => skill.name).map((skill, index) => (
                  <div key={index} className="mb-2 print:mb-1">
                    <div className="flex justify-between mb-1 print:mb-0.5">
                      <span className="print:text-sm">{skill.name}</span>
                      <span className="print:text-sm">{skill.level}/5</span>
                    </div>
                    <div className="w-full bg-gray-500 h-2 rounded-full print:h-1">
                      <div 
                        className={`h-full rounded-full ${layout === 'professional' ? 'bg-gray-600' : color.white}`} 
                        style={{ width: `${(skill.level / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Body */}
      <div className={currentLayout.main}>
        {personal.summary && (
          <motion.div 
            className="mb-6 print:mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-bold mb-3 print:text-lg print:mb-2 text-gray-800 print:text-black">Summary</h3>
            <p className="text-gray-700 leading-relaxed print:text-sm print:leading-snug">{personal.summary}</p>
          </motion.div>
        )}
        
        {experience.length > 0 && experience[0].position && (
          <motion.div 
            className="mb-8 print:mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className={`text-xl font-bold mb-4 pb-2 border-b print:text-lg print:mb-3 print:pb-1 ${layout === 'minimalist' ? 'border-gray-300' : `${color.text} ${color.border}`}`}>Work Experience</h3>
            <div className="space-y-6 print:space-y-4">
              {experience.filter(exp => exp.position).map((exp, index) => (
                <div key={index} className="mb-4 relative pl-6 border-l-2 border-gray-200 print:pl-4 print:mb-3">
                  <div className="absolute left-[-7px] top-2 w-3 h-3 rounded-full bg-blue-500 print:left-[-5px] print:w-2 print:h-2"></div>
                  <div className="flex justify-between flex-wrap">
                    <h4 className="font-bold text-lg text-gray-800 print:text-base print:font-semibold">{exp.position}</h4>
                    <span className={`${color.text} font-medium print:text-sm`}>{exp.duration}</span>
                  </div>
                  <p className="text-gray-600 mb-2 font-medium print:text-sm print:mb-1">{exp.company}</p>
                  <p className="text-gray-700 print:text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {education.length > 0 && education[0].degree && (
          <motion.div 
            className="mb-8 print:mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className={`text-xl font-bold mb-4 pb-2 border-b print:text-lg print:mb-3 print:pb-1 ${layout === 'minimalist' ? 'border-gray-300' : `${color.text} ${color.border}`}`}>Education</h3>
            <div className="space-y-4 print:space-y-3">
              {education.filter(edu => edu.degree).map((edu, index) => (
                <div key={index} className="mb-2 relative pl-6 border-l-2 border-gray-200 print:pl-4 print:mb-1">
                  <div className="absolute left-[-7px] top-2 w-3 h-3 rounded-full bg-blue-500 print:left-[-5px] print:w-2 print:h-2"></div>
                  <div className="flex justify-between flex-wrap">
                    <h4 className="font-bold text-gray-800 print:text-sm">{edu.degree}</h4>
                    <span className={`${color.text} font-medium print:text-xs`}>{edu.year}</span>
                  </div>
                  <p className="text-gray-600 print:text-xs">{edu.institution}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {projects.length > 0 && projects[0].name && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className={`text-xl font-bold mb-4 pb-2 border-b print:text-lg print:mb-3 print:pb-1 ${layout === 'minimalist' ? 'border-gray-300' : `${color.text} ${color.border}`}`}>Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-3">
              {projects.filter(project => project.name).map((project, index) => (
                <motion.div 
                  key={index} 
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow print:p-3 print:shadow-none print:hover:shadow-none"
                  whileHover={{ y: fullPreview ? 0 : -5 }}
                >
                  <h4 className="font-bold text-gray-800 print:text-sm">{project.name}</h4>
                  <p className="text-sm text-gray-600 mb-2 print:text-xs print:mb-1">{project.technologies}</p>
                  <p className="text-gray-700 text-sm print:text-xs">{project.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Preview;