const Quiz = require('../models/quizModel.js');

const getAllQuizzes = async(req, res) => {
    try {
        let { page = 1, limit = 8 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const total = await Quiz.countDocuments(); 
        const quizzes = await Quiz.find()
            .skip((page - 1) * limit) 
            .limit(limit);

        res.json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            quizzes
        });
        
    } catch (error) {
        res.status(500).json({error: 'Error fetching quizzes'})
    }
}



const getOneQuize = async (req, res) => {
    try {
        const quizId = req.params.id;
        const quiz = await Quiz.findById(quizId);
  
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
  
            res.json(quiz.questions);
    }catch (error) {
        res.status(500).json({ message: 'Error getting one quiz', error });
      }
}

const getQuizById = async (req, res) => {
    try {
        const quizId = req.params.id;

        // Використовуємо Mongoose для знаходження квіза за ID
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.json(quiz); // Повертаємо весь квіз (назва, опис, питання)
    } catch (error) {
        console.error('Помилка при отриманні квізу:', error);
        res.status(500).json({ message: 'Помилка при отриманні квізу', error: error.message || error });
    }
};

const postQuiz = async (req, res) => {
    try {
        const { name, description, questions, completions } = req.body;
        if (!name || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: "Quiz name and at least one question are required." });
        }
        const newQuiz = new Quiz({
                name,
                description,
                questions,
                completions: completions || 0,
              });
          
              await newQuiz.save();
              res.status(201).json({ message: "Quiz saved successfully!", quiz: newQuiz });
    } catch (error) {
        console.error("Error saving quiz:", error);
        res.status(500).json({ error: "Internal Server Error" }); 
    }
}


const editQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        const { name, description, questions } = req.body;
        if (!name || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ error: 'Name and questions are required.' });
          }
          const updatedQuiz = await Quiz.findByIdAndUpdate(
          
            quizId,
            { name, description, questions },
            { new: true, runValidators: true }
          );
      
      
          if (!updatedQuiz) {
            return res.status(404).json({ error: 'Quiz not found.' });
          }
      
          res.json({ message: 'Quiz updated successfully!', quiz: updatedQuiz });
        
    } catch (error) {
        console.error('Error updating quiz:', error);
      res.status(500).json({ error: 'Server error while updating quiz.' });
    }
}

const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

module.exports = {  
    getAllQuizzes,
    editQuiz,
    getOneQuize,
    getQuizById,
    postQuiz,
    deleteQuiz
};
