const countdownElement = document.getElementById("dong-ho");
var boardQuestion = document.querySelector(".board .board__question");
var boardAnswer = document.querySelector(".board__answer");
var showEndCount = document.querySelector(".showMessEndCount");
var iconCloseMessEndCount = document.querySelector(".btn__close");
var detail = document.querySelector(".detail");
var totalTime = 30;
var state = true;

// shift answer
shuffle = (answers) => {
  for (let i = 3; i >= 0; i--) {
    let rand = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[rand]] = [answers[rand], answers[i]];
  }
  return answers;
};

// keep track of how many correct answer
let correctAnswer = JSON.parse(window.sessionStorage.getItem("rework"));
let count = window.sessionStorage.getItem("count");

onCorrectedAnswer = () => {
  correctAnswer[count - 1].score += 1;
  window.sessionStorage.setItem("rework", JSON.stringify(correctAnswer));
};

// keep track of the question
let i = Number(localStorage.getItem("i")) || 0;
if (i === questions.length - 1) {
  $("#reload").css("display", "none");
}
boardQuestion.innerHTML += `
  <p>Câu hỏi số ${i + 1}:</p>
  <p><b>"</b>${questions[i].question}<b>"</b></p>
  <p style="text-align: center;"> <strong>- Hồ Chí Minh -</strong></p>`;

detail.innerHTML = questions[i].detail;
shuffledAnswer = shuffle(questions[i].answers);

for (let i = 0; i < 4; i++) {
  boardAnswer.innerHTML += `
  <button class="btn btn--ans" value="${i}"><i class="fa-xl"> </i>${shuffledAnswer[i].text}</button>
`;
}

// handle timing
function updateCountdown() {
  countdownElement.textContent = totalTime;
  totalTime--;
  if (totalTime < 0) {
    clearInterval(countdownInterval);
    // Xử lý hiển thị thông báo khi hết thời gian hoặc hết câu thử thách
    showEndCount.style.display = "flex";
    // Sau khi hết giờ trả lời câu hỏi thì hiển thị thông báo tương ứng từng trường hợp và sau đó chuyển qua câu hỏi tiếp theo
    iconCloseMessEndCount.addEventListener("click", function () {
      showEndCount.style.display = "none"; // Xử lý tắt thông báo
      if (i === questions.length - 1) {
        window.location.href = "./resultAnnouncement.html";
      } else {
        if (i < questions.length - 1) {
          i++;
          localStorage.setItem("i", i);
          window.location.reload();
        }
      }
    });
  }
}
const countdownInterval = setInterval(updateCountdown, 1000);

// track the question answer and detail
$(".btn").on("click", function () {
  setTimeout(() => {
    if (shuffledAnswer[$(this).val()].correct) {
      $("#infor").text("Chúc mừng bạn đã chọn đáp án đúng");
      onCorrectedAnswer();
    } else {
      $("#infor").text(`Rất tiếc bạn đã chọn đáp án sai`);
    }
    $("#modal__messages").modal("show");
  }, 150);
});

// handle option selection
const $buttons = $(".btn--ans");
$buttons.each(function (index, btn) {
  $buttons.on("click", function () {
    clearInterval(countdownInterval);
    let correct = shuffledAnswer[$(btn).val()].correct;
    if (correct) {
      $(btn).children().addClass("fa-solid fa-circle-check");
      $(btn).css("background-color", "#00FF00");
      $(btn).css("color", "black");
    } else {
      $(btn).children().addClass("fa-solid fa-circle-xmark");
      $(btn).css("background-color", "red");
      $(btn).css("color", "black");
    }
    if (state) {
      state = false;
      $buttons.off("click");
    }
  });
});

// handle next question view
$("#reload").on("click", () => {
  if (i < questions.length - 1) {
    i++;
    localStorage.setItem("i", i);
    window.location.reload();
  }
});
