import { motion } from 'framer-motion';
import { FaPlus, FaTrash } from 'react-icons/fa';

const Education = ({ data, updateData, addEducation, removeEducation }) => {
  const handleChange = (id, e) => {
    const { name, value } = e.target;
    const updatedEducation = data.map(edu => 
      edu.id === id ? { ...edu, [name]: value } : edu
    );
    updateData(updatedEducation);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Education</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addEducation}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          <FaPlus /> Add Education
        </motion.button>
      </div>
      
      <div className="space-y-6">
        {data.map((edu, index) => (
          <motion.div 
            key={edu.id}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => removeEducation(edu.id)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                <input
                  type="text"
                  name="degree"
                  value={edu.degree}
                  onChange={(e) => handleChange(edu.id, e)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Bachelor of Technology(B.Tech)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                <input
                  type="text"
                  name="institution"
                  value={edu.institution}
                  onChange={(e) => handleChange(edu.id, e)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="IIT BHU"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="text"
                name="year"
                value={edu.year}
                onChange={(e) => handleChange(edu.id, e)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="2025 - 2029"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Education;