const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let productId = null; // 상품 ID 저장하는 변수
let userMessage = null; // 사용자 메시지 저장하는 변수
const API_KEY = ""; // API키
const inputInitHeight = chatInput.scrollHeight;

// 초기 화면 띄우기 함수
function showChatbot() {
  document.body.classList.add("show-chatbot");
  greetUser();
}

// 페이지 로딩 후 자동으로 초기 화면 띄우기
window.addEventListener("load", showChatbot);

const createChatLi = (message, className) => {
  // 받은 메세지랑 className가지고 채팅 <li> 요소 만들기
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", `${className}`);
  let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi; // 채팅 <li>요소 반환
};

// TTS 엔진 초기화
const synth = window.speechSynthesis;

// 환영 메시지 음성 출력 함수
function greetUser() {
  const welcomeMessage = "안녕하세요. 소담입니다. 무엇을 도와드릴까요?";
  if (synth && welcomeMessage) {
    const utterance = new SpeechSynthesisUtterance(welcomeMessage);
    utterance.rate = 1.5; // Adjust the rate to make it faster (e.g., 1.5 for 1.5x speed)
    synth.speak(utterance);
  }
}

function speakAskForInput() {
  const message = "네, 말씀하세요.";

  if (synth && message) {
    const chatbox = document.querySelector(".chatbox");

    // Create a new incoming chat message similar to the server response
    const newIncomingLi = createChatLi("네, 말씀하세요.", "incoming");
    chatbox.appendChild(newIncomingLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1.5;
    synth.speak(utterance);
  }
}

// 서버 응답을 TTS로 읽어주는 함수
function speakResponse(message) {
  if (synth && message) {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1.5;
    synth.speak(utterance);
  }
}

const generateResponse = () => {
  // "로딩중" 메시지 추가
  const loadingLi = createChatLi("로딩중", "incoming");
  chatbox.appendChild(loadingLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);
  const API_URL = "http://localhost:5000/query";

  // "로딩중" 메시지 TTS로 읽어주기
  speakResponse("로딩 중");

  // API 요청에 대한 속성과 메세지 정의
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: userMessage, // 사용자가 입력한 메시지를 보냅니다.
      product_id: productId, // 상품 ID를 보냅니다.
    }),
  };

  // API에 POST 요청 보내서 응답
  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.productId);
      if (data.product_id) {
        productId = data.product_id;
      }
      const responseMessage = data.answer;

      if (responseMessage) {
        const responseLi = createChatLi(responseMessage, "incoming");
        chatbox.appendChild(responseLi);

        // 서버 응답을 TTS로 읽어줌
        speakResponse(responseMessage);
      }

      chatbox.scrollTo(0, chatbox.scrollHeight);
    })
    .catch((error) => {
      console.error("Error during fetch:", error);
    });

  // .catch(() => {
  //   const errorLi = createChatLi("다시 입력해주세요.", "incoming error");
  //   chatbox.appendChild(errorLi);
  //   chatbox.scrollTo(0, chatbox.scrollHeight);
  // });
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

sendChatBtn.addEventListener("click", handleChat);

// closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
// chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

document.body.addEventListener("touchstart", function (event) {
  if (!recognition) {
    // recognition이 초기화되지 않았으면 초기화
    initializeSpeechRecognition();
  }

  const chatbox = document.querySelector(".chatbox");

  if (event.target === document.getElementById("startButton")) {
    event.stopPropagation();
  } else if (!chatbox.contains(event.target)) {
    // 터치 이벤트가 채팅 내용 외부에서는 무시
    event.preventDefault();
  }
});

chatbox.addEventListener("touchstart", function (event) {
  // .chatbox 내에서의 터치 이벤트를 처리
  // 스크롤을 허용하도록 할 수 있음
});

// 클릭 이벤트를 처리하는 이벤트 리스너
document.body.addEventListener("click", () => {
  // 클릭하면 음성 메시지 출력
  speakAskForInput();
  if (!recognition) {
    // recognition이 초기화되지 않았으면 초기화
    initializeSpeechRecognition();
  }
  const chatbox = document.querySelector(".chatbox");
  if (!chatbox.contains(event.target)) {
    event.preventDefault();
  }
});
