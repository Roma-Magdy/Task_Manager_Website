const express = require('express');
const router = express.Router();
const { getProjects, createProject, getProjectDetails, updateProject, deleteProject } = require('../controllers/projectController');
const protect = require('../middlewares/authMiddleware');

router.get('/', protect, getProjects);
router.post('/', protect, createProject);
router.get('/:id', protect, getProjectDetails);
router.put('/:id', protect, updateProject);   
router.delete('/:id', protect, deleteProject); 

module.exports = router;