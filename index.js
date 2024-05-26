

function toggle()
{
    document.body.dataset.open = document.body.dataset.open === "true" ? "false" : "true";

    console.log(document.body.dataset.open);
}

const gameTxt = document.getElementsByClassName("game-subtitle")[0];

const createWord = (text , index) =>
{
    const word = document.createElement("span");
    word.innerHTML = `${text}`;
    word.classList.add("card-subtitle-word");
    word.style.transitionDelay = `${index * 40}ms`;
    return word;
}

const addWord1 = (text , index) => gameTxt.appendChild(createWord(text , index));

const createSubtitle1 = text => text.split(" ").map(addWord1);

createSubtitle1("Jump into the gameplay");

const leaderboardTxt = document.getElementsByClassName("leaderboard-subtitle")[0];



const addWord2 = (text , index) => leaderboardTxt.appendChild(createWord(text , index));

const createSubtitle2 = text => text.split(" ").map(addWord2);

createSubtitle2("Jump into the rankings");


let sentenceS = "Test your puzzle solving";
let snake = document.getElementById('snake');
let sentenceP = "Test your reflexes";
let pong = document.getElementById('pong');

let sentenceT = "Test your decision-making";
let tic = document.getElementById('tic');

let sentence2 = "Test your strategy";
let t2048 = document.getElementById('t2048');

const addWordS = (text , index) => snake.appendChild(createWord(text , index));

const addWordP = (text , index) => pong.appendChild(createWord(text , index));

const addWordT = (text , index) => tic.appendChild(createWord(text , index));

const addWord2048 = (text , index) => t2048.appendChild(createWord(text , index));

const createSubtitleS = text => text.split(" ").map(addWordS);

const createSubtitleP = text => text.split(" ").map(addWordP);

const createSubtitleT = text => text.split(" ").map(addWordT);

const createSubtitle2048 = text => text.split(" ").map(addWord2048);

createSubtitleS(sentenceS);
createSubtitleP(sentenceP);
createSubtitle2048(sentence2);
createSubtitleT(sentenceT);


