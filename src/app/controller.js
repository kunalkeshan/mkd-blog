/**
 * Index Controllers
 */

'use strict';

/* ====================== 
	UNAUTHENTICATED CONTROLLERS
   ====================== */

// Index Controller Container
const indexController = {};

indexController.toIndex = (req, res) => {
	return res.render('index', {
		page: { title: 'Markdown Blog', link: 'index' },
	});
};

indexController.redirectToIndex = (req, res) => {
	return res.redirect('/');
};

/* ====================== 
	AUTHENTICATED CONTROLLERS
   ====================== */

// Semi authenticated, user check will be done in the route
indexController.toAuth = (req, res) => {
	return res.render('auth', {
		page: { title: 'Auth | mkd-blog', link: 'auth', user: req?.user },
	})
}

// Semi authenticated, user check will be done in the route
indexController.toHome = (req, res) => {
	return res.render('index', {
		page: { title: 'Home | mkd-blog', link: 'home', user: req?.user },
	});
};

// Exporting Index Controller
module.exports = indexController;
