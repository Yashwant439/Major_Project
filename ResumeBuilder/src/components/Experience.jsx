import { motion } from 'framer-motion';
import { FaPlus, FaTrash } from 'react-icons/fa';

const Experience = ({ data, updateData, addExperience, removeExperience }) => {
  const handleChange = (id, e) => {
    const { name, value } = e.target;
    const updatedExperience = data.map(exp => 
      exp.id === id ? { ...exp, [name]: value } : exp
    );
    updateData(updatedExperience);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Work Experience</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addExperience}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          <FaPlus /> Add Experience
        </motion.button>
      </div>
      
      <div className="space-y-8">
        {data.map((exp, index) => (
          <motion.div 
            key={exp.id}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => removeExperience(exp.id)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input
                  type="text"
                  name="position"
                  value={exp.position}
                  onChange={(e) => handleChange(exp.id, e)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Senior Developer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  name="company"
                  value={exp.company}
                  onChange={(e) => handleChange(exp.id, e)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Facebook"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                name="duration"
                value={exp.duration}
                onChange={(e) => handleChange(exp.id, e)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Jan 2025 - Present"
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={exp.description}
                onChange={(e) => handleChange(exp.id, e)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Describe your responsibilities and achievements..."
              ></textarea>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Experience;