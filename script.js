let panelbtm = document.querySelector("#panelbtm");
let timer = 60;
let newHit = 0;
let score = 0;

function rulesOverlay() {
  let startplay = document.querySelector(".rules-card button");
  let rulesPanel = document.querySelector(".info-overlay");
  rulesPanel.style.display = "flex";
  startplay.addEventListener("click", () => {
    setTimeout(() => {
      rulesPanel.style.display = "none";
      makeBubble();
      bubbleTimer();
      getNewHit();
    }, 200);
  });
}

function gameOver() {
  panelbtm.innerHTML = `<div class="gameend">
              <h1>Game Over</h1>
              <h2>${score > 0 ? "Congrats! 🎉" : "You can try again!"}</h2>
              <h2>Score: ${score > 0 ? `${score}` : `${score} 😒`}</h2>
              <button id="play-again">Play Again 🔄️</button>
            </div>`;
  document.querySelector("#hitval").textContent = `0`;
  document.querySelector("#scoreval").textContent = `00`;
  let playAgain = document.querySelector("#play-again");
  playAgain.addEventListener("click", () => {
    timer = 60;
    score = 0;
    playAgain.innerHTML = `Setting Up...`;
    setTimeout(() => {
      makeBubble();
      bubbleTimer();
      getNewHit();
      document.querySelector("#timerval").textContent = `60`;
    }, 2000);
  });
}

function increaseScore(val) {
  if (val) {
    score += 10;
    document.querySelector("#scoreval").textContent = score;
  } else if (score > 0) {
    score -= 5;
    document.querySelector("#scoreval").textContent = score;
  }
}

function getNewHit() {
  newHit = Math.floor(Math.random() * 10);
  document.querySelector("#hitval").textContent = newHit;
}

let timeInterval = null;

function bubbleTimer() {
  timeInterval = setInterval(function () {
    if (timer > 0) {
      timer--;
      document.querySelector("#timerval").textContent = `${
        timer < 10 ? `0${timer}` : `${timer}`
      }`;
    } else {
      clearInterval(timeInterval);
      gameOver();
    }
  }, 1000);
}

function playPause(val) {
  if (val) clearInterval(timeInterval);
  else bubbleTimer();
}

function makeBubble() {
  let clutter = "";

  let screenWidth = window.innerWidth;
  let totalBubbles = 0;

  if (screenWidth >= 1440) {
    totalBubbles = 255;
  } else if (screenWidth >= 1200) {
    totalBubbles = 200;
  } else if (screenWidth >= 1024) {
    totalBubbles = 130;
  } else if (screenWidth >= 768) {
    totalBubbles = 120;
  } else {
    totalBubbles = 50;
  }

  let forcedIndex = Math.floor(Math.random() * totalBubbles);

  for (let i = 1; i <= totalBubbles; i++) {
    let rn = i === forcedIndex ? newHit : Math.floor(Math.random() * 10);
    clutter += `<div class="bubble">${rn}
    <div class="blastBubble"><img src="blast.gif" alt="" /></div>
    </div>`;
  }
  panelbtm.innerHTML = clutter;
}
panelbtm.addEventListener("click", (e) => {
  playerHit = Number(e.target.textContent);
  if (playerHit === newHit && timer > 0) {
    const blast = e.target.querySelector(".blastBubble");
    blast.style.display = "block";
    e.target.style.animationName = "blastBubble";
    e.target.style.animationDuration = "0.8s";

    setTimeout(() => {
      blast.style.display = "none";
      e.target.style.animationName = "";
      increaseScore(true);
      makeBubble();
      getNewHit();
    }, 300);
  } else {
    e.target.classList.contains("bubble")
      ? (e.target.style.animationName = "giggle")
      : (e.target.style.animationName = "");
    e.target.style.animationDuration = "0.3s";
    setTimeout(() => {
      increaseScore(false);
      e.target.style.animationName = "";
    }, 300);
  }
});

let play = true;
let playPauseShow = document.querySelector("#pause");
let pauseBtn = document.querySelector("#pause-play");
let pauseOverlay = document.querySelector(".pause-overlay");
document.querySelector(".menu").addEventListener("click", () => {
  if (play && timer > 0) {
    playPause(play);
    play = false;
    playPauseShow.innerHTML = "Play";
    pauseBtn.innerHTML = `<path d="M8 5v14l11-7z" />`;
    pauseOverlay.style.display = "flex";
  } else {
    playPause(play);
    play = true;
    playPauseShow.innerHTML = "Pause";
    pauseBtn.innerHTML = `<path d="M6 3H8V21H6V3ZM16 3H18V21H16V3Z" />`;
    pauseOverlay.style.display = "none";
  }
});

let playNow = document.querySelector(".play-overlay button");
playNow.addEventListener("click", () => {
  playNow.innerHTML = `Setting Up...`;
  setTimeout(() => {
    document.querySelector(".play-overlay").style.display = "none";
    rulesOverlay();
  }, 2000);
});
