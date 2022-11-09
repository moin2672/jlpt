const express =  require('express');
const router=express.Router();

const lessonController=require('../controllers/lesson');
const checkAuth= require("../middleware/check-auth");

router.get('/total',checkAuth,lessonController.getLessonsTotalcount);
router.get('/search',checkAuth,lessonController.searchLesson);
router.get('/lessononly',checkAuth,lessonController.getLessonsOnly);
router.get('',checkAuth,lessonController.getLessons);
router.get('/:id',checkAuth,lessonController.getLesson);
router.post('',checkAuth,lessonController.createLesson)
router.put('/:id',checkAuth,lessonController.updateLesson);
router.delete('/:id',checkAuth,lessonController.deleteLesson);

module.exports=router;
