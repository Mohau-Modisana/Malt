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
		if (!req.session.username) {
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
	filename: './pizza-101.db',
	driver: sqlite3.Database
}).then(async (db) => {

	// only setup the routes once the database connection has been established

	await db.migrate();

	let counter = 0;

	app.get('/', async function (req, res) {

		//const counter = await db.get('select * from counter');
		const username = req.session.username;
		const pizzas = await db.all('select * from pizza');
		const order = await db.get('select *, (small + medium + large) as total from pizza_order where username = ?', username);

		res.render('index', {
			//counter: counter ? counter.count : 0
			pizzas,
			order,
			username: req.session.username
		});
	});


	//add pizza to the database
	app.get('/pizzas', async function (req, res) {
		const pizzas = await db.all('select * from pizza');

		res.render("pizzas", {
			pizzas
		});
	});

	app.get('/imageDetection', function (req, res) {
		res.render("imageDetection");
	});

	app.post('/imageDetection', async function (req, res) {

		console.log(req.body);

		const insert_pizza = 'insert into pizza (flavour, size, price) values (?, ?, ?)';
		await db.run(insert_pizza, req.body.flavour, req.body.size, req.body.price);

		res.redirect("/imageDetection");
	});


	app.get('/videoDetection', function (req, res) {
		res.render("videoDetection");
	});

	app.post('/videoDetection', async function (req, res) {

		console.log(req.body);

		const insert_pizza = 'insert into pizza (flavour, size, price) values (?, ?, ?)';
		await db.run(insert_pizza, req.body.flavour, req.body.size, req.body.price);

		res.redirect("/videoDetection");
	});


	app.post('/Order', async function (req, res) {

		console.log();

		const username = req.session.username;

		const result = await db.get('select count(*) as orderCount from pizza_order where username = ? and status = ?', username, 'new');
		if (result.orderCount === 0) {
			db.run('insert into pizza_order (small, medium, large, username, status) values (0, 0,0, ?, "new")', username);
		}

		const pizza = await db.get('select * from pizza where id = ?', req.body.pizza_id);

		if (pizza) {
			console.log(pizza);
			const size = pizza.size;

			if (size == 'Small') {
				await db.run('update pizza_order set small = small + ? where username = ?', pizza.price, username);
			} else if (size == 'Medium') {
				await db.run('update pizza_order set medium = medium + ? where username = ?', pizza.price, username);
			} else if (size == 'Large') {
				await db.run('update pizza_order set large = large + ? where username = ?', pizza.price, username);
			}
		}


		res.redirect("/");
	});


	// show them so that we can buy them

	//create a pizza order

	//make the pizzas paid screen, delivered - using the status field



	app.post('/count', async function (req, res) {

		try {


			const action = req.body.action;

			if (action === 'Press button to count') {

				const result = await db.get('select count(*) as count from counter');
				if (result.count === 0) {
					await db.run('insert into counter(count) values (?)', 1)
				} else {
					await db.exec('update counter set count = count + 1');
				}

			} else if (action === 'Reset the counter') {

				await db.exec('delete from counter');

			}

		} catch (err) {
			console.log(err);
		}

		res.redirect('/')
	});

	app.post("/login", function (req, res) {

		//console.log(req.body);

		req.session.username = req.body.username;

		res.redirect('/');
	});

	app.get("/login", function (req, res) {
		res.render('login');
	});

	app.get("/logout", function (req, res) {

		//console.log(req.body);

		delete req.session.username;

		res.redirect('/');
	});



	// start  the server and start listening for HTTP request on the PORT number specified...
	app.listen(PORT, function () {
		console.log(`App started on port ${PORT}`)
	});

});


