'use strict';

// Importing Packages
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const {
	port,
	secrets: { cookieSecret },
	nodeEnvironment,
	appType,
	isProduction
} = require('./src/helper/config');

// Importing App Router
const appRouter = require('./src/app');

// Initializing Express Application
const app = express();

app.disable('x-powered-by');

// Setting up Middleware's
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(cookieSecret));
app.use(logger(isProduction ? 'dev' : 'combined'));

// Using App Router
app.use('/', appRouter);

// Handling 404 Errors
app.use((req, res, next) => {
	const error = new Error('Page Not Found!');
	error.status = 404;
	error.url = req.originalUrl;
	next(error);
});

// Handling Server Errors
app.use((error, req, res, next) => {
	console.log(error.stack);
	if (appType !== 'traditional')
		return res
			.status(error.status || 500)
			.json({ message: error.message || 'Internal Server Error!' });

	res.status(error.status || 500).render('serverError', {
		page: {
			title: "Markdown Blog",
			"link": "serverError"
		},
		error: {
			status: error.status || 500,
			message: error.message || 'Internal Server Error!',
			url: error.url || 'Page',
		},
	});
});

app.listen(port, (err) => {
	if (err) console.log(`>>> Error in running server! Error: ${err}`);
	else console.log(`>>> Server running at http://localhost:${port}`);
});
