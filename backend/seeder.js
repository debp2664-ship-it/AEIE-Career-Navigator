const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

const Semester = require('./models/Semester');
const Project = require('./models/Project');
const LearningResource = require('./models/LearningResource');
const { fallbackSemesters, fallbackProjects } = require('./controllers/roadmapController');
const { defaultResources } = require('./controllers/resourceController');

const seedData = async () => {
  try {
    const conn = await connectDB();
    if (!conn) {
      console.error('[Seeder] Could not establish MongoDB connection. Check your MONGODB_URI in .env.');
      process.exit(1);
    }

    console.log('[Seeder] Clearing existing collections...');
    await Semester.deleteMany({});
    await Project.deleteMany({});
    await LearningResource.deleteMany({});

    console.log('[Seeder] Inserting 8 Academic Semesters...');
    await Semester.insertMany(fallbackSemesters);

    console.log('[Seeder] Inserting 6 Portfolio Projects...');
    await Project.insertMany(fallbackProjects);

    console.log('[Seeder] Inserting Curated Learning Resources...');
    await LearningResource.insertMany(defaultResources);

    console.log('[Seeder] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder] Error during database seeding:', error.message);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    const conn = await connectDB();
    if (!conn) {
      process.exit(1);
    }

    console.log('[Seeder] Wiping all roadmap data...');
    await Semester.deleteMany({});
    await Project.deleteMany({});
    await LearningResource.deleteMany({});

    console.log('[Seeder] All roadmap data destroyed!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder] Error destroying data:', error.message);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  seedData();
}

