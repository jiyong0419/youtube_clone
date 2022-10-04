import { async } from "regenerator-runtime";

const videoContainer = document.querySelector("#videoContainer");
const form = document.querySelector("#commentForm");
const span2 = document.querySelector(".video__comment span:last-child");

const addComment = (text) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  const icon = document.createElement("i");
  const span = document.createElement("span");
  const span2 = document.createElement("span");
  newComment.className = "video__comment";
  icon.className = "fas fa-comment";
  span.innerText = ` ${text}`;
  span2.innerText = "❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("#commentForm textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.video_id;
  if (text === "") {
    return;
  }
  const { status } = await fetch(`/api/videos/${videoId}/comment`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });
  //fetch에서 응답받은 response 안에 status가 존재한다
  if (status === 201) {
    addComment(text);
  }
  textarea.value = "";
  // window.location.reload(); // 윈도우가 새로고침됨  === 댓글submit시 실시간으로 댓글창에 반영
};
if (form) {
  form.addEventListener("submit", handleSubmit);
}

span2.addEventListener;
