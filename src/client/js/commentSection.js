import { async } from "regenerator-runtime";

const videoContainer = document.querySelector("#videoContainer");
const form = document.querySelector("#commentForm");
const span2 = document.querySelector(".video__comment span:last-child");

const videoId = videoContainer.dataset.video_id;

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  const icon = document.createElement("i");
  const span = document.createElement("span");
  const span2 = document.createElement("span");
  newComment.className = "video__comment";
  newComment.dataset.id = id; // fake comment에 data-id 속성 추가
  icon.className = "fas fa-comment";
  span.innerText = ` ${text}`;
  span2.innerText = "❌";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment); //prepend는 element를 제일 처음으로 넣어준다, appendchild는 제일 마지막에 넣어준다
};

const handleDelete = async (event) => {
  event.preventDefault();
  const target = event.target.parentNode;
  target.remove();
  await fetch(`/api/videos/${videoId}/comment/delete`, {
    mothod: "delete",
  });
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // 우리가 body를 통해 보내는것이 일반적인 string이 아니라 JSON에 의해 처리되어야하는 string이라는것을 알려주어야한다.
    },
    body: JSON.stringify({ text }), //JSON.stringify()는 json(객체)을 받아서 string으로 돌려줌 , 그냥 body: {text}를 하면 [object][object]가 리턴됨
  });
  //fetch에서 응답받은 response를 status에 담는다
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json(); // videoController.js에서 createComment컨트롤러에서 newCommentId가 담긴 json을 resposne했다, 그 json을 받아서 (response.json()) newCommentId를 추출한다
    addComment(text, newCommentId); // videoController.js에서 createComment컨트롤러에서 response할때 status 코드를 포함시킨다.
  }
  // window.location.reload(); // 윈도우가 새로고침됨  === 댓글submit시 실시간으로 댓글창에 반영
};
if (form) {
  form.addEventListener("submit", handleSubmit);
  if (span2) {
    span2.addEventListener("click", handleDelete);
  }
}
