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

indexController.toHome = (req, res) => {
	// TODO: API Call to get latest posts and send them to views to render
	return res.render('index', {
		page: { title: 'Home', link: 'home' },
	});
};

// Exporting Index Controller
module.exports = indexController;
