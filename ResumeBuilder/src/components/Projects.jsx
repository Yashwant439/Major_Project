import { motion } from 'framer-motion';
import { FaPlus, FaTrash } from 'react-icons/fa';

const Projects = ({ data, updateData, addProject, removeProject, theme }) => {
  const handleChange = (id, e) => {
    const { name, value } = e.target;
    const updatedProjects = data.map(project => 
      project.id === id ? { ...project, [name]: value } : project
    );
    updateData(updatedProjects);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addProject}
          className={`flex items-center gap-2 px-4 py-2 bg-${theme}-500 text-white rounded-lg hover:bg-${theme}-600 transition`}
        >
          <FaPlus /> Add Project
        </motion.button>
      </div>
      
      <div className="space-y-6">
        {data.map((project, index) => (
          <motion.div 
            key={project.id}
            className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => removeProject(project.id)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
              <input
                type="text"
                name="name"
                value={project.name}
                onChange={(e) => handleChange(project.id, e)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="E-commerce Platform"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
              <input
                type="text"
                name="technologies"
                value={project.technologies}
                onChange={(e) => handleChange(project.id, e)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="React, Node.js, MongoDB"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={project.description}
                onChange={(e) => handleChange(project.id, e)}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Describe the project, your role, and achievements..."
                required
              ></textarea>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Projects;