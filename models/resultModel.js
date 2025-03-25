const mongoose = require('mongoose');

// Схема для результатів квізу
const resultSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId, // Посилання на квіз
    ref: 'Quiz',
    required: true
  },
  answers: [
    {
      question: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question', // Посилання на питання
        required: true 
      },
      answer: { 
        type: mongoose.Schema.Types.Mixed, // Може бути масив для multiple-choice, рядок для text
        required: true 
      },
    }
  ],
  timeTaken: { 
    type: Number, // Час, витрачений на проходження квізу в секундах
    required: true 
  },
  completionDate: { 
    type: Date, 
    default: Date.now 
  },
});

// Створення моделі для результатів
const Result = mongoose.model('Result', resultSchema, 'results');

module.exports = Result;
