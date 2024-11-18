const apiUrl = "https://opentdb.com/api.php?amount=5&category=18&type=multiple";


const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextButton = document.getElementById("next-button");
const scoreElement = document.getElementById("score");
const errorMessage = document.getElementById("error-message");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

async function fetchQuestions() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    questions = data.results.map((q) => ({
      question: q.question,
      answers: shuffleArray([...q.incorrect_answers, q.correct_answer]),
      correct: q.correct_answer,
    }));
    loadQuestion();
  } catch (error) {
    errorMessage.classList.remove("hidden");
  }
}


function loadQuestion() {
  if (currentQuestionIndex >= questions.length) {
    displayScore();
    return;
  }

  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerHTML = currentQuestion.question;

  answersElement.innerHTML = "";
  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.addEventListener("click", () => handleAnswerClick(button, answer === currentQuestion.correct));
    answersElement.appendChild(button);
  });
}

function handleAnswerClick(button, isCorrect) {
  document.querySelectorAll("#answers button").forEach((btn) => btn.disabled = true);

  if (isCorrect) {
    button.style.backgroundColor = "#28a745"; 
    score++;
  } else {
    button.style.backgroundColor = "#dc3545"; 
  }

  nextButton.classList.remove("hidden");
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  nextButton.classList.add("hidden");
  loadQuestion();
});

function displayScore() {
  questionElement.classList.add("hidden");
  answersElement.classList.add("hidden");
  scoreElement.classList.remove("hidden");
  scoreElement.querySelector("span").textContent = `${score} / ${questions.length}`;
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }


fetchQuestions();
