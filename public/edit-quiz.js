document.addEventListener("DOMContentLoaded", function () {
    const quizId = new URLSearchParams(window.location.search).get('id');
     
    if (quizId) {
        fetch(`http://localhost:3000/api/quizzes/${quizId}`)
            .then(response => response.json())
            .then(quiz => {
                document.getElementById('quiz-name').value = quiz.name;
                document.getElementById('quiz-description').value = quiz.description;

                const questionsContainer = document.getElementById('questions-container');
                quiz.questions.forEach((question, index) => {
                    addQuestionToDOM(questionsContainer, question, index);
                });
            })
            .catch(error => console.error("Error fetching quiz for editing:", error));
    }

    function addQuestionToDOM(container, question = {}, index) {
        const questionRow = document.createElement('div');
        questionRow.classList.add('question-row');
        questionRow.innerHTML = `
            <span class="question-number">${index + 1}.</span>
            <input type="text" name="question${index + 1}" value="${question.text || ''}" required>
            <select name="type${index + 1}" class="question-type">
                <option value="text" ${question.type === 'text' ? 'selected' : ''}>Text</option>
                <option value="single-choice" ${question.type === 'single-choice' ? 'selected' : ''}>Single Choice</option>
                <option value="multiple-choice" ${question.type === 'multiple-choice' ? 'selected' : ''}>Multiple Choice</option>
            </select>
            <button type="button" class="delete-btn">X</button>
            <div class="options-container" style="${question.type === 'text' ? 'display: none;' : 'display: flex;'}">
                ${(question.options || []).map(option => `<div class="option">${option}</div>`).join('')}
            </div>
        `;
        
        questionRow.querySelector(".delete-btn").addEventListener("click", function () {
            questionRow.remove();
            updateQuestionNumbers();
        });
        
        container.appendChild(questionRow);
    }

    function updateQuestionNumbers() {
        document.querySelectorAll(".question-row").forEach((row, index) => {
            row.querySelector(".question-number").textContent = `${index + 1}.`;
        });
    }

    document.getElementById('add-question').addEventListener('click', function () {
        addQuestionToDOM(document.getElementById('questions-container'), {}, document.querySelectorAll(".question-row").length);
    });

    function updateQuiz(quizId) {
        const quizName = document.getElementById('quiz-name').value;
        const quizDescription = document.getElementById('quiz-description').value;

        const questions = [];
        document.querySelectorAll('.question-row').forEach((row, index) => {
            const questionText = row.querySelector('input[type="text"]').value;
            const questionType = row.querySelector('select').value;
            const options = [];

            if (questionType !== 'text') {
                row.querySelectorAll('.options-container .option').forEach(option => {
                    options.push(option.textContent);
                });
            }

            questions.push({ text: questionText, type: questionType, options });
        });

        const updatedQuiz = {
            name: quizName,
            description: quizDescription,
            questions
        };

        fetch(`http://localhost:3000/api/questionnaire/${quizId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedQuiz)
        })
        .then(response => response.json())
    .then(() => {
        alert('Quiz updated successfully!');
        // Повертаємо на головну сторінку після успішного оновлення
        window.location.href = '/';  // або на ваш шлях головної сторінки
    })
    .catch(error => console.error('Error updating quiz:', error));
}

    document.getElementById('save-changes').addEventListener('click', function () {
        const quizId = new URLSearchParams(window.location.search).get('id');
        if (quizId) updateQuiz(quizId);
    });
});
