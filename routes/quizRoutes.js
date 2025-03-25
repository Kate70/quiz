const express = require('express');
const { getAllQuizzes,  getOneQuize, getQuizById, postQuiz, editQuiz, deleteQuiz} = require('../controllers/quizController.js');
const { postAnswers } = require('../controllers/answerController.js')

const router = express.Router();

router.route("/quizzes")
    .get(getAllQuizzes) 
    .post(postQuiz); 

router.route("/quizzes/:id")
    .get(getQuizById) 
    .put(editQuiz) 
    .delete(deleteQuiz); 

router.get("/quizzes/:id/questions", getOneQuize); 
router.post("/submit-answers", postAnswers); 



module.exports = router;
