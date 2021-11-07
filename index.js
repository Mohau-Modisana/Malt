const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');

// import sqlite modules
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const e = require('express');

const app = express();
const PORT = process.env.PORT || 3017;

app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}));

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


app.use(function (req, res, next) {
	//is the user logged in? if so all's ok

	if (req.path == '/login') {
		next();
	} else {
		if (!req.session.username && !req.session.password) {
			res.redirect('/login')
		}
		else {
			next();
		}
	}
	//if not show the login screen
});

// database setup starts here
open({
	filename: './malt.db',
	driver: sqlite3.Database
}).then(async (db) => {

	// only setup the routes once the database connection has been established

	await db.migrate();

	app.get('/', async function (req, res) {

		const username = req.session.username;
		const password = req.session.password;
		const allData = await db.all('select * from malt');
		const malt = await db.get('select * from malt where username = ? AND password = ?', username, password);

		res.render('index', {
			allData,
			malt,
			username: req.session.username,
			password: req.session.password
		});
	});


	//add pizza to the database
	app.get('/malt', async function (req, res) {
		const malt = await db.all('select * from malt');

		res.render("malt", {
			malt
		});
	});
	
	app.get('/imageDetection', function (req, res) {
		res.render("imageDetection");
	});

	app.post('/imageDetection', async function (req, res) {

		res.redirect("/imageDetection");
	});


	app.get('/videoDetection', function (req, res) {
		res.render("videoDetection");
	});

	app.post('/videoDetection', async function (req, res) {
		res.redirect("/videoDetection");
	});




	app.post("/login", function (req, res) {
		//console.log(req.body);
		req.session.username = req.body.username;
		req.session.password = req.body.password;
		res.redirect('/');
	});

	app.get("/login", function (req, res) {
		res.render('login');
	});

	app.get("/logout", function (req, res) {
		//console.log(req.body);
		delete req.session.username;
		delete req.session.password;
		res.redirect('/');
	});

	// start  the server and start listening for HTTP request on the PORT number specified...
	app.listen(PORT, function () {
		console.log(`App started on port ${PORT}`)
	});

});