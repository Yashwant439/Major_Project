import { motion } from 'framer-motion';

const LayoutSelector = ({ layout, setLayout, theme }) => {
  const layouts = [
    { 
      name: 'modern', 
      label: 'Modern', 
      description: 'Clean design with sidebar for contact info and skills',
      color: theme === 'blue' ? 'bg-blue-100' : 
             theme === 'green' ? 'bg-green-100' : 
             theme === 'purple' ? 'bg-purple-100' : 
             theme === 'red' ? 'bg-red-100' : 'bg-amber-100'
    },
    { 
      name: 'classic', 
      label: 'Classic', 
      description: 'Traditional single-column layout',
      color: 'bg-gray-100'
    },
    { 
      name: 'creative', 
      label: 'Creative', 
      description: 'Modern layout with colorful sidebar',
      color: theme === 'blue' ? 'bg-blue-50' : 
             theme === 'green' ? 'bg-green-50' : 
             theme === 'purple' ? 'bg-purple-50' : 
             theme === 'red' ? 'bg-red-50' : 'bg-amber-50'
    },
    { 
      name: 'professional', 
      label: 'Professional', 
      description: 'Corporate design with clean typography',
      color: theme === 'blue' ? 'bg-blue-200' : 
             theme === 'green' ? 'bg-green-200' : 
             theme === 'purple' ? 'bg-purple-200' : 
             theme === 'red' ? 'bg-red-200' : 'bg-amber-200'
    },
    { 
      name: 'minimalist', 
      label: 'Minimalist', 
      description: 'Simple and clean with focus on content',
      color: 'bg-gray-50'
    },
    { 
      name: 'bold', 
      label: 'Bold', 
      description: 'Strong colors and modern typography',
      color: theme === 'blue' ? 'bg-blue-300' : 
             theme === 'green' ? 'bg-green-300' : 
             theme === 'purple' ? 'bg-purple-300' : 
             theme === 'red' ? 'bg-red-300' : 'bg-amber-300'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-6">Choose Layout</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {layouts.map((l) => (
          <motion.div
            key={l.name}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
              layout === l.name
                ? 'border-blue-500 ring-2 ring-blue-200 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
            onClick={() => setLayout(l.name)}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 ${l.color} border border-gray-200 rounded flex items-center justify-center`}>
                <div className="w-6 h-6 border-2 border-dashed border-gray-400 rounded"></div>
              </div>
              <h3 className="font-bold text-gray-800">{l.label}</h3>
            </div>
            <p className="text-sm text-gray-600">{l.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LayoutSelector;
