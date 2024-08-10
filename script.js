// script.js

const apiUrl = 'https://opentdb.com/api.php?amount=10&category=18&type=multiple'; // JavaScript category

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchQuiz();
});

async function fetchQuiz() {
    showPreloader(true);
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        questions = data.results;
        currentQuestionIndex = 0;
        score = 0;
        displayQuestion();
    } catch (error) {
        console.error('Error fetching quiz:', error);
    } finally {
        showPreloader(false);
    }
}

function displayQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question').textContent = `${currentQuestionIndex + 1}. ${question.question}`;

    let optionsHtml = '';
    const allOptions = [...question.incorrect_answers, question.correct_answer];
    allOptions.sort(() => Math.random() - 0.5); // Shuffle options

    allOptions.forEach(option => {
        optionsHtml += `
            <div>
                <input type="radio" id="${option}" name="answer" value="${option}" onclick="checkAnswer('${option}', '${question.correct_answer}')">
                <label for="${option}">${option}</label>
            </div>
        `;
    });

    document.getElementById('options').innerHTML = optionsHtml;
    document.getElementById('feedback').textContent = ''; // Clear feedback
}

function checkAnswer(selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
        document.getElementById('feedback').textContent = ''; // Clear feedback if the answer is correct
    } else {
        document.getElementById('feedback').textContent = `Incorrect! The correct answer was: ${correctAnswer}`;
        disableOptions();
    }
}

function disableOptions() {
    const options = document.querySelectorAll('input[name="answer"]');
    options.forEach(option => {
        option.disabled = true;
    });
}

function loadNextQuiz() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (!selectedOption) {
        alert('Please select an option!');
        return;
    }

    const selectedAnswer = selectedOption.value;
    const correctAnswer = questions[currentQuestionIndex].correct_answer;

    if (selectedAnswer === correctAnswer) {
        score++;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        showScore();
    }
}

function showScore() {
    const percentage = (score / questions.length) * 100;
    let resultMessage = '';

    if (percentage === 100) {
        resultMessage = 'Pass! You are brilliant!';
    } else if (percentage >= 40) {
        resultMessage = 'Pass';
    } else {
        resultMessage = 'Fail';
    }

    document.getElementById('quiz-container').innerHTML = `
    <div class="author-img"><img src="sojon-mia.jpg" alt="Sojon Mia"></div>
        <h2>Quiz Finished!</h2>
        <div class="score">Your Score: ${score}/${questions.length} (${percentage}%)</div>
        <div class="result">${resultMessage}</div>
        <button id="start-over-button" onclick="restartQuiz()">Start New Quiz</button>
        <div class="author-link"><a href="https://forms.gle/PZDia6KyHiLQQDxw5" target="_blank">Contact Me</a></div>
    `;
}

function restartQuiz() {
    document.getElementById('quiz-container').innerHTML = `
        <div class="author-img"><img src="sojon-mia.jpg" alt="Sojon Mia"></div>
        <h1>Quiz App</h1>
        <div id="question"></div>
        <div id="options"></div>
        <div id="feedback" class="feedback"></div>
        <button id="next-button" onclick="loadNextQuiz()">Next</button>
        <div id="score" class="score"></div>
        <div class="author-link"><a href="https://forms.gle/PZDia6KyHiLQQDxw5" target="_blank">Contact Me</a></div>
    `;
    fetchQuiz();
}

function showPreloader(show) {
    document.getElementById('preloader').style.display = show ? 'flex' : 'none';
    document.getElementById('quiz-container').style.display = show ? 'none' : 'block';
}
