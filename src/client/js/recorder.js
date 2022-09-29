const startRecBtn = document.querySelector("#startRecBtn");
const video = document.querySelector("#preview");

let stream;

const handleStopRec = () => {
  startRecBtn.innerText = "Start Recording";
  startRecBtn.removeEventListener("click", handleStopRec);
  startRecBtn.addEventListener("click", handleStartRec);
};

const handleStartRec = () => {
  startRecBtn.innerText = "Stop Recording";
  startRecBtn.removeEventListener("click", handleStartRec); // removeEventListener
  startRecBtn.addEventListener("click", handleStopRec);
  const recorder = new MediaRecorder(stream); // new MediaRecorder는 녹화 기능을 제공 (인자로 유저의 미디어장치를받음)
  recorder.ondataavailable = (e) => {
    console.log(e);
    console.log(e.data); // recorder.stop()에서 반환된 이벤트를 캐치한다
  };
  //   console.log(recorder);  => state: 'inactive'
  recorder.start(); // 녹화시작
  //   console.log(recorder);  => state: 'recording'
  setTimeout(() => {
    recorder.stop(); // 5초후 녹화종료 , dataAvailable 이벤트를 반환한다
  }, 5000);
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 300, height: 200 },
  }); // user의 미디어(오디오,비디오)장치를 불러온다 (유저의 미디어장치정보에서 데이터를 받아오므로 await)
  console.log(stream);
  video.srcObject = stream; // 불러온 유저의 미디어장치를 video Element에 src로 설정해준다
  video.play(); // video를 재생시킨다.
};
init();

startRecBtn.addEventListener("click", handleStartRec);
