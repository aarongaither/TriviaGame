let movies = [
    'the wizard of oz', 'citizen kane', 'kazaam', 'god father', 'boiler room', 'inception',
    'the dark night', 'raging bull', 'cool runnings', 'harold and maude', 'labyrinth', 'kindergarten cop',
    'the karate kid', 'crocodile dundee', 'overboard', 'troop beverly hills', 'pulp fiction', 'big',
    'coming to america', "romy and michele's high school reunion", 'matilda', 'superstar', 'resevoir dogs', 'big fish',
    'lost in translation', 'snakes on a plane', 'evil dead', 'bubba ho-tep', 'yellow submarine', "a hard day's night",
    'the sandlot', 'beethoven', 'die hard', 'gattaca', 'pitch perfect'
];


let actionMovies = [
    'commando', 'predator', 'die hard', 'conan the destroyer', 'conan the barbarian',
    'the running man', 'total recall', 'mad max', 'the expendables', 'universal soldier',
    'first blood', 'cobra', 'demolition man', 'the terminator', 'bloodsport',
    'battle royale', 'robocop', 'the matrix', 'on deadly ground', 'above the law',
    'escape from new york', 'missing in action', 'the delta force', 'invasion U.S.A.', 'hard target',
    'last action hero', 'executive decision', 'under siege', 'red dawn', 'kickboxer',
    'raw deal', 'lone wolf mcquade', 'code of silence', 'patriot games', 'clear and present danger', 
    'the fifth element', 'true lies', 'the transporter', 'red'
];

let movieList = actionMovies;

function checkMovies(list) {
    for (let i = 0; i < list.length; i++) {
        let title = list[i].replace(/ /g, '+');
        let queryURL = 'http://www.omdbapi.com/?t=' + title + '&y=&plot=short&r=json';
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).done(function(response) {
            console.log(i, title, response.Plot);
        });
    }
} 

let introText = `Welcome to the 'Action Movie Quiz!'
You will be presented with a movie plot.
Your job is to match the plot to the appropriate movie title.
All movies are of the governator action genre.
But be quick. You'll only have 15 seconds to guess for each plot!
All movie plots and images are provided by the OMDBapi,
so if there are inconsistencies or innaccuracies, it ain't my fault!
Click below to begin...`