const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");

let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
};

const handleMute = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  volumeRange.value = video.muted ? 0 : 0.5;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = value;
  video.volume = value;
};

const formatTime = (second) => {
  return new Date(second * 1000).toISOString().substring(11, 19);
  // new Date(1000) = "Thu Jan 01 1970 09:00:01 GMT+0900 (한국 표준시) {}" 을 반환,  new Date(1000).toISOString()는 "1970-01-01T00:00:01.000Z"(국제표준날짜형식)를 반환,
  // subStr(11,8)은 문자열의 11번째자리 (0부터시작)에서 8개까지 잘라서 반환
};

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullScreen = () => {
  if (document.fullscreenElement === null) {
    videoContainer.requestFullscreen();
    fullScreenBtn.innerText = "Exit Full Screen";
  } else {
    document.exitFullscreen();
    fullScreenBtn.innerText = "Enter Full Screen";
  }
};

playBtn.addEventListener("click", handlePlayClick);

muteBtn.addEventListener("click", handleMute);

volumeRange.addEventListener("input", handleVolumeChange); // input이벤트는 input의 value가 변경될때마다 발생한다.

timeline.addEventListener("input", handleTimelineChange);

video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);

fullScreenBtn.addEventListener("click", handleFullScreen);

console.log(document.fullscreenElement);
