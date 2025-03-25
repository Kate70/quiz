// quizActions.js
import { displayQuiz } from './displayQuiz.js';


export function runQuiz(quizId) {  
     
    fetch(`http://localhost:3000/api/quizzes/${quizId}/questions`)
      .then(response => response.json())
      .then(questions => {
          displayQuiz(questions);          
          window.location.href = `quiz.html?id=${quizId}`;         
                    
          
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
      });
  }
  


 
export function editQuiz(quizId) {
     window.location.href = `edit-quiz.html?id=${quizId}`;
    alert(`Edit quiz with ID: ${quizId}`);
    
  }
  
  
 
export function createQuiz() {    
    window.location.href = 'create-quiz.html';
    console.log("Create quiz function is called.");
}



document.addEventListener("DOMContentLoaded", () => {
    const createButton = document.querySelector('.create-btn');
    if (createButton) {
        createButton.addEventListener('click', createQuiz);
    } else {
        console.error("Button .create-btn not found.");
    }
});