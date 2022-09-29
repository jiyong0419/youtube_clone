const startRecBtn = document.querySelector("#startRecBtn");
const video = document.querySelector("#preview");

const handleStartRec = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 300, height: 200 },
  });
  console.log(stream);
  video.srcObject = stream;
  video.play();
};

startRecBtn.addEventListener("click", handleStartRec);
