import { motion } from 'framer-motion';

const PersonalInfo = ({ data, updateData, theme }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ ...data, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateData({ ...data, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Personal Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
            {data.profileImage ? (
              <img 
                src={data.profileImage} 
                alt="Profile" 
                className="w-40 h-40 mx-auto rounded-full object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-40 h-40 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-gray-500 text-lg">No Image</span>
              </div>
            )}
            <input
              type="file"
              id="profileImage"
              className="hidden"
              onChange={handleImageChange}
              accept="image/*"
            />
            <label 
              htmlFor="profileImage" 
              className={`inline-block px-4 py-2 rounded-lg cursor-pointer bg-${theme}-500 text-white hover:bg-${theme}-600 transition`}
            >
              Upload Photo
            </label>
            <p className="text-xs text-gray-500 mt-2">JPG, PNG (Max 2MB)</p>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Yashwant Kumar Singh"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title *</label>
              <input
                type="text"
                name="title"
                value={data.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="MERN Developer"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="abcd@gmail.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={data.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="9911215154"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={data.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Lajpat Nagar , Delhi"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input
                type="text"
                name="linkedin"
                value={data.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="linkedin.com/in/yashwant"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
              <input
                type="text"
                name="github"
                value={data.github}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="github.com/Yashwwant439"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
              <input
                type="text"
                name="website"
                value={data.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="portfolio-6sct.onrender.com"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary *</label>
            <textarea
              name="summary"
              value={data.summary}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Passionate web developer with Hands-on experience..."
              required
            ></textarea>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalInfo;