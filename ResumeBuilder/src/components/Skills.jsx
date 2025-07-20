import { motion } from 'framer-motion';
import { FaPlus, FaTrash } from 'react-icons/fa';

const Skills = ({ data, updateData, addSkill, removeSkill }) => {
  const handleChange = (id, e) => {
    const { name, value } = e.target;
    const updatedSkills = data.map(skill => 
      skill.id === id ? { ...skill, [name]: value } : skill
    );
    updateData(updatedSkills);
  };

  const handleLevelChange = (id, level) => {
    const updatedSkills = data.map(skill => 
      skill.id === id ? { ...skill, level } : skill
    );
    updateData(updatedSkills);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Skills</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addSkill}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          <FaPlus /> Add Skill
        </motion.button>
      </div>
      
      <div className="space-y-4">
        {data.map((skill, index) => (
          <motion.div 
            key={skill.id}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => removeSkill(skill.id)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
              <input
                type="text"
                name="name"
                value={skill.name}
                onChange={(e) => handleChange(skill.id, e)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="JavaScript"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    onClick={() => handleLevelChange(skill.id, level)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                      skill.level >= level
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {skill.level === 1 && 'Beginner'}
                  {skill.level === 2 && 'Basic'}
                  {skill.level === 3 && 'Intermediate'}
                  {skill.level === 4 && 'Advanced'}
                  {skill.level === 5 && 'Expert'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Skills;