const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ['text', 'single-choice', 'multiple-choice'], required: true },
  options: [String], 
});

const quizSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  questions: [questionSchema],
  completions: { type: Number, default: 0 },
});


const Quiz = mongoose.model('Quiz', quizSchema, 'quizzes');
module.exports = Quiz;
