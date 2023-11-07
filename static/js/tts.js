// TTS 엔진 초기화
const synth = window.speechSynthesis;

// 환영 메시지 음성 출력 함수
function greetUser() {
  const welcomeMessage = "안녕하세요. 소담입니다. 무엇을 도와드릴까요?";
  if (synth && welcomeMessage) {
    const utterance = new SpeechSynthesisUtterance(welcomeMessage);
    synth.speak(utterance);
  }
}

// 페이지 로딩 후 환영 메시지 TTS 실행
window.addEventListener("load", greetUser);
