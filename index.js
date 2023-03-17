const PORT = process.env.PORT || 8080;
const Application = require('./framework/Application');
const filmRouter = require('./routes/film.routes');
const genreRouter = require('./routes/genre.routes');
const jsonParser = require('./framework/parseJson');
const parseUrl = require('./framework/parseUrl');

const app = new Application();

app.use(jsonParser);
app.use(parseUrl('http://localhost:8080'));

app.addRouter(filmRouter);
app.addRouter(genreRouter);

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));