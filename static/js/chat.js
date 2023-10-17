const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // 사용자 메시지 저장하는 변수
const API_KEY = ""; // API키
const inputInitHeight = chatInput.scrollHeight;

// 초기 화면 띄우기 함수
function showChatbot() {
  document.body.classList.add("show-chatbot");
}

// 페이지 로딩 후 자동으로 초기 화면 띄우기
window.addEventListener("load", showChatbot);

const createChatLi = (message, className) => {
  // 받은 메세지랑 className가지고 채팅 <li> 요소 만들기
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", `${className}`);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi; // 채팅 <li>요소 반환
};

const generateResponse = (chatElement) => {
  const API_URL = "http://testdongho.kro.kr:5000/query";

  // API 요청에 대한 속성과 메세지 정의
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: userMessage, // 사용자가 입력한 메시지를 보냅니다.
    }),
  };

  // API에 POST 요청 보내서 응답
  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      // 서버 응답에서 추출한 answer 메시지
      const responseMessage = data.answer;

      // messageElement에 응답 메시지를 설정
      chatElement.querySelector("p").textContent = responseMessage.trim();

      // 화면 스크롤 조정
      chatbox.scrollTo(0, chatbox.scrollHeight);
    })
    .catch(() => {
      chatElement.querySelector("p").classList.add("error");
      chatElement.querySelector("p").textContent = "다시 입력해주세요.";
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
  userMessage = chatInput.value.trim(); // 사용자가 입력한 메시지 입력하고 공간 제거
  if (!userMessage) return;

  // 입력한 텍스트 영역 지우고 높이 기본값으로 설정
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // 사용자 메시지를 CHATBOX에 추가
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    // 로딩중
    const incomingChatLi = createChatLi("로딩중", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  });
};

chatInput.addEventListener("input", () => {
  // 내용에 따라 입력 텍스트 영역의 높이 조정
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  // If Enter key is pressed without Shift key and the window
  // width is greater than 800px, handle the chat
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

generateResponse();
sendChatBtn.addEventListener("click", handleChat);

// closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
// chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
