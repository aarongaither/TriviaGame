//game object
go = {
    state: 'start', //game state
    qUsed: [], //used questions
    answers: [], //potential answers for current question
    curA: '', //correct answer
    numberCorrect: 0, //number of answers user has guessed
    numberWrong: 0, //number of answers user has failed to guess
    quizLength: 10, //number of questions to ask
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

        function fetchMovie() {
            //fetch movie info from API
            let title = go.curA.replace(/ /g, '+');
            let queryURL = 'https://www.omdbapi.com/?t=' + title + '&y=&plot=short&r=json';
            $.ajax({
                url: queryURL,
                method: 'GET'
            }).done(function(response) {
                //re-make question HTML
                dom.makeQuestionPage(response);
                //store the fetch result for use later
                go.curQ = response;
                //update game state
                go.state = 'playing';
                //perform css anim on question, slight delay to ensure transition effect
                setTimeout(() => { dom.animateQuestion(); }, 500);
                //start the timer, after text has displayed
                setTimeout(() => { to.start(to.questionLimit); }, response.Plot.length * 50);
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
    start: function(limit) {
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
    makeQuestionPage: function(movieObj) {
        function updatePage(movieObj) {
            //updates page with question text and answer text
            let q = movieObj.Plot;
            for (let i = 0; i < q.length; i++) {
                $('#question').append($('<span>').addClass('qLet').text(q.charAt(i)));
            };
            // $('#question').text(movieObj.Plot);
            for (let i = 0; i < go.answers.length; i++) {
                $('#' + i).text(go.answers[i]);
            }
        }
        //remove results page if it was displayed
        $('section').remove();
        $('img').remove();
        //create timer and score
        $('#main').append($('<section>').addClass('row qRow').attr('id', 'timerRow'));
        $('#timerRow').append($('<div>').addClass('timer').text('Time Remaining: ').append($('<span>').attr('id', 'timer')));
        $('#timerRow').append($('<div>').addClass('score').text('Score: ').append($('<span>').attr('id', 'score').text(go.numberCorrect)));
        //create question row
        $('#main').append($('<section>').addClass('row qRow').attr('id', 'questionRow'));
        $('#questionRow').append($('<div>').addClass('question').attr('id', 'question'));
        //create answer row
        $('#main').append($('<section>').addClass('row qRow').attr('id', 'answerRow'));
        for (let i = 0; i < 4; i++) {
            let answerDiv = $('<div>').addClass('answer').attr('id', i)
                .click(function() { go.checkAnswer(this.id); });
            $('#answerRow').append(answerDiv);
        }
        updatePage(movieObj);
    },
    makeEndingPage: function() {
        $('section').remove();
        $('img').remove();
        let resultSec = $('<section>').addClass('row');
        $('#main').append(resultSec);
        let percRight = go.numberCorrect / go.quizLength * 100;
        let msg;
        let gif;
        if (percRight < 30) {
            msg = "You didn't even try.";
            gif = "awful";
        } else if (percRight < 50) {
            msg = 'Better luck next time!';
            gif = 'meh';
        } else if (percRight < 90) {
            msg = 'Good job!';
            gif = 'good+job';
        } else {
            msg = "You're an expert!";
            gif = 'amazing';
        }
        resultSec.append($('<p>').text(msg));
        resultSec.append($('<p>').text('Correct: ' + go.numberCorrect));
        resultSec.append($('<p>').text('Wrong: ' + go.numberWrong));
        resultSec.append($('<p>').text("That's " + percRight + '% correct!'));
        resultSec.append($('<button>').text("Restart")
            .click(function() { go.init(); })
        )
        //giphy cause why not
        var queryURL = "https://api.giphy.com/v1/gifs/search?q="+gif+"&limit=1&api_key=dc6zaTOxFJmzC";
        $.ajax({
          url: queryURL,
          method: 'GET'
        }).done(function(response) {
            console.log(response);
            resultSec.append($('<img>').attr('src', response.data[0].images.downsized.url));
        });
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
    },
    animateQuestion: function() {
        $('.qLet').each(function(index, value) {
            let elem = $(this);
            let del = index * 50;
            setTimeout(() => { elem.addClass('blockEffect'); }, del);
            setTimeout(() => { elem.addClass('transText'); }, del + 200);
        })

    }
}

//make start page with start button
//after start button is clicked, game starts
//after game start all logic is driven off click listeners and the checkAnswer func
dom.makeStartPage();
