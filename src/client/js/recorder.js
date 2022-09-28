const startRecBtn = document.querySelector("#startRecBtn");

const handleStartRec = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  console.log(stream);
};

startRecBtn.addEventListener("click", handleStartRec);
