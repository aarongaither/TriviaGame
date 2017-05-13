//game object
go = {
    state: 'start',         //game state
    qUsed: [],              //used questions
    answers: [],            //potential answers for current question
    curA: '',               //correct answer
    numberCorrect: 0,       //number of answers user has guessed
    numberWrong: 0,         //number of answers user has failed to guess
    quizLength: 5,          //number of questions to ask
    init: function() {
        //reset game vars
        this.state = 'playing';
        this.numberCorrect = 0;
        this.numberWrong = 0;
        this.resetQuestions();
        //get first question, which effectively starts the game
        this.newQuestion();
    },
    newQuestion: function() {
        function getRandom(max) {
            return Math.floor(Math.random() * max);
        }

        function updatePage(movieObj) {
            //updates page with question text and answer text
            $('#question').text(movieObj.Plot);
            for (let i = 0; i < go.answers.length; i++) {
                $('#' + i).text(go.answers[i]).removeClass('correct wrong');
            }
        }

        function fetchMovie() {
            //fetch movie info from API
            let title = go.curA.replace(/ /g, '+');
            let queryURL = 'https://www.omdbapi.com/?t=' + title + '&y=&plot=short&r=json';
            $.ajax({
                url: queryURL,
                method: 'GET'
            }).done(function(response) {
                //re-make question HTML
                dom.makeQuestionHTML();
                //update page with movie info
                updatePage(response);
                //start the timer
                to.start(to.questionLimit);
                //store the fetch result for use later
                go.curQ = response;
                //update game state
                go.state = 'playing';
            });
        }

        //splice 4 answers from main array into game array
        for (let i = 0; i < 4; i++) {
            let rand = getRandom(movieList.length);
            go.answers.push(movieList.splice(rand, 1)[0]);
        }

        //select one answer as the correct one
        let rand = getRandom(go.answers.length);
        go.curA = go.answers[rand];

        //fetch movie info for our correct answer
        //also calls rest of game start functions after response
        //so we don't end up out of sync
        fetchMovie();

    },
    checkAnswer: function(userAnswer) {
        //user has clicked an answer, change state so no more answers can be clicked
        if (this.state === 'playing') {
            this.state = 'guessed';
            //stop the timer
            to.stop();
            let status;
            if (userAnswer === "Time is up!") {
                status = userAnswer;
                this.answerIsWrong();
            } else {
                //determine the array index of the correct answer
                let correctID = this.answers.indexOf(this.curA);
                //compare correct index with one received from click
                status = parseInt(userAnswer) === correctID ? this.answerIsCorrect() : this.answerIsWrong();
            }
            //loop through potential answers
            //if the correct answer, push to used list, else return to master list for re-use
            let cnt = this.answers.length;
            for (let i = 0; i < cnt; i++) {
                let item = this.answers.pop();
                item === this.curA ? this.qUsed.push(item) : movieList.push(item);
            }
            this.numberCorrect + this.numberWrong < this.quizLength ? this.showResult(status) : this.gameOver(status);
        }
    },
    answerIsCorrect: function() {
        //increment counter, update page display, return response to display on result page
        this.numberCorrect += 1;
        $('#score').text(this.numberCorrect);
        return "Correct!";
    },
    answerIsWrong: function() {
        //increment counter, return response to display on result page
        this.numberWrong += 1;
        return "Wrong!";
    },
    showResult: function(sts) {
        dom.showAnswerPic(sts);
        setTimeout(() => { this.newQuestion(); }, to.switchLimit * 1000);
    },
    resetQuestions: function() {
        let cnt = this.qUsed.length;
        for (let i = 0; i < cnt; i++) {
            movieList.push(this.qUsed.pop())
        }
    },
    gameOver: function(sts) {
        dom.showAnswerPic(sts);
        this.state = 'over';
        setTimeout(() => { dom.makeEndingPage(); }, to.switchLimit * 1000);
    }
}

//timer object
to = {
    running: false,
    countID: '',
    time: 0,
    questionLimit: 15,
    switchLimit: 5,
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
            go.checkAnswer("Time is up!");
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

//html and dom object
let dom = {
    makeStartPage: function() {
        $('#main').append($('<section>').addClass('row startRow').append($('<p>').text(introText)));
        $('#main').append($('<section>').addClass('row startRow').attr('id', 'buttonRow')
            .append($('<button>').addClass('startBtn').text('Action!')
                .click(function() {
                    $('section').remove('.startRow');
                    go.init();
                })
            )
        );
    },
    makeQuestionHTML: function() {
        $('section').remove();
        $('img').remove();
        $('#main').append($('<section>').addClass('row qRow').attr('id', 'timerRow'));
        $('#timerRow').append($('<div>').addClass('timer').text('Time Remaining: ').append($('<span>').attr('id', 'timer')));
        $('#timerRow').append($('<div>').addClass('score').text('Score: ').append($('<span>').attr('id', 'score').text(go.numberCorrect)));
        $('#main').append($('<section>').addClass('row qRow').attr('id', 'questionRow'));
        $('#main').append($('<section>').addClass('row qRow').attr('id', 'answerRow'));
        $('#questionRow').append($('<div>').addClass('question').attr('id', 'question').text('question goes here'));
        for (let i = 0; i < 4; i++) {
            let answerDiv = $('<div>').addClass('answer').attr('id', i).text('answer ' + i)
                .click(function() { go.checkAnswer(this.id); });
            $('#answerRow').append(answerDiv);
        }
    },
    makeEndingPage: function() {
        $('section').remove();
        $('img').remove();
        let resultSec = $('<section>').addClass('row');
        $('#main').append(resultSec);
        let numRight = go.numberCorrect;
        let msg = '';
        if (numRight < 5) {
            msg = 'Better luck next time!';
        } else if (numRight < 9) {
            msg = 'Good job!';
        } else {
            msg = "You're an expert!";
        }
        resultSec.append($('<p>').text(msg));
        resultSec.append($('<p>').text('Correct: ' + go.numberCorrect));
        resultSec.append($('<p>').text('Wrong: ' + go.numberWrong));
        let percRight = go.numberCorrect / go.quizLength * 100;
        resultSec.append($('<p>').text("That's " + percRight + '% correct!'));
        resultSec.append($('<button>').text("Restart")
            .click(function() { go.init(); })
        )
    },
    showAnswerPic: function(sts) {
        $('section').remove('.qRow');
        let textSec = $('<section>').addClass('row');
        textSec.append($('<p>').text(sts));
        textSec.append($('<p>').text("The right answer was " + go.curA + '.'));
        $('#main').append(textSec);
        $('#main').append($('<img>').attr('src', go.curQ.Poster));
        let detSec = $('<section>').addClass('row');
        $('#main').append(detSec);
        let movieAtt = ['Director', 'Year', 'Rated', 'Released', 'Runtime'];
        for (let i = 0; i < movieAtt.length; i++) {
            let item = movieAtt[i];
            detSec.append($('<p>').addClass('detail').text(item + ': ' + go.curQ[item]));
        }
    }
}

//make start page with start button
//after start button is clicked, game starts
//after game start all logic is driven off click listeners and the checkAnswer func
dom.makeStartPage();
