(function(){
    //game object
    go = {
        state: 'start', //game state
        qUsed: [], //used questions
        answers: [], //potential answers for current question
        curA: '', //correct answer
        numberCorrect: 0, //number of answers user has guessed
        numberWrong: 0, //number of answers user has failed to guess
        quizLength: 10, //number of questions to ask
        init() {
            //reset game vars
            this.state = 'playing';
            this.numberCorrect = 0;
            this.numberWrong = 0;
            this.resetQuestions();
            this.newQuestion();
        },
        newQuestion() {
            function getRandom(max) {
                return Math.floor(Math.random() * max);
            }

            function fetchMovie() {
                let title = go.curA.replace(/ /g, '+');
                let queryURL = 'https://www.omdbapi.com/?t=' + title + '&y=&plot=short&r=json';
                $.ajax({
                    url: queryURL,
                    method: 'GET'
                }).done(function(response) {
                    dom.makeQuestionPage(response);
                    go.curQ = response;
                    go.state = 'playing';
                    //perform css anim on question, slight delay to ensure transition effect
                    setTimeout(() => dom.animateQuestion(), 500);
                    //start the timer, after text has displayed
                    setTimeout(() => to.start(to.questionLimit), response.Plot.length * 50);
                });
            }

            //splice 4 answers from main array into game array
            for (let i = 0; i < 4; i++) {
                let rand = getRandom(questions.movieList.length);
                go.answers.push(questions.movieList.splice(rand, 1)[0]);
            }

            //select one answer as the correct one
            let rand = getRandom(go.answers.length);
            go.curA = go.answers[rand];

            //fetch movie info for our correct answer
            //also calls rest of game start functions after response
            //so we don't end up out of sync
            fetchMovie();

        },
        checkAnswer(userAnswer) {
            if (this.state === 'playing') {
                this.state = 'guessed';
                to.stop();
                let status;
                if (userAnswer === "Time is up!") {
                    status = userAnswer;
                    this.answerIsWrong();
                } else {
                    const correctID = this.answers.indexOf(this.curA);
                    status = parseInt(userAnswer) === correctID ? this.answerIsCorrect() : this.answerIsWrong();
                }
                const cnt = this.answers.length;
                for (let i = 0; i < cnt; i++) {
                    const item = this.answers.pop();
                    item === this.curA ? this.qUsed.push(item) : questions.movieList.push(item);
                }
                this.numberCorrect + this.numberWrong < this.quizLength ? this.showResult(status) : this.gameOver(status);
            }
        },
        answerIsCorrect() {
            //increment counter, update page display, return response to display on result page
            this.numberCorrect += 1;
            $('#score').text(this.numberCorrect);
            return "Correct!";
        },
        answerIsWrong() {
            //increment counter, return response to display on result page
            this.numberWrong += 1;
            return "Wrong!";
        },
        showResult(status) {
            dom.showAnswerPic(status);
            setTimeout(() => this.newQuestion(), to.switchLimit * 1000);
        },
        resetQuestions() {
            let cnt = this.qUsed.length;
            for (let i = 0; i < cnt; i++) {
                questions.movieList.push(this.qUsed.pop())
            }
        },
        gameOver(status) {
            dom.showAnswerPic(status);
            this.state = 'over';
            setTimeout(() => dom.makeEndingPage(), to.switchLimit * 1000);
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
        count() {
            this.time -= 1;
            this.updateDisplay();
            if (this.time < 1) {
                go.checkAnswer("Time is up!");
            }
        },
        stop() {
            this.running = false;
            clearInterval(this.countID);
        },
        updateDisplay() {
            $('#timer').text(this.time);
        },
        clearDisplay() {
            $('#timer').text('');
        }
    }

    //html and dom object
    let dom = {
        makeStartPage() {
            $('#main').append($('<section>').addClass('row startRow').append($('<p>').text(questions.introText)));
            $('#main').append($('<section>').addClass('row startRow').attr('id', 'buttonRow')
                .append($('<button>').addClass('startBtn').text('Action!')
                    .click(function() {
                        $('section').remove('.startRow');
                        go.init();
                    })
                )
            );
        },
        makeQuestionPage(movieObj) {
            function updatePage(movieObj) {
                //updates page with question text and answer text
                const q = movieObj.Plot;
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
        makeEndingPage() {
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
        showAnswerPic(status) {
            $('section').remove('.qRow');
            let textSec = $('<section>').addClass('row');
            textSec.append($('<p>').text(status));
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
        animateQuestion() {
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
})()