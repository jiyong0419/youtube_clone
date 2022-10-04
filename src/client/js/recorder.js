// upload.pug에서 script
const startRecBtn = document.querySelector("#startRecBtn");
const video = document.querySelector("#preview");

let stream;
let recorder;
let videoFile;

// handleDownload가 실행되면 html에 videoFile이 담긴 a 태그를 생성하고 그것을 클릭까지 구현한다.
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
  startRecBtn.removeEventListener("click", handleStartRec);
  startRecBtn.addEventListener("click", handleStopRec);
  // new MediaRecorder는 녹화 기능을 제공 (인자로 유저의 미디어장치를받음)
  recorder = new MediaRecorder(stream);
  recorder.start();
  // recorder.stop()되었을떄 dataAvailable이벤트를 반환하는데 그것을 캐치
  recorder.ondataavailable = (event) => {
    //URL.createObjectURL() : blob으로 시작하는 URL(파일을 가리키는 URL)을 만들어서 브라우저의 메모리에 저장해둔다
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true; /*자동반복 */
    video.play();
  };
};

// init은 초기설정
const init = async () => {
  // navigator.mediaDevices.getUserMedia : 유저의 미디어(오디오,비디오)장치에 접근요청을 한다. (유저의 미디어장치정보에서 데이터를 받아오므로 await)
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 300, height: 200 },
  });
  video.srcObject = stream; // 불러온 유저의 미디어장치를 video Element에 src로 설정해준다
  video.play(); // video를 재생시킨다.
};
init();

startRecBtn.addEventListener("click", handleStartRec);
