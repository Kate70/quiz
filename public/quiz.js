import { displayQuiz } from './displayQuiz.js';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');
    
    if (quizId) {
      fetch(`http://quiz-fcoa.onrender.com/api/quizzes/${quizId}/questions`)
        .then(response => response.json())
        .then(questions => {
          displayQuiz(questions);  
        })
        .catch(error => {
          console.error('Error fetching questions:', error);
        });
    } else {
      console.log('No quiz ID found in the URL');
    }
  });
  