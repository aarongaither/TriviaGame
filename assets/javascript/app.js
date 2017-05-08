function makeHTML() {
    $('#questionRow').append($('<div>').addClass('question').attr('id', 'question').text('question goes here'));
    for (let i = 0; i < 4; i++) {
        let answerDiv = $('<div>').addClass('answer').attr('id', i).text('answer ' + i);
        answerDiv.click(function() { checkAnswer(this.id); });
        $('#answerRow').append(answerDiv);
    }
}

function getRandom(max) {
    return Math.floor(Math.random() * max);
}

function newQuestion() {

    function getQuestion() {

        function arrShuff(arr) {
            tempArr = []
            let cnt = arr.length;
            for (let i = 0; i < cnt; i++) {
                let x = getRandom(arr.length);
                let item = arr.splice(x, 1);
                tempArr.push(item[0]);
            }
            return tempArr;
        }
        let rand = getRandom(qList.length);
        let qToReturn = qList.splice(rand, 1)[0];
        qToReturn.answers = arrShuff(qToReturn.answers);
        return qToReturn;
    }

    function updatePage(q) {
        $('#question').text(q.q);
        for (let i = 0; i < q.answers.length; i++) {
            $("#" + i).text(q.answers[i]);
        }
    }

    curQ = getQuestion();
    if (curQ !== undefined){
    	updatePage(curQ);
    }

}

let curQ;
let numberCorrect = 0;
let numberWrong = 0;

function checkAnswer(num) {
    ans = curQ.answers[num]
    if (ans === curQ.correctAnswer) {
        numberCorrect += 1;
    } else {
        numberWrong += 1;
    }

    if (numberCorrect + numberWrong < 10) {
	    newQuestion();
    } else {
    	console.log("Game Over. Number Correct: " + numberCorrect + ", Number Wrong: " + numberWrong)
    }

}

makeHTML();
newQuestion();
