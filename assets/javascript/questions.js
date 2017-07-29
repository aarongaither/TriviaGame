const questions = (function(){

    const introText = `Welcome to the 'Action Movie Quiz!'
    You will be presented with a movie plot.
    Your job is to match the plot to the appropriate movie title.
    All movies are of the governator action genre.
    But be quick. You'll only have 15 seconds to guess for each plot!
    All movie plots and images are provided by the OMDBapi,
    so if there are inconsistencies or innaccuracies, it ain't my fault!
    Click below to begin...`

    const movieList = [
        {
            title: 'commando',
            poster: 'commando.jpg',
            director: 'Mark L. Lester',
            year: '1985',
            rated: '6.7',
            runtime: '1h 30min',
            plot: 'A retired elite Black Ops Commando launches a one man war against a group of South American criminals who have kidnapped his daughter.'
        },
        {
            title: 'predator',
            poster: 'predator.jpg',
            director: 'John McTiernan',
            year: '1987',
            rated: '7.8',
            runtime: '1h 47min',
            plot: 'A team of commandos on a mission in a Central American jungle find themselves hunted by an extraterrestrial warrior.'
        },
        {
            title: 'die hard',
            poster: 'die-hard.jpg',
            director: 'John McTiernan',
            year: '1988',
            rated: '8.2',
            runtime: '2h 11min',
            plot: 'John McClane, officer of the NYPD, tries to save his wife Holly Gennaro and several others that were taken hostage by German terrorist Hans Gruber during a Christmas party at the Nakatomi Plaza in Los Angeles.'
        },
        {
            title: 'conan the destroyer',
            poster: 'conan-the-destroyer.jpg',
            director: 'Richard Fleischer',
            year: '1984',
            rated: '5.9',
            runtime: '1h 43min',
            plot: 'Conan leads a ragtag group of adventurers on a quest for a princess.'
        },
        {
            title: 'conan the barbarian',
            poster: 'conan-the-barbarian.jpg',
            director: 'John Millius',
            year: '1982',
            rated: '6.9',
            runtime: '2h 9min',
            plot: 'A barbarian warrior sets off to avenge his parents and his tribe whom were slain by an evil sorcerer and his henchmen when he was a boy.'
        },
        {
            title: 'the running man',
            poster: 'the-running-man.jpg',
            director: 'Paul Michael Glaser',
            year: '1987',
            rated: '6.6',
            runtime: '1h 41min',
            plot: 'A wrongly convicted man must try to survive a public execution gauntlet staged as a game show.'
        },
        {
            title: 'total recall',
            poster: 'total-recall.jpg',
            director: 'Paul Verhoeven',
            year: '1990',
            rated: '7.5',
            runtime: '1h 53min',
            plot: 'When a man goes for virtual vacation memories of the planet Mars, an unexpected and harrowing series of events forces him to go to the planet for real - or does he?'
        },
        {
            title: 'mad max',
            poster: 'mad-max.jpg',
            director: 'George Miller',
            year: '1979',
            rated: '7.0',
            runtime: '1h 28min',
            plot: 'In a self-destructing world, a vengeful Australian policeman sets out to stop a violent motorcycle gang.'
        },
        {
            title: 'the expendables',
            poster: 'the-expendables.jpg',
            director: 'Sylvester Stallone',
            year: '2010',
            rated: '6.5',
            runtime: '1h 43min',
            plot: 'A CIA operative hires a team of mercenaries to eliminate a Latin dictator and a renegade CIA agent.'
        },
        {
            title: 'universal soldier',
            poster: 'universal-soldier.jpg',
            director: 'Roland Emmerich',
            year: '1992',
            rated: '6.0',
            runtime: '1h 42min',
            plot: 'Private Luc Deveraux and his sadistic sergeant, Andrew Scott, got killed in Vietnam. The army uses their bodies for a secret project - reanimating dead soldiers as deadly obedient cyborgs. However, their memories come back too.'
        }
    ];

    return {
        movieList,
        introText
    }
})()

// 'first blood', 'cobra', 'demolition man', 'the terminator', 'bloodsport',
// 'battle royale', 'robocop', 'the matrix', 'on deadly ground', 'above the law',
// 'escape from new york', 'missing in action', 'the delta force', 'invasion U.S.A.', 'hard target',
// 'last action hero', 'executive decision', 'under siege', 'red dawn', 'kickboxer',
// 'raw deal', 'lone wolf mcquade', 'code of silence', 'patriot games', 'clear and present danger', 
// 'the fifth element', 'true lies', 'the transporter', 'red'