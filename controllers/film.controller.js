const db = require('../db');

class FilmController {
    /**
     * Создание фильма
     * 
     * @param {*} req запрос
     * @param {*} res ответ
     */
    async createFilm(req, res) {
        const {name, year, genres} = req.body;
        const newFilmId = (await db.query(`INSERT INTO film (name, year) VALUES ('${name}', ${year}) RETURNING id`)).rows[0].id;
        await db.query(`INSERT INTO "film-genre" (film_id, genre_id) values ${genres.map(x => `(${newFilmId}, ${x})`)}`)
        const newFilm = await db.query(`SELECT f.id, f.name, f.year, array_agg(genre.name) AS genres 
        FROM "film" f JOIN "film-genre" filmGenre ON filmGenre.film_id = f.id JOIN genre ON genre.id = filmGenre.genre_id 
        WHERE f.id = ${newFilmId} GROUP BY f.id, f.name, f.year `);
        res.send(newFilm.rows[0]);
    }

    /**
     * Получение всех фильмов
     * 
     * @param {*} req запрос
     * @param {*} res ответ
     */
    async getFilms(req, res) {
        let films = await db.query("SELECT * FROM film");
        res.send(films.rows)
    }

    /**
     * Получение одного фильма по ключу
     * 
     * @param {*} req запрос
     * @param {*} res ответ
     */
    async getOneFilm(req, res) {
        if (!req.params.id) {
            res.send();
        }
        let films = await db.query(`SELECT * FROM film WHERE id=${req.params.id}`);
        res.send(films.rows[0])
    }

    /**
     * Обновление полей фильма по ключу
     * 
     * @param {*} req запрос
     * @param {*} res ответ
     */
    async updateFilm(req, res) {
        const {name, year, genres} = req.body;
        await db.query(`UPDATE film SET name='${name}', year=${year} WHERE id=${req.params.id}`);
        await db.query(`DELETE FROM "film-genre" WHERE film_id=${req.params.id}`);
        await db.query(`INSERT INTO "film-genre" (film_id, genre_id) values ${genres.map(x => `(${req.params.id}, ${x})`)}`)
        const film = await db.query(`SELECT f.id, f.name, f.year, array_agg(genre.name) AS genres 
        FROM "film" f JOIN "film-genre" filmGenre ON filmGenre.film_id = f.id JOIN genre ON genre.id = filmGenre.genre_id 
        WHERE f.id = ${req.params.id} GROUP BY f.id, f.name, f.year `);
        res.send(film.rows[0]);
    }

    /**
     * Удаление фильма по ключу
     * 
     * @param {*} req запрос
     * @param {*} res ответ
     */
    async deleteFilm(req, res) {
        await db.query(`DELETE FROM film WHERE id=${req.params.id}`);
        await db.query(`DELETE FROM "film-genre" WHERE film_id=${req.params.id}`);
        res.send(`Фильм по id ${req.params.id} успешно удалён`)
    }
}

module.exports = new FilmController();