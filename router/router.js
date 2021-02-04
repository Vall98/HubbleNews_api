const ctrl = require('../controllers');
const passport = require('../passport');
const router = require('express').Router();

/*
** Device
*/
router.post('/device/regisertoken', ctrl.deviceController.registerToken);

/*
** User
*/
router.post('/signin', ctrl.userController.signin);
router.post('/signup', ctrl.userController.signup);
//router.get('/logout', passport.authenticate('jwt', { session: false }), ctrl.userController.logout);
router.get('/me', passport.authenticate('jwt', { session: false }), ctrl.userController.me);
router.post('/user/update', passport.authenticate('jwt', { session: false }), ctrl.userController.updateInfos);
router.post('/user/image', passport.authenticate('jwt', { session: false }), ctrl.userController.editImage);

/*
** News
*/
router.post('/news/favorite', passport.authenticate('jwt', { session: false }), ctrl.newController.favorite);
router.get('/news/comments', ctrl.newController.getComments);
router.post('/news/comment',  passport.authenticate('jwt', { session: false }), ctrl.newController.comment);
//router.post('/upvote', passport.authenticate('jwt', { session: false }), ctrl.newController.upvote);
//router.get('/news', ctrl.newController.getNews);

/*
** HubbleSite
*/
router.get('/hubblesite/news', ctrl.hubblesiteController.news);
router.get('/hubblesite/news_release', ctrl.hubblesiteController.news_release);

module.exports = router;