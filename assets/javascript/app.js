movieList = actionMovies;

function makeQuestionHTML() {
    $('#main').append($('<div>').addClass('row').attr('id','questionRow'));
    $('#main').append($('<div>').addClass('row').attr('id','answerRow'));
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
    answers: [],
    curA: '',
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
        function getRandom(max) {
            return Math.floor(Math.random() * max);
        }

        function updatePage(movieObj) {
            $('#question').text(movieObj.Plot);
            for (let i = 0; i < go.answers.length; i++) {
                $('#' + i).text(go.answers[i]).removeClass('correct wrong');
            }
        }

        function fetchMovie() {
            let title = go.curA.replace(/ /g, '+');
            let queryURL = 'http://www.omdbapi.com/?t=' + title + '&y=&plot=short&r=json';
            $.ajax({
                url: queryURL,
                method: 'GET'
            }).done(function(response) {
                updatePage(response);
                to.start(to.questionLimit);
                go.curQ = response;
                go.state = 'playing';
            });
        }

        //splice 4 answers from main array into game array
        for (let i = 0; i < 4; i++) {
            let rand = getRandom(movieList.length);
            go.answers.push(movieList.splice(rand, 1)[0]);
        }
        //select one answer as the correct one
        console.log('answers', go.answers);
        let rand = getRandom(go.answers.length);
        go.curA = go.answers[rand];
        //fetch movie info for our correct answer
        fetchMovie();

    },
    checkAnswer: function(num) {
        if (this.state === 'playing') {
            this.state = 'guessed'
            to.stop();
            let correctID = this.answers.indexOf(this.curA);
            parseInt(num) === correctID ? this.answerIsCorrect(num) : this.answerIsWrong(num, correctID);
            let cnt = this.answers.length;
            for (let i = 0; i < cnt; i++) {
                let item = this.answers.pop();
                item === this.curA ? this.qUsed.push(item) : movieList.push(item);
            }
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
    resetQuestions: function() {
        let cnt = this.qUsed.length;
        for (let i = 0; i < cnt; i++) {
            movieList.push(this.qUsed.pop())
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

makeQuestionHTML();
go.init();
