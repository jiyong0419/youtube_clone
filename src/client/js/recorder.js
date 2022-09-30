// upload.pug에서 script
const startRecBtn = document.querySelector("#startRecBtn");
const video = document.querySelector("#preview");

let stream;
let recorder;
let videoFile;

const handleDownload = () => {
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "MyRecoding.webm"; // a태그를 누르면 이동시켜주는게 아니라 다운로드를 시켜줌
  document.body.appendChild(a);
  a.click();
};

const handleStopRec = () => {
  startRecBtn.innerText = "Download Recording";
  startRecBtn.removeEventListener("click", handleStopRec);
  startRecBtn.addEventListener("click", handleDownload);

  recorder.stop();
};

const handleStartRec = () => {
  startRecBtn.innerText = "Stop Recording";
  startRecBtn.removeEventListener("click", handleStartRec); // removeEventListener
  startRecBtn.addEventListener("click", handleStopRec);
  recorder = new MediaRecorder(stream); // new MediaRecorder는 녹화 기능을 제공 (인자로 유저의 미디어장치를받음)
  // recorder.stop()되었을떄 dataAvailable이벤트를 반환하는데 그것을 캐치
  recorder.ondataavailable = (e) => {
    // console.log(e);
    // console.log(e.data);
    videoFile = URL.createObjectURL(e.data); // 브라우저 메모리에서만 가능한 URL을 만들어준다
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  //   console.log(recorder);  => state: 'inactive'
  recorder.start(); // 녹화시작
  //   console.log(recorder);  => state: 'recording'
  // recorder.stop(); // 5초후 녹화종료 , dataAvailable 이벤트를 반환한다
};

// init은 초기설정이라 생각하자
const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 300, height: 200 },
  }); // user의 미디어(오디오,비디오)장치를 불러온다 (유저의 미디어장치정보에서 데이터를 받아오므로 await)
  video.srcObject = stream; // 불러온 유저의 미디어장치를 video Element에 src로 설정해준다
  video.play(); // video를 재생시킨다.
};
init();

startRecBtn.addEventListener("click", handleStartRec);
