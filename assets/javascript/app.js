function makeHTML() {
    $('#questionRow').append($('<div>').addClass('question').attr('id', 'question').text('question goes here'));
    for (let i = 0; i < 4; i++) {
        let answerDiv = $('<div>').addClass('answer').attr('id', i).text('answer ' + i);
        answerDiv.click(function() { checkAnswer(this.id); });
        $('#answerRow').append(answerDiv);
    }
}

function updatePage(q) {
    $('#question').text(q.q);
    for (let i = 0; i < q.answers.length; i++) {
        $("#"+i).text(q.answers[i]);
    }
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getQuestion() {
	function arrShuff(arr){
	  tempArr = []
	  let cnt = arr.length;
	  for (let i = 0; i < cnt; i++){
	    let x = Math.floor(Math.random() * arr.length);
	    let item = arr.splice(x, 1);
	    tempArr.push(item[0]);
	  }
	  return tempArr;
	}
    let rand = getRandom(0, qList.length);
    console.log(rand);
    if (qsUsed.indexOf(rand) === -1) {
        qsUsed.push(rand);
        let qToReturn = qList[rand];
        qToReturn.answers = arrShuff(qToReturn.answers);
        return qToReturn;
    } else {
        getQuestion();
    }
}

let qsUsed = [];

function checkAnswer(num) {
    console.log(num)
    ans = curQ.answers[num]
    if (ans === curQ.correctAnswer) {
        console.log("correct!");
    } else {
        console.log("Wrong!");
    }
}

makeHTML();
let curQ = getQuestion();
updatePage(curQ);
