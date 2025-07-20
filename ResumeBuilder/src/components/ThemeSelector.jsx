import { motion } from 'framer-motion';

const ThemeSelector = ({ theme, setTheme, font, setFont }) => {
  const themes = [
    { name: 'blue', color: 'bg-blue-500', label: 'Blue' },
    { name: 'green', color: 'bg-green-500', label: 'Green' },
    { name: 'purple', color: 'bg-purple-500', label: 'Purple' },
    { name: 'red', color: 'bg-red-500', label: 'Red' },
    { name: 'amber', color: 'bg-amber-500', label: 'Amber' },
  ];
  
  const fonts = [
    { name: 'sans', label: 'Sans Serif' },
    { name: 'serif', label: 'Serif' },
    { name: 'mono', label: 'Monospace' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Customize Theme</h2>
      
      <div className="mb-8">
        <h3 className="font-medium text-gray-700 mb-3">Color Theme</h3>
        <div className="grid grid-cols-5 gap-3">
          {themes.map((t) => (
            <motion.button
              key={t.name}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`h-10 rounded-lg ${t.color} ${theme === t.name ? 'ring-2 ring-offset-2 ring-gray-800' : ''}`}
              onClick={() => setTheme(t.name)}
              title={t.label}
              aria-label={`${t.label} theme`}
            />
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Font Family</h3>
        <div className="grid grid-cols-3 gap-3">
          {fonts.map((f) => (
            <motion.button
              key={f.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-2 rounded-lg text-center ${
                font === f.name
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${f.name === 'sans' ? 'font-sans' : f.name === 'serif' ? 'font-serif' : 'font-mono'}`}
              onClick={() => setFont(f.name)}
            >
              {f.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;