const questions = (function(){
    const movieList = [
        'commando', 'predator', 'die hard', 'conan the destroyer', 'conan the barbarian',
        'the running man', 'total recall', 'mad max', 'the expendables', 'universal soldier',
        'first blood', 'cobra', 'demolition man', 'the terminator', 'bloodsport',
        'battle royale', 'robocop', 'the matrix', 'on deadly ground', 'above the law',
        'escape from new york', 'missing in action', 'the delta force', 'invasion U.S.A.', 'hard target',
        'last action hero', 'executive decision', 'under siege', 'red dawn', 'kickboxer',
        'raw deal', 'lone wolf mcquade', 'code of silence', 'patriot games', 'clear and present danger', 
        'the fifth element', 'true lies', 'the transporter', 'red'
    ];

    const introText = `Welcome to the 'Action Movie Quiz!'
    You will be presented with a movie plot.
    Your job is to match the plot to the appropriate movie title.
    All movies are of the governator action genre.
    But be quick. You'll only have 15 seconds to guess for each plot!
    All movie plots and images are provided by the OMDBapi,
    so if there are inconsistencies or innaccuracies, it ain't my fault!
    Click below to begin...`

    return {
        movieList,
        introText
    }
})()
