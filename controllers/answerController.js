const Result = require('../models/resultModel.js');

const postAnswers = async (req, res) => {
    try {
        const { quizId, answers } = req.body;
    
       if (!quizId || !answers) {
      return res.status(400).json({ error: 'Quiz ID and answers are required.' });
    }
  
    const result = new Result({
      quiz: quizId,
      answers: answers.map(answer => ({
        question: answer.question, 
        answer: answer.answer
      })),
      timeTaken: req.body.timeTaken,  
      completionDate: new Date()
    });
  
    result.save()
      .then(savedResult => {
        res.status(200).json(savedResult);
      })
    } catch (error) {
        res.status(500).json({ error: 'Failed to save answers.' });
    }
}

module.exports = {
    postAnswers
  };