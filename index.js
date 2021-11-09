const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const bcrypt = require('bcryptjs');

// import sqlite modules
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const e = require('express');

const app = express();
const PORT = process.env.PORT || 3017;

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


// database setup starts here
open({
	filename: './malt.db',
	driver: sqlite3.Database
}).then(async (db) => {

	// only setup the routes once the database connection has been established

	await db.migrate();

	app.get('/', async function (req, res) {
		//const counter = await db.get('select * from counter');
		const users = await db.all('select * from users');
		res.render('index', {
			//counter: counter ? counter.count : 0
			users
		});
	});

	app.post("/register", async function (req, res) {
		try {
			const fullname = req.body.fullname;
			const email = req.body.email;
			const password = req.body.password;

			const hash = await bcrypt.hash(password, 10);
			const insert_users = 'insert into users (fullname, email, hash) values (?, ?, ?)';
			await db.run(insert_users, fullname, email, hash);
			const users = await db.all('select * from users');
			console.log(users)
			res.redirect('/');


		} catch (e) {
			console.log(e);
			res.status(500).send("incorrect information!");
			res.redirect('/');
		}
	});


	app.post("/", async function (req, res) {
		try {
			const fullname = req.body.fullname;
			const email = req.body.email;
			const password = req.body.password;


			const user = await db.get('select * from users where email = ?', email);
			if (user) {
				const vaildPass = await bcrypt.compare(password, user.hash);
				if (vaildPass) {
					console.log("in");
					res.redirect('/home');
				} else {
					res.redirect('/');
					console.log("out");
				}
			} else {
				console.log("user not fownd");
			}

		} catch (e) {
			console.log(e);
			//res.status(500).send("Something broke!");
		}
	});


	app.get('/home', async function (req, res) {
		//const counter = await db.get('select * from counter');
		const users = await db.all('select * from users');
		
	
		res.render('home', {
			//counter: counter ? counter.count : 0
			users
		});
	});

	app.post('/home', function (req, res) {
		res.redirect("/home");
	});

	app.get("/", function (req, res) {
		res.render('/');
	});

	app.get("/logout", function (req, res) {
		res.redirect('/');
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

	// start  the server and start listening for HTTP request on the PORT number specified...
	app.listen(PORT, function () {
		console.log(`App started on port ${PORT}`)
	});

});