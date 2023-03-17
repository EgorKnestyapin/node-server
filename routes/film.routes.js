const Router = require('../framework/Router');
const filmController = require('../controllers/film.controller');

const router = new Router();

router.post('/film', filmController.createFilm);
router.get('/films', filmController.getFilms);
router.get('/film', filmController.getOneFilm);
router.put('/film', filmController.updateFilm);
router.delete('/film', filmController.deleteFilm);

module.exports = router;