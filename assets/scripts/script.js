// global variables
const $homeSection = document.getElementById("home");
const $quizSection = document.getElementById("quiz");
const $hiScoresSection = document.getElementById("hi-scores");
const $swapViewLink = document.getElementById("swap-view");
const $quizQuestion = document.getElementById("quizQuestion");
const $quizOptions = document.getElementById("quizOptions");
const $timerSpan = document.getElementById("timer");
const $scoreSpan = document.getElementById("score");
const $HighScoresList = document.getElementById("High-Scores-List");
const QUIZ_TIME_LIMIT = 30;
const WRONG_ANSWER_TIME_PENALTY = 5;
const LOCAL_STORE_HI_SCORE = "Javascript Quiz Hi Scores";
const MAX_NUM_HI_SCORES = 10;

var score = { correct: 0, answered: 0 };
var HighScores = [];



// **********************************************************
//  code to interface with the local storage of high score.
// **********************************************************
function hashScore() {
    c = score.correct;
    a = score.answered;
    kc = 1.2;
    return kc * c - a / c;
}

function loadHighScores() {
    HighScores = JSON.parse(localStorage.getItem(LOCAL_STORE_HI_SCORE));
    if (HighScores === null) {
        HighScores = [];
    }
}

function saveHighScores() {
    localStorage.setItem(LOCAL_STORE_HI_SCORE, JSON.stringify(HighScores));
}



// **********************************************************
//  code to run the quiz
// **********************************************************

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function printQuestion(index) { // index into the quiz questions array
    questionObject = quizQuestions[index]
        // update the display
    $quizQuestion.innerText = questionObject.question;

    $quizOptions.innerHTML = "";

    const options = shuffle(questionObject.options);
    options.forEach(opt => {
        var li = document.createElement("li");
        li.innerText = opt;
        $quizOptions.appendChild(li);
    })
}

function finishQuiz() {
    loadHighScores(); // update the HighScores Variable
    let hs = hashScore(); // hash the current score

    // candidate for HighScore?
    if (HighScores.length < MAX_NUM_HI_SCORES) { // is a HighScore by default
        candidateHighScore = true;
    } else {
        // HighScores array is full, check the last value
        // get the hashscore for the last item in the High Scores
        let lastHShs = HighScores[HighScores.length - 1].hs;
        if (hs > lastHShs) {
            candidateHighScore = true;
        }
    }

    // dialog with the user, different dialog options based on 
    // candidate High score or not.
    var promptText = "";
    if (candidateHighScore) {
        promptText = `Congratulations, your score of ${score.correct} correct of ${score.answered} answered qualifies for a High Score! Enter your name for the High Scores, or press Cancel to skip.`
        if (HighScoreName = window.prompt(promptText)) {
            updateHighScores(hs, HighScoreName);
            updateMainContent('hi-scores');
        } else {

        }
    } else {
        promptText = `You scored of ${score.correct} correct of ${score.answered}. Unfortunately this does not qualify for a High Score.
        Press OK to see High Scores, or Cancel to go back to start page`;
        if (window.confirm(promptText)) {
            updateMainContent('hi-scores');
        } else {
            updateMainContent('home');
        }
    }
}

function updateHighScores(hshash, hsname) {
    //  add the quiz high score data to the HiScores array,
    // sort the array and reduce the length to max number of elements
    //    (this will pop the last element)
    HighScores.push({
        hs: hshash,
        name: hsname,
        correct: score.correct,
        answered: score.answered,
    });

    HighScores.sort((e1, e2) => { return e2.hs - e1.hs; });

    if (HighScores.length >= MAX_NUM_HI_SCORES) {
        HighScores.pop();
    }

    saveHighScores();
}




function runQuiz() {
    // shuffle the questions before starting
    quizQuestions = shuffle(quizQuestions);
    score.correct = 0;
    score.answered = 0;

    // timer
    //  updates the boolRunQuiz to stop 
    let timeRemaining = QUIZ_TIME_LIMIT; // seconds
    const updateFreq = 100 // milliseconds

    var timerInterval = setInterval(function() {
        timeRemaining = timeRemaining - updateFreq / 1000;
        $timerSpan.innerText = Math.floor(timeRemaining);
        if (timeRemaining < 0) {
            clearInterval(timerInterval);
            $timerSpan.innerText = "Out of time";
            // remove the listener on the answers
            $quizOptions.removeEventListener("click", selectAnswer);
            // run the prompts for high scores
            finishQuiz();
            return;
        }
    }, updateFreq);


    // while loop 
    // check the quiz answer clicked
    var questionIndex = 0;
    questionObject = quizQuestions[questionIndex];
    printQuestion(questionIndex);

    function selectAnswer(e) {
        // update score
        score.answered++;
        // should be check target is an <li>
        if (e.target.innerText == questionObject.answer) {
            score.correct++;
        } else {
            // time penalty for incorrect answer
            timeRemaining = timeRemaining - WRONG_ANSWER_TIME_PENALTY;
        }
        $scoreSpan.innerText = `${score.correct} from ${score.answered}`

        questionIndex++;
        printQuestion(questionIndex);

        // bug here: if the user runs out of questions before the timer finishes, any additions
        // clicks will register as an "answered++"

    }

    $quizOptions.addEventListener("click", selectAnswer);
}

// **********************************************************
//  code to flip the visibility of the sections
// **********************************************************

function printHighScores() {

    $HighScoresList.innerHTML = ""; // clear the current list

    if (HighScores.length === 0) {
        $HighScoresList.innerText = "No Scores Recorded";
    } else {

        HighScores.forEach(e => {
            var li = document.createElement("li");
            li.innerText = `${e.name} : ${e.correct} correct from  ${e.answered} answered`;
            $HighScoresList.appendChild(li);
        })
    }
}



function updateMainContent(mode) {
    switch (mode) {
        case 'home':
            $homeSection.style.display = "block";
            $quizSection.style.display = "none";
            $hiScoresSection.style.display = "none";
            $swapViewLink.innerText = "View Hi-Scores"
            $swapViewLink.setAttribute("onclick", "updateMainContent('hi-scores');")
            break;


        case 'quiz':
            // change the displays and run the quiz
            $homeSection.style.display = "none";
            $quizSection.style.display = "block";
            $hiScoresSection.style.display = "none";
            $swapViewLink.innerText = "View Home"
            $swapViewLink.setAttribute("onclick", "updateMainContent('home');")
            runQuiz();

            break;

        case 'hi-scores':
            $homeSection.style.display = "none";
            $quizSection.style.display = "none";
            $hiScoresSection.style.display = "block";
            $swapViewLink.innerText = "View Home"
            $swapViewLink.setAttribute("onclick", "updateMainContent('home');")
            printHighScores();
            break;
    }
}

// attach the event listeners
// start the quiz
document.getElementById("start-quiz").addEventListener("onClick",
    () => { updateMainContent('quiz') });

document.addEventListener("DOMContentLoaded", function() {
    updateMainContent('home');
    loadHighScores();
});