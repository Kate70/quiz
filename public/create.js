document.addEventListener("DOMContentLoaded", function () {
    const questionsContainer = document.getElementById("questions-container");
    const addQuestionButton = document.getElementById("add-question");
    const submitButton = document.getElementById("submit-questions");
    const quizNameInput = document.getElementById("quiz-name");
    const quizDescriptionInput = document.getElementById("quiz-description");

    let questionCount = 0;

    addQuestionButton.addEventListener("click", function () {
        questionCount++;

        const questionRow = document.createElement("div");
        questionRow.classList.add("question-row");
        questionRow.dataset.questionId = questionCount;

        questionRow.innerHTML = `
            <span class="question-number">${questionCount}.</span>
            <input type="text" name="question${questionCount}" placeholder="Enter your question" required>
            <select name="type${questionCount}" class="question-type">
                <option value="text">Text</option>
                <option value="single-choice">Single Choice</option>
                <option value="multiple-choice">Multiple Choice</option>
            </select>
            <button type="button" class="delete-btn">X</button>
            <div class="options-container" style="display: none;">
                <input type="text" class="option-input" placeholder="Enter option and press Enter">
            </div>
        `;

        const questionTypeSelect = questionRow.querySelector(".question-type");
        const optionsContainer = questionRow.querySelector(".options-container");
        const optionInput = optionsContainer.querySelector(".option-input");

        questionTypeSelect.addEventListener("change", function () {
            if (this.value === "single-choice" || this.value === "multiple-choice") {
                optionsContainer.style.display = "flex";
            } else {
                optionsContainer.style.display = "none";
                optionsContainer.innerHTML = '<input type="text" class="option-input" placeholder="Enter option and press Enter">';
            }
        });

       
        optionInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                const optionText = optionInput.value.trim();
                if (optionText) {
                    const option = document.createElement("div");
                    option.textContent = optionText;
                    option.classList.add("option");
                    optionsContainer.insertBefore(option, optionInput);
                    optionInput.value = "";                
                    option.addEventListener("click", () => option.remove());
                }
            }
        });

       
        questionRow.querySelector(".delete-btn").addEventListener("click", function () {
            questionRow.remove();
            updateQuestionNumbers();
        });

        questionsContainer.appendChild(questionRow);
    });

    function updateQuestionNumbers() {
        const questionRows = document.querySelectorAll(".question-row");
        questionRows.forEach((row, index) => {
            row.querySelector(".question-number").textContent = `${index + 1}.`;
        });
        questionCount = questionRows.length;
    }

    submitButton.addEventListener("click", function (event) {
        event.preventDefault();

        const quizName = quizNameInput.value.trim();
        const quizDescription = quizDescriptionInput.value.trim();

        if (!quizName) {
            alert("Quiz name is required!");
            return;
        }

        const questions = [];
        document.querySelectorAll(".question-row").forEach((row, index) => {
            const questionText = row.querySelector("input[type='text']").value;
            const questionType = row.querySelector("select").value;
            const options = [];

            if (questionType !== "text") {
                row.querySelectorAll(".options-container .option").forEach(option => {
                    options.push(option.textContent);
                });

                if (options.length === 0) {
                    alert(`Add options for question ${index + 1}`);
                    return;
                }
            }

            questions.push({ text: questionText, type: questionType, options });
        });

        const quizData = {
            name: quizName,
            description: quizDescription,
            questions,
            completions: 0
        };

        fetch("https://quiz-fcoa.onrender.com/api/questionnaire", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(quizData)
        })
        .then(response => response.json())
        .then(data => {
            alert("Questionnaire submitted successfully!");
            console.log(data);
        })
        .catch(error => {
            console.error("Error submitting questionnaire:", error);
        });
    });
});
