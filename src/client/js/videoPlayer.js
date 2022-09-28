const video = document.querySelector("video");
const playBtn = document.querySelector("#play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.querySelector("#mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.querySelector("#volume");
const currentTime = document.querySelector("#currentTime");
const totalTime = document.querySelector("#totalTime");
const timeline = document.querySelector("#timeline");
const fullScreenBtn = document.querySelector("#fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.querySelector("#videoContainer");
const videoControls = document.querySelector("#videoControls");

let volumeValue = 0.5;
video.volume = volumeValue; // 볼륨은 volumeValue 값

const handleMute = () => {
  // muteBtn을 눌렀을때 mute상태이면 mute를 풀어주고 unmute상태이면 mute를 걸어준다.
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  // mute 상태에 따라 classList가 변하고 볼륨게이지가 0 , 0.5로 설정된다
  muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

/**/

const handleVolumeChange = (event) => {
  // 볼륨 바의 target지점의 값을 불러온다
  const {
    target: { value },
  } = event;
  // mute상태이면 mute를 풀어주고 muteBtn의 classList도 변경한다.
  if (video.muted) {
    video.muted = false;
    muteBtn.classList = "fas fa-volume-up";
  }
  // volumeValue와 video의 volume을 target지점 값으로 설정한다.
  volumeValue = value;
  video.volume = value;
};

/**/

const handlePlayClick = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

/**/

const handleTimelineChange = (event) => {
  // target의 value를 받아오고, 그 value를 비디오의 currentTime으로 지정해준다
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

/**/

const formatTime = (second) => {
  return new Date(second * 1000).toISOString().substring(11, 19);
  // new Date(1000) = "Thu Jan 01 1970 09:00:01 GMT+0900 (한국 표준시) {}" 을 반환,  new Date(1000).toISOString()는 "1970-01-01T00:00:01.000Z"(국제표준날짜형식)를 반환,
  // subStr(11,19)은 문자열의 11번째자리 (0부터시작)에서 19번째 까지 잘라서 반환
};

/**/

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration)); // video.duration은 second단위로 소수점까지 반환된다
  timeline.max = Math.floor(video.duration);
};

/**/

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

/**/

let controlsTimeout = null;
let controlsMovementTimeout = null;
const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = (e) => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout); // clearTimeout은 리턴받은 setTimeout의 id를 없애준다
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000); // setTimeout은 Timeout의 id를 리턴해준다
};

/**/

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
  // console.log("controlsTimeout = ", controlsTimeout);
};

/**/

const handleVideoClick = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

/**/

const handleKeypress = (e) => {
  if (e.key === " ") {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
  }
};

/**/

const handleFullScreen = () => {
  if (document.fullscreenElement === null) {
    // document.fullScreenElement는 전체화면 된 요소를 리턴해준다
    videoContainer.requestFullscreen();
    // requestFullscreen()은 요소를 전체화면으로 해준다
    fullScreenIcon.classList = "fas fa-compress";
  } else {
    document.exitFullscreen();
    // document.exitFullscreen()은 전체화면을 종료해준다
    fullScreenIcon.classList = "fas fa-expand";
  }
};

/**/

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  video.currentTime = 0;
  playBtnIcon.classList = "fas fa-play";
  fetch(`/api/videos/${id}/view`, { method: "post" });
};

/**/

muteBtn.addEventListener("click", handleMute);

volumeRange.addEventListener("input", handleVolumeChange); // input이벤트는 input의 value가 변경될때마다 발생한다.

playBtn.addEventListener("click", handlePlayClick);

timeline.addEventListener("input", handleTimelineChange);

video.addEventListener("loadedmetadata", handleLoadedMetadata); // loadedmetadata는 media의 metadata가 로딩이 완료되었을때 발생한다.
video.addEventListener("timeupdate", handleTimeUpdate); // media의 currentTime이 변할때마다 발생한다.
video.addEventListener("ended", handleEnded); // media가 끝났을때 발생한다.
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("click", handleVideoClick);
document.addEventListener("keypress", handleKeypress);

fullScreenBtn.addEventListener("click", handleFullScreen);
