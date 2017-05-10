function makeHTML() {
    $('#questionRow').append($('<div>').addClass('question').attr('id', 'question').text('question goes here'));
    for (let i = 0; i < 4; i++) {
        let answerDiv = $('<div>').addClass('answer').attr('id', i).text('answer ' + i)
            .click(function() { go.checkAnswer(this.id); });
        $('#answerRow').append(answerDiv);
    }
}

//game object
go = {
    state: 'start',
    qUsed: [],
    numberCorrect: 0,
    numberWrong: 0,
    init: function() {
        this.state = 'playing';
        this.numberCorrect = 0;
        this.numberWrong = 0;
        this.resetQuestions();
        this.newQuestion();
    },
    newQuestion: function() {
        console.log("getting new Q...")

        function getQuestion() {
            function arrShuff(arr) {
                tempArr = []
                let cnt = arr.length;
                for (let i = 0; i < cnt; i++) {
                    let x = go.getRandom(arr.length);
                    let item = arr.splice(x, 1);
                    tempArr.push(item[0]);
                }
                return tempArr;
            }
            let rand = go.getRandom(qList.length);
            let qToReturn = qList.splice(rand, 1)[0];
            qToReturn.answers = arrShuff(qToReturn.answers);
            return qToReturn;
        }

        function updatePage(quesObj) {
            $('#question').text(quesObj.q);
            for (let i = 0; i < quesObj.answers.length; i++) {
                $('#' + i).text(quesObj.answers[i]).removeClass('correct wrong');
            }
        }
        this.curQ = getQuestion();
        updatePage(this.curQ);
        to.start(to.questionLimit);
    },
    checkAnswer: function(num) {
        if (this.state === 'playing') {
            to.stop();
            let correctID = this.curQ.answers.indexOf(this.curQ.correctAnswer);
            parseInt(num) === correctID ? this.answerIsCorrect(num) : this.answerIsWrong(num, correctID);
            this.qUsed.push(this.curQ);
            this.numberCorrect + this.numberWrong < 10 ? setTimeout(() => { this.newQuestion(); }, 2000) : this.gameOver();
        }
    },
    answerIsCorrect: function(answerID) {
        this.numberCorrect += 1;
        $('#score').text(this.numberCorrect);
        $('#' + answerID).addClass('correct');
    },
    answerIsWrong: function(answerID, rightAnswerID) {
        this.numberWrong += 1;
        $('#' + answerID).addClass('wrong');
        $('#' + rightAnswerID).addClass('correct');
    },
    getRandom: function(max) {
        return Math.floor(Math.random() * max);
    },
    resetQuestions: function() {
        let cnt = this.qUsed.length;
        for (let i = 0; i < cnt; i++) {
            qList.push(this.qUsed.pop())
        }
    },
    gameOver: function() {
        this.state = 'over';
        console.log('Game Over. Number Correct: ' + this.numberCorrect + ', Number Wrong: ' + this.numberWrong)
    }
}

//timer object
to = {
    running: false,
    countID: '',
    time: 0,
    questionLimit: 10,
    switchLimit: 4,
    start: function(limit, type) {
        if (!this.running) {
            this.running = true;
            this.time = limit;
            this.updateDisplay();
            this.countID = setInterval(() => {
                this.count();
            }, 1000);
        }
    },
    count: function() {
        this.time -= 1;
        this.updateDisplay();
        if (this.time < 1) {
            go.checkAnswer(4);
        }
    },
    stop: function() {
        this.running = false;
        clearInterval(this.countID);
    },
    updateDisplay: function() {
        $('#timer').text(this.time);
    },
    clearDisplay: function() {
        $('#timer').text('');
    }
}

makeHTML();
go.init();
