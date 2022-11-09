const express =  require('express');
const router=express.Router();

const contentController=require('../controllers/content');
const checkAuth= require("../middleware/check-auth");


router.get('/groupbyList',checkAuth,contentController.getContentsListgroupByLesson);
router.get('/groupby',checkAuth,contentController.getContentsgroupByLesson);
router.get('/total',contentController.getContentsTotalcount);
// getContentsListgroupByLesson

router.get('',checkAuth,contentController.getContents);
router.get('/search',checkAuth,contentController.searchContent);
router.get('/searchName',checkAuth,contentController.searchContentName);
router.get('/:id',checkAuth,contentController.getContent);
router.post('',checkAuth,contentController.createContent)
router.put('/:id',checkAuth,contentController.updateContent);
router.delete('/:id',checkAuth,contentController.deleteContent);

module.exports=router;
