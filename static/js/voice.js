const startButton = documnet.getElementById("startButton");
const resultDiv = document.getElementById("resultDiv");
let recognition;

function initializeSpeechRecognition(){
    recognition = new webkitSpeechRecognition();
    recognition.lang = 'ko-KR';

    recognition.onrewult = 
}