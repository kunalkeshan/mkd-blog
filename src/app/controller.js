'use strict';

/* ====================== 
    UNAUTHENTICATED CONTROLLERS
   ====================== */

exports.toIndex = (req, res) => {
	// console.log(`${req.protocol}://${req.hostname}${req.originalUrl}`);
	const token = req.signedCookies.authToken;
	if (token) return res.redirect('/home');
	return res.render('index', {
		page: { title: 'Markdown Blog', link: 'index' },
	});
};

exports.redirectToIndex = (req, res) => {
	return res.redirect('/');
};

/* ====================== 
    AUTHENTICATED CONTROLLERS
   ====================== */

exports.toHome = (req, res) => {
	// TODO: API Call to get latest posts and send them to views to render
	return res.render('index', {
		page: { title: 'Home', link: 'home' },
	});
};
