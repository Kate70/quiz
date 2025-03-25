//app.js
import { fetchQuizzes } from './fetchQuizzes.js';
import { displayQuizzes } from './displayQuiz.js';

document.addEventListener('DOMContentLoaded', () => {
  fetchQuizzes('http://localhost:3000/api/quizzes')
    .then(data => {
      displayQuizzes(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      document.getElementById('message').textContent = 'Failed to load quizzes.';
    });
});
