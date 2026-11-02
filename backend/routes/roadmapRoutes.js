const express = require('express');
const router = express.Router();
const {
  getAllSemesters,
  getSemesterByNumber,
  getAllProjects,
  getDashboardSummary,
} = require('../controllers/roadmapController');

router.get('/summary', getDashboardSummary);
router.get('/semesters', getAllSemesters);
router.get('/semesters/:semNumber', getSemesterByNumber);
router.get('/projects', getAllProjects);

module.exports = router;

