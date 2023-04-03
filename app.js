// Bring in Express code
const express = require('express')
const app = express()
const port = 3000

app.use(express.json()) // This line is necessary for Express to be able to parse JSON in request body's

const favoriteMovieList = [{
    title: "Star Wars",
    starRating: 5,
    isRecommended: true,
    createdAt: new Date(),
    lastModified: new Date()
}, {
    title: "The Avengers",
    starRating: 4,
    isRecommended: true,
    createdAt: new Date(),
    lastModified: new Date()
}];

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// Get all movies
app.get('/all-movies', (req, res) => {
    const filteredMovies = req.query.starRating ? favoriteMovieList.filter(movie => movie.starRating >= req.query.starRating) : favoriteMovieList;
    res.json(filteredMovies);
})


// Get single movie
app.get('/single-movie/:titleToFind', (req, res) => {
    const titleToFind = req.params.titleToFind;
    const foundMovie = favoriteMovieList.find(movie => movie.title === titleToFind);
    if (foundMovie) {
        res.json(foundMovie);
    } else {
        res.status(404).send('Movie not found.');
    }
})

// Add new movie
// Add new movie
app.post('/new-movie', (req, res) => {
    const title = req.body.title;
    const starRating = req.body.starRating;
    const isRecommended = req.body.isRecommended;

    if (!title || typeof title !== 'string') {
        res.status(400).json({ success: false, message: "title is required and must be a string" });
    } else if (!starRating || typeof starRating !== 'number' || starRating <= 0 || starRating >= 5) {
        res.status(400).json({ success: false, message: "starRating is required and must be a number between 0 and 5" });
    } else if (!isRecommended || typeof isRecommended !== 'boolean') {
        res.status(400).json({ success: false, message: "isRecommended is required and must be a boolean" });
    } else {
        const newMovie = {
            title: title,
            starRating: starRating,
            isRecommended: isRecommended,
            createdAt: new Date(),
            lastModified: new Date()
        }
        favoriteMovieList.push(newMovie);
        res.json({ success: true });
    }
})

// Update movie
app.put('/update-movie/:titleToUpdate', (req, res) => {
    const titleToUpdate = req.params.titleToUpdate;
    const movieIndex = favoriteMovieList.findIndex(movie => movie.title === titleToUpdate);
    if (movieIndex >= 0) {
        const originalMovie = favoriteMovieList[movieIndex];
        const updatedMovie = {
            title: req.body.title || originalMovie.title,
            starRating: req.body.starRating || originalMovie.starRating,
            isRecommended: req.body.isRecommended || originalMovie.isRecommended,
            createdAt: originalMovie.createdAt,
            lastModified: new Date()
        }
        favoriteMovieList[movieIndex] = updatedMovie;
        res.json({ success: true });
    } else {
        res.status(404).send('Movie not found.');
    }
})

// Delete movie
app.delete('/delete-movie/:titleToDelete', (req, res) => {
    const titleToDelete = req.params.titleToDelete;
    const movieIndex = favoriteMovieList.findIndex(movie => movie.title === titleToDelete);
    if (movieIndex >= 0) {
        favoriteMovieList.splice(movieIndex, 1);
        res.json({ success: true });
    } else {
        res.status(404).send('Movie not found.');
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
