import { runQuiz, editQuiz } from './quizActions.js';
import { sendAnswers } from './fetchQuizzes.js';
import { fetchQuizzes } from './fetchQuizzes.js';
import { deleteQuiz } from './fetchQuizzes.js';

let timer;
let timeRemaining = 0; 
let currentPage = 1;
let totalPages = 1;

function startTimer() {
    console.log("startTimer");
    timeRemaining = 0; 
    timer = setInterval(function () {
        timeRemaining++;
        console.log(timeRemaining);
    }, 1000);
}

export function displayQuizzes(data) {
    const quizList = document.getElementById('quiz-list');
    const paginationContainer = document.getElementById('pagination');

    quizList.innerHTML = ''; 

    if (!data.quizzes || data.quizzes.length === 0) {
        quizList.innerHTML = '<p>No quizzes available at the moment.</p>';
        return;
    }

    totalPages = data.totalPages; 
    data.quizzes.forEach(quiz => {
        const quizItem = document.createElement('div');
        quizItem.classList.add('quiz-item');

        quizItem.innerHTML = `
            <div class="quiz-content">
                <h2 class="quiz-title">${quiz.name}</h2>
                <p class="quiz-description">${quiz.description}</p>
                <div class="quiz-stats">
                    <p>Questions: ${quiz.questions.length}</p>
                    <p>Completions: ${quiz.completions}</p>
                </div>
            </div>
            <div class="quiz-actions">
                <button class="edit-btn">Edit</button>
                <button class="run-btn">Run</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        quizList.appendChild(quizItem);

        quizItem.querySelector('.edit-btn').addEventListener('click', () => editQuiz(quiz._id));
        quizItem.querySelector('.run-btn').addEventListener('click', () => runQuiz(quiz._id));
        quizItem.querySelector('.delete-btn').addEventListener('click', () => deleteQuiz(quiz._id, currentPage));
    });

    updatePaginationButtons(paginationContainer);
}

function updatePaginationButtons(container) {
    container.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => changePage(currentPage - 1));

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => changePage(currentPage + 1));

    container.appendChild(prevButton);
    container.appendChild(nextButton);
}

function changePage(newPage) {
    if (newPage < 1 || newPage > totalPages) return;
    currentPage = newPage;

    fetchQuizzes(currentPage)
        .then(displayQuizzes)
        .catch(error => console.error('Error fetching quizzes:', error));
}


document.addEventListener('DOMContentLoaded', () => {
    fetchQuizzes(1)
        .then(displayQuizzes)
        .catch(error => console.error('Error fetching quizzes:', error));
});

export function displayQuiz(questions) {
    console.log(4);

    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) {
        console.error('Element with id "quiz-container" not found.');
        return;
    }
    quizContainer.innerHTML = ''; 

    if (questions.length === 0) {
        quizContainer.innerHTML = '<p>No questions available.</p>';
        return;
    }

    questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        questionElement.innerHTML = `
            <h3>Question ${index + 1}: ${question.text}</h3>
            ${generateQuestionOptions(question, index)}
        `;
        quizContainer.appendChild(questionElement);
    });

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit Answers';
    submitButton.onclick = () => submitAnswers(questions);
    quizContainer.appendChild(submitButton);
    startTimer();
}

function generateQuestionOptions(question, index) {
    let optionsHtml = '';
    if (question.type === 'single-choice' || question.type === 'multiple-choice') {
        optionsHtml = question.options.map(option => {
            const inputType = question.type === 'single-choice' ? 'radio' : 'checkbox';
            return `
                <label>
                    <input type="${inputType}" name="question${index}" value="${option}">
                    ${option}
                </label><br>
            `;
        }).join('');
    } else if (question.type === 'text') {
        optionsHtml = `
            <label>
                <input type="text" name="question${index}" class="text-answer" placeholder="Your answer">
            </label>
        `;
    }
    return optionsHtml;
}

function submitAnswers(questions) {

    clearInterval(timer);

    let timeTaken = timeRemaining;
    console.log(`Time taken: ${timeTaken} seconds`);

    const answers = questions.map((question, index) => {
        const answerElements = document.getElementsByName(`question${index}`);
        let answer;

        if (question.type === 'single-choice') {
            const selectedAnswer = Array.from(answerElements).find(input => input.checked);
            answer = selectedAnswer ? selectedAnswer.value : null;
        } else if (question.type === 'multiple-choice') {
            answer = Array.from(answerElements)
                .filter(input => input.checked)
                .map(input => input.value);
        } else if (question.type === 'text') {
            answer = answerElements[0]?.value || '';
        }

        return { question: question._id, text: question.text, answer };
    }).filter(ans => ans.answer !== null);

    const quizId = new URLSearchParams(window.location.search).get('id');

    if (!quizId || answers.length === 0) {
        alert('Error: No answers selected.');
        return;
    }

    const payload = { quizId, answers, timeTaken };

    sendAnswers(payload)
        .then(data => {
            console.log('Server response:', data);
            showResults(answers, timeTaken); 
        })
        .catch(error => {
            console.error('Submission error:', error);
            alert('There was an error submitting your answers.');
        });
}


function showResults(answers, timeTaken) {
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = `
        <h2>Your results:</h2>
        <p>Execution time: ${timeTaken} sec</p>
        <ul>
            ${answers.map(ans => `<li><strong>${ans.text}</strong>: ${Array.isArray(ans.answer) ? ans.answer.join(', ') : ans.answer}</li>`).join('')}
        </ul>
        <button onclick="window.location.reload()">Пройти знову</button>
    `;
    resultContainer.style.display = 'block';
}
