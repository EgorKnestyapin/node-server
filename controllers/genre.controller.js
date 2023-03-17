const db = require('../db');

class GenreController {
    /**
     * Создание жанра
     * 
     * @param {*} req запрос 
     * @param {*} res ответ
     */
    async createGenre(req, res) {
        const {name} = req.body;
        const newGenreId = (await db.query(`INSERT INTO genre (name) values ('${name}') RETURNING id`)).rows[0].id;
        const newGenre = await db.query(`SELECT * FROM genre WHERE id=${newGenreId}`);
        res.send(newGenre.rows[0]);
    }

    /**
     * Получение всех жанров
     * 
     * @param {*} req запрос
     * @param {*} res ответ
     */
    async getGenres(req, res) {
        let genres = await db.query("SELECT * FROM genre");
        res.send(genres.rows)
    }

    /**
     * Получение одного жанра по ключу
     * 
     * @param {*} req запрос
     * @param {*} res ответ
     */
    async getOneGenre(req, res) {
        if (!req.params.id) {
            res.send();
        }
        let genre = await db.query(`SELECT * FROM genre WHERE id=${req.params.id}`);
        res.send(genre.rows[0])
    }

    /**
     * Обновление полей жанра по ключу
     * 
     * @param {*} req запрос
     * @param {*} res ответ
     */
    async updateGenre(req, res) {
        const {name} = req.body;
        await db.query(`UPDATE genre SET name='${name}' WHERE id=${req.params.id}`);
        const genre = await db.query(`SELECT * FROM genre WHERE id=${req.params.id}`);
        res.send(genre.rows[0]);
    }

    /**
     * Удаление жанра по ключу
     * 
     * @param {*} req запрос
     * @param {*} res ответ
     */
    async deleteGenre(req, res) {
        await db.query(`DELETE FROM genre WHERE id=${req.params.id}`);
        await db.query(`DELETE FROM "film-genre" WHERE genre_id=${req.params.id}`);
        res.send(`Жанр по id ${req.params.id} успешно удалён`)
    }
}

module.exports = new GenreController();