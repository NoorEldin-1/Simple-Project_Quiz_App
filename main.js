const infoIcon = document.querySelector(".info-icon");
const infoPopUp = document.querySelector(".info-popUp");
const quizCategory = document.querySelector("select");
const startButton = document.querySelector(".quiz-button");
const quizArea = document.querySelector(".quiz-area");
const answerArea = document.querySelector(".answer-area");
const bullets = document.querySelector(".bullets");
const time = document.querySelector(".time");
const result = document.querySelector(".result");
const resultMessage = document.querySelector(".result .message");
const resultStatus = document.querySelector(
  ".result .message span:nth-of-type(1)"
);
const resultScore = document.querySelector(
  ".result .message span:nth-of-type(2)"
);
const resultTotalScore = document.querySelector(
  ".result .message span:nth-of-type(3)"
);
const reloadIcon = document.querySelector(".result i");
let currentQuestion = 0;
let quizTime = 5;
let rightAnswers = 0;

time.innerHTML = `00:0${quizTime}`;

reloadIcon.addEventListener("click", () => window.location.reload());

infoIcon.addEventListener("click", () => {
  infoPopUp.style.display = "flex";
});

infoPopUp.addEventListener("click", () => {
  infoPopUp.style.display = "none";
});

quizCategory.addEventListener("change", () => {
  quizCategory.disabled = true;
  if (quizCategory.value !== "not-selected") {
    startButton.disabled = false;
    startButton.addEventListener("click", () => {
      startButton.style.display = "none";
      document.querySelector(".quiz-container").style.display = "block";
      fetch(`json/${quizCategory.value}_questions.json`)
        .then((response) => response.json())
        .then((data) => {
          createElements(data);
          function createElements(dataObj) {
            if (currentQuestion < dataObj.length) {
              interval();
              quizArea.innerHTML = `<h3>${dataObj[currentQuestion].title}</h3>`;
              answerArea.innerHTML = "";
              bullets.innerHTML = "";
              for (let i = 1; i <= 4; i++) {
                let choice = document.createElement("div");
                choice.className = "choice";
                let radio = document.createElement("input");
                radio.type = "radio";
                radio.name = "question";
                radio.id = `choice_${i}`;
                let label = document.createElement("label");
                label.htmlFor = `choice_${i}`;
                label.textContent = dataObj[currentQuestion].choices[i - 1];
                choice.appendChild(radio);
                choice.appendChild(label);
                answerArea.appendChild(choice);
              }
              for (let i = 0; i < dataObj.length; i++) {
                let bullet = document.createElement("span");
                bullets.appendChild(bullet);
              }
              for (let i = 0; i <= currentQuestion; i++) {
                bullets.children[i].classList.add("active");
              }
            } else if (currentQuestion === dataObj.length) {
              document.querySelector(".quiz-container").style.display = "none";
              result.style.display = "block";
              if (rightAnswers === dataObj.length) {
                resultStatus.className = "perfect";
                resultStatus.textContent = "Perfect:";
              } else if (
                rightAnswers >= dataObj.length / 2 &&
                rightAnswers < dataObj.length
              ) {
                resultStatus.className = "good";
                resultStatus.textContent = "Good:";
              } else {
                resultStatus.className = "bad";
                resultStatus.textContent = "Bad:";
              }
              resultScore.textContent = rightAnswers;
              resultTotalScore.textContent = dataObj.length;
            }
          }
          function interval() {
            let timer = setInterval(() => {
              quizTime--;
              time.innerHTML = `00:0${quizTime}`;
              if (quizTime === 0) {
                clearInterval(timer);
                let inputChecked = document.querySelector(
                  'input[type="radio"]:checked + label'
                );
                if (inputChecked) {
                  if (
                    inputChecked.textContent === data[currentQuestion].answer
                  ) {
                    rightAnswers++;
                  }
                }
                currentQuestion++;
                quizTime = 5;
                time.innerHTML = `00:0${quizTime}`;
                createElements(data);
              }
            }, 1000);
          }
        });
    });
  } else {
    startButton.disabled = true;
  }
});
