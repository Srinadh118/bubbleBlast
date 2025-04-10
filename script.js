let panelbtm = document.querySelector("#panelbtm");
let timer = 60;
let newHit = 0;
let score = 0;
const popSound = new Audio("assets/bubblepop.mp3");
const errorSound = new Audio("assets/error.mp3");

const bgMusic = {
  current: null,
  next: null,
  isMuted: false,
  fadeInterval: null,

  play(src, loop = false, volume = 0.1) {
    this.stop();
    this.current = new Audio(src);
    this.current.loop = loop;
    this.current.volume = volume;
    this.current.play();
  },
  chainNext(src, loop = true) {
    this.next = new Audio(src);
    this.next.loop = loop;
    this.next.volume = this.current.volume;
    this.current.addEventListener("ended", () => {
      this.next.play();
      this.current = this.next;
      this.next = null;
    });
  },
  stop() {
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    if (this.current) {
      this.current.pause();
      this.current = null;
    }
    if (this.next) {
      this.next.pause();
      this.next = null;
    }
  },
  setVolume(vol) {
    if (this.current) this.current.volume = vol;
    if (this.next) this.next.volume = vol;
  },
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.current) this.current.muted = this.isMuted;
    if (this.next) this.next.muted = this.isMuted;
  },
  fadeOut(duration = 1000) {
    if (!this.current) return;
    const step = this.current.volume / (duration / 50);
    this.fadeInterval = setInterval(() => {
      if (this.current.volume > step) {
        this.current.volume -= step;
      } else {
        this.current.volume = 0;
        this.current.pause();
        clearInterval(this.fadeInterval);
      }
    }, 50);
  },

  fadeIn(src, targetVolume = 0.1, duration = 1000, loop = true) {
    this.stop();
    const audio = new Audio(src);
    this.current = audio;
    audio.volume = 0;
    audio.loop = loop;
    audio.play();

    const step = targetVolume / (duration / 50);
    this.fadeInterval = setInterval(() => {
      if (this.current.volume < targetVolume - step) {
        this.current.volume += step;
      } else {
        this.current.volume = targetVolume;
        clearInterval(this.fadeInterval);
      }
    }, 50);
  },

  playRandom(trackList = [], loop = true, volume = 0.1) {
    if (!trackList.length) return;
    const index = Math.floor(Math.random * trackList.length);
    this.play(trackList[index], loop, volume);
  },

  setTrack(index, trackList, loop = true, volume = 0.1) {
    if (index < 0 || index > trackList.length) return;
    this.play(trackList[index], loop, volume);
  },
};

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
      bgMusic.fadeIn("assets/bg1.mp3", 0.05, 2000, false);
      bgMusic.chainNext("assets/bg2.mp3");
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
  bgMusic.toggleMute();
  if (val) {
    clearInterval(timeInterval);
  } else {
    bubbleTimer();
  }
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
    clutter += `<div class="bubble">${rn}</div>`;
  }
  panelbtm.innerHTML = clutter;
}
panelbtm.addEventListener("click", (e) => {
  playerHit = Number(e.target.textContent);
  if (
    playerHit === newHit &&
    e.target.classList.contains("bubble") &&
    timer > 0
  ) {
    const blastImg = new Image();
    blastImg.src = "newblast.gif";
    blastImg.className = "blastBubble";
    e.target.appendChild(blastImg);
    e.target.style.animationName = "blastBubble";
    e.target.style.animationDuration = "0.3s";
    popSound.volume = 0.4;
    popSound.currentTime = 0;
    popSound.play();

    setTimeout(() => {
      blastImg.remove();
      e.target.style.animationName = "";
      e.target.style.animationDuration = "0s";
      increaseScore(true);
      makeBubble();
      getNewHit();
    }, 300);
  }
  if (
    playerHit !== newHit &&
    e.target.classList.contains("bubble") &&
    timer > 0
  ) {
    errorSound.currentTime = 0;
    errorSound.play();
    e.target.style.animationName = "giggle";
    e.target.style.animationDuration = "0.3s";
    setTimeout(() => {
      increaseScore(false);
      e.target.style.animationName = "";
      e.target.style.animationDuration = "0s";
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
  } else if (timer > 0) {
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
    bgMusic.fadeIn("assets/bg1.mp3", 0.05, 2000, false);
    bgMusic.fadeOut(2000);
    bgMusic.chainNext("assets/bg2.mp3");
    rulesOverlay();
  }, 2000);
});

// const bgSound1 = new Audio("assets/bg1.mp3");
// const bgSound2 = new Audio("bg2.mp3");
// bgMusic.play("assets/bg1.mp3", false, 0.1);
