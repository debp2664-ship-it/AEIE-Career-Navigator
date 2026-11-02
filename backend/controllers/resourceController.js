const LearningResource = require('../models/LearningResource');
const UserProgress = require('../models/UserProgress');
const { isDbReady } = require('../config/db');

// Default initial resources in case database is empty or offline
const defaultResources = [
  {
    title: 'NPTEL (SWAYAM) - Control & Transducers',
    url: 'https://nptel.ac.in/',
    provider: 'NPTEL',
    category: 'Simulation & Math',
    semester: 0,
    skill: 'Sensors, Signals & Control Systems',
    badge: 'IIT / IISc Video Lectures',
    description: 'In-depth university-level video courses from premier IIT professors on Control Engineering, Transducers, Signals, and Process Automation.',
    isFree: true,
  },
  {
    title: 'Harvard CS50x - Computer Science',
    url: 'https://cs50.harvard.edu/x/',
    provider: 'Harvard CS50',
    category: 'Computer Science',
    semester: 1,
    skill: 'C Programming, Memory & Algorithms',
    badge: 'Self-Paced Ivy League Course',
    description: 'Gold standard foundational computer science course teaching rigorous computational thinking, C memory architecture, pointers, and algorithms.',
    isFree: true,
  },
  {
    title: 'freeCodeCamp - Python & Algorithms',
    url: 'https://www.freecodecamp.org/learn/',
    provider: 'freeCodeCamp',
    category: 'Web & Coding',
    semester: 2,
    skill: 'Python, Web Tech & Data Structures',
    badge: '100% Free Certifications',
    description: 'Interactive, project-driven learning tracks covering Python for Everybody, Scientific Computing with Python, and Responsive Web UI.',
    isFree: true,
  },
  {
    title: 'Wokwi Simulator - Embedded Systems',
    url: 'https://wokwi.com/',
    provider: 'Wokwi',
    category: 'Hardware Simulator',
    semester: 3,
    skill: 'Arduino, ESP32 & Circuit Prototyping',
    badge: 'In-Browser Circuit Simulator',
    description: 'Simulate Arduino Uno/Mega, ESP32, and Raspberry Pi Pico right in the browser with virtual LCDs, sensors, servos, and LEDs—no physical hardware required.',
    isFree: true,
  },
  {
    title: 'Kaggle Learn - Python, NumPy & Pandas',
    url: 'https://www.kaggle.com/learn',
    provider: 'Kaggle Learn',
    category: 'Python & Data Science',
    semester: 4,
    skill: 'Data Manipulation & Analysis',
    badge: 'Hands-On Jupyter Micro-Courses',
    description: 'Bite-sized micro-courses to master practical Python dataframes, vectorized computations in NumPy, data cleaning, and statistical plotting.',
    isFree: true,
  },
  {
    title: 'GitHub Skills - Git & DevOps Workflows',
    url: 'https://skills.github.com/',
    provider: 'GitHub Skills',
    category: 'DevOps & Version Control',
    semester: 1,
    skill: 'Git, Pull Requests & CI/CD',
    badge: 'Interactive Repositories',
    description: 'Interactive GitHub bot-driven tutorials teaching commit best practices, branch management, merge conflict resolution, and GitHub Pages.',
    isFree: true,
  },
  {
    title: 'Python Official Language Tutorial',
    url: 'https://docs.python.org/3/tutorial/',
    provider: 'Python Docs',
    category: 'Official Documentation',
    semester: 2,
    skill: 'Python Standard Library & OOP',
    badge: 'Authoritative Reference',
    description: 'The official, authoritative Python guide covering syntax, modules, file I/O, error handling, standard libraries, and object-oriented design.',
    isFree: true,
  },
  {
    title: 'Arduino Official Documentation',
    url: 'https://docs.arduino.cc/',
    provider: 'Arduino Docs',
    category: 'Hardware Reference',
    semester: 3,
    skill: 'Microcontroller GPIO, ADC & Timers',
    badge: 'Official Hardware Guides',
    description: 'Official schematics, reference APIs, and circuit tutorials for interfacing analog and digital sensors, motors, serial UART, and interrupts.',
    isFree: true,
  },
  {
    title: 'MATLAB Academy Onramp Courses',
    url: 'https://matlabacademy.mathworks.com/',
    provider: 'MATLAB Academy',
    category: 'Simulation & Math',
    semester: 4,
    skill: 'Control Systems & Transfer Functions',
    badge: 'Free Interactive Onramp',
    description: 'Free self-paced interactive tutorials by MathWorks covering MATLAB basics and Simulink modeling for feedback control loops and Bode plots.',
    isFree: true,
  },
  {
    title: 'AICTE Internship Official Portal',
    url: 'https://internship.aicte-india.org/',
    provider: 'AICTE Internship Portal',
    category: 'Internship Portal',
    semester: 5,
    skill: 'Industrial Training & Plant Placements',
    badge: 'Govt. of India Verified',
    description: 'The unified Government of India platform connecting technical undergraduate students with verified corporate, PSU, and research internships.',
    isFree: true,
  },
];

/**
 * @desc    Get all learning resources with search & category filters
 * @route   GET /api/resources
 * @access  Public
 */
const getAllResources = async (req, res, next) => {
  try {
    const { category, semester, provider, search } = req.query;

    let resources = [];
    if (isDbReady()) {
      try {
        const query = {};
        if (category && category !== 'All') query.category = category;
        if (semester !== undefined && semester !== '') query.semester = Number(semester);
        if (provider && provider !== 'All') query.provider = provider;
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { skill: { $regex: search, $options: 'i' } },
          ];
        }

        resources = await LearningResource.find(query).sort({ semester: 1, title: 1 });
      } catch (dbErr) {
        resources = [];
      }
    }

    if (!resources || resources.length === 0) {
      // Filter in-memory fallback
      resources = defaultResources.filter((r) => {
        let match = true;
        if (category && category !== 'All' && r.category !== category) match = false;
        if (semester !== undefined && semester !== '' && r.semester !== Number(semester) && r.semester !== 0) match = false;
        if (provider && provider !== 'All' && r.provider !== provider) match = false;
        if (search) {
          const s = search.toLowerCase();
          const hasSearch = r.title.toLowerCase().includes(s) ||
                            r.description.toLowerCase().includes(s) ||
                            (r.skill && r.skill.toLowerCase().includes(s));
          if (!hasSearch) match = false;
        }
        return match;
      });
    }

    res.json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle user completion status for a resource
 * @route   POST /api/resources/:id/toggle-complete
 * @access  Private
 */
const toggleResourceComplete = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const resourceTitle = req.params.id;

    let usingMongo = true;
    try {
      let progress = await UserProgress.findOne({ user: userId });
      if (!progress) {
        progress = new UserProgress({ user: userId });
      }

      const index = progress.completedResources.indexOf(resourceTitle);
      let isCompleted = false;
      if (index > -1) {
        progress.completedResources.splice(index, 1);
        isCompleted = false;
      } else {
        progress.completedResources.push(resourceTitle);
        isCompleted = true;
      }

      await progress.save();

      return res.json({
        success: true,
        resource: resourceTitle,
        isCompleted,
        completedResources: progress.completedResources,
      });
    } catch (err) {
      if (!global.__inMemoryProgress) global.__inMemoryProgress = {};
      if (!global.__inMemoryProgress[userId]) {
        global.__inMemoryProgress[userId] = { completedResources: [] };
      }
      const progress = global.__inMemoryProgress[userId];
      const index = progress.completedResources.indexOf(resourceTitle);
      let isCompleted = false;
      if (index > -1) {
        progress.completedResources.splice(index, 1);
      } else {
        progress.completedResources.push(resourceTitle);
        isCompleted = true;
      }
      return res.json({
        success: true,
        resource: resourceTitle,
        isCompleted,
        completedResources: progress.completedResources,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllResources,
  toggleResourceComplete,
  defaultResources,
};
