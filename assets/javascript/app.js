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
	state: "start",
    qUsed: [],
    numberCorrect: 0,
    numberWrong: 0,
    newQuestion: function() {

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
                $("#" + i).text(quesObj.answers[i]);
            }
        }

        this.curQ = getQuestion();
        updatePage(this.curQ);
        to.start(to.questionLimit);

    },
    checkAnswer: function(num) {
        if (this.state === "playing") {
            to.stop();
            ans = this.curQ.answers[num]
            if (ans === this.curQ.correctAnswer) {
                this.numberCorrect += 1;
            } else {
                this.numberWrong += 1;
            }
            this.qUsed.push(this.curQ);
            if (this.numberCorrect + this.numberWrong < 10) {
                this.newQuestion();
            } else {
            	this.state = "over";
                console.log("Game Over. Number Correct: " + this.numberCorrect + ", Number Wrong: " + this.numberWrong)
            }
        }
    },
    getRandom: function(max) {
        return Math.floor(Math.random() * max);
    }
}

//timer object
to = {
    running: false,
    countID: "",
    time: 0,
    questionLimit: 10,
    switchLimit: 4,
    start: function(limit) {
        if (!this.running) {
            this.running = true;
            this.time = limit;
            this.updateDisplay();
            this.countID = setInterval(function() {
                to.count();
            }, 1000);
        }
    },
    count: function() {
        this.time -= 1;
        this.updateDisplay();
        if (this.time < 1) {
            this.stop();
            //game logic tie in here
        }
    },
    stop: function() {
        this.running = false;
        clearInterval(this.countID);
    },
    updateDisplay: function() {
        $('#timer').text(this.time);
    }
}

makeHTML();
go.state = "playing";
go.newQuestion();
