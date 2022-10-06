// recorder.js는 upload.pug에서 script
// ffmpeg1 (녹화본 webm파일을 mp4로 변환하기 )  $ npm install @ffmpeg/ffmpeg @ffmpeg/core
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const startRecBtn = document.querySelector("#startRecBtn");
const video = document.querySelector("#preview");

let stream;
let recorder;
let videoFile;

// handleDownload가 실행되면 html에 videoFile이 담긴 a 태그를 생성하고 그것을 클릭까지 구현한다.
const handleDownload = async () => {
  startRecBtn.removeEventListener("click", handleDownload);
  startRecBtn.innerText = "Transcoding...";
  startRecBtn.disabled = true;
  //ffmpeg2,ffmpeg3  >> 여기까지 ffmpeg를 불러오는 과정
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();

  //ffmpeg4 >> ffmpeg는 브라우저상에서 파일을 관리해주는 소프트웨어, 1번쨰인자 = 쓰기, 2번째인자 = 원하는파일명.webm, 3번쨰인자 = binaryData = fetchFile함수를 이용하여 blob파일을 binaryData로 변환
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));

  //ffmpeg5 >> ffmpeg에게 할일을 부여 = 유저의 브라우저에 recording.webm을 초당프레임 60 mp4로 변환하여 그 파일을 인풋(-i는 인풋) >> ffmpeg파일시스템에 output.mp4가 생김
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");

  //썸네일만들기 1 >> -ss는 특정시간대로 이동시켜줌  >> -frames:v ,1 은 이동한시간에서 1장의 스크린샷 찍어줌 >> thumbnail.jpg는 앞에서 찍은 스크린샷을 파일명을 작성 >> 파일시스템의 메모리에 thumbnail.jpg 생성됨
  await ffmpeg.run("-i", "recording.webm", "-ss", "00:00:01", "-frames:v", "1", "thumbnail.jpg");
  const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg");
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });
  const thumbUrl = URL.createObjectURL(thumbBlob);
  const thumbA = document.createElement("a");
  thumbA.href = thumbUrl;
  thumbA.download = "MyThumbnail.jpg";
  document.body.appendChild(thumbA);
  thumbA.click();

  //ffmpeg7 (ffmpeg6은 sever.js에 존재) >> ffmpeg파일시스템에서 output.mp4를 읽어들여 mp4File변수에 할당 (mp4File은 Uin8Array(280649)[0,0,0,32,102..] 이런식으로 생겼고 이것이 브라우저에서 mp4파일을 표현하는 방식이다)
  const mp4File = ffmpeg.FS("readFile", "output.mp4");

  //ffmpeg8 >> mp4File을 Blob으로 변환 (mp4File.buffer는 몰라도돼 그냥써)
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });

  //ffmpeg9 >> mp4Blob을 url로 변경후 아래 a태그에 적용해주자
  const mp4Url = URL.createObjectURL(mp4Blob);

  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "MyRecoding.mp4"; // a태그를 누르면 이동시켜주는게 아니라 MyRecoding.mp4를 다운로드를 시켜줌
  document.body.appendChild(a);
  a.click();

  // file 다운로드가 끝나면 FS의 파일리스트를 정리해준다
  ffmpeg.FS("unlink", "recording.webm");
  ffmpeg.FS("unlink", "output.mp4");
  ffmpeg.FS("unlink", "thumbnail.jpg");

  // file 다운로드가 끝나면 브라우저 메모리의 URL도 정리해준다
  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);

  startRecBtn.disabled = false;
  startRecBtn.addEventListener("click", handleStartRec);
  startRecBtn.innerText = "Start Recoding";
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
    //event.data는 Blob파일의 정보 size, type이 들어있다
    //URL.createObjectURL() : blob으로 시작하는 URL(파일을 가리키는 URL)을 만들어서 브라우저의 메모리에 저장해둔다
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true; /*자동반복 */
    video.play();
  };
  setTimeout(() => {
    startRecBtn.click();
  }, 5000);
};

// init은 초기설정
const init = async () => {
  // navigator.mediaDevices.getUserMedia : 유저의 미디어(오디오,비디오)장치에 접근요청을 한다. (유저의 미디어장치정보에서 데이터를 받아오므로 await)
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  video.srcObject = stream; // 불러온 유저의 미디어장치를 video Element에 src로 설정해준다
  video.play(); // video를 재생시킨다.
};
init();

startRecBtn.addEventListener("click", handleStartRec);
