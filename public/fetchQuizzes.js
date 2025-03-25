import { displayQuizzes } from './displayQuiz.js'; 


export function fetchQuizzes(page = 1) {
    return fetch(`/api/quizzes?page=${page}&limit=8`)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching quizzes:', error);
            throw new Error('Error fetching quizzes');
        });
}
export function sendAnswers({ quizId, answers, timeTaken }) {
    console.log("Submitting answers:", { answers });

    if (!Array.isArray(answers) || answers.length === 0) {
        console.error("Answers array is empty or incorrect format:", answers);
        throw new Error("Answers array is empty or incorrect format");
    }

    if (typeof timeTaken !== "number") {
        console.error("TimeTaken is not defined or incorrect:", timeTaken);
        throw new Error("timeTaken is not defined");
    }

    return fetch('/api/submit-answers', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId, answers, timeTaken })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    });
}


export async function deleteQuiz(id, currentPage) {
    try {
        console.log(`Sending DELETE request for quiz with ID: ${id}`);
        const response = await fetch(`https://quiz-fcoa.onrender.com/api/quizzes/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete quiz with id: ${id}`);
        }

        console.log(`Quiz with id: ${id} deleted successfully`);

              fetchQuizzes(currentPage)
            .then(displayQuizzes)
            .catch(error => console.error('Error fetching quizzes after delete:', error));

    } catch (error) {
        console.error('Error deleting quiz:', error);
    }
}
