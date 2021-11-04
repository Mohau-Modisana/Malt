# ExpressJS with SQL using SQLite

We are using the [sqlite](https://www.npmjs.com/package/sqlite) npm module. It uses the [sqlite3](https://www.npmjs.com/package/sqlite3) module so we need this as well.

SQL is a a small, fast, self-contained, high-reliability, full-featured, SQL database engine. And it's easy to setup. In the future you can explore using a database like [PostgreSQL] - the principles you will learn using SQLite applies to most SQL databases.

Learn more aboute SQLite [here](https://www.sqlitetutorial.net/).
## SQL

Where are using the 4 sql commands `select, insert, update and delete` to manage a counter when a user click a button.

See the SQL commands this application is using in the table below.

SQL command | comment
------------|-------------
`select * from counter` |
`select count(*) as count from counter` |
`insert into counter(count) values (?)` |
`update counter set count = count + 1` |
`delete from counter` |

## Database setup

To setup SQLite in your code you need this:

Import the modules:

```js
// import sqlite modules
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
```

Add this code to your application.

```js
open({
	filename: './data.db',
	driver: sqlite3.Database
}).then(async function (db) {

	// run migrations

	await db.migrate();

	// only setup the routes once the database connection has been established

})
```

## SQL from JavaScript

The SQLite module has a few different methids

SQL command | comment | usage
------------|-------------|---------
`db.get` | return a value from the database | `db.get('select count(*) as count from counter')`
`db.all` | return values (a list) from the database | `db.all('select * from counter')`
`db.exec` | execute a SQL statement - return nothing | `db.exec('update counter set count = count + 1')`
`db.run` | execute a SQL statement with parameters |  `'insert into counter(count) values (?)`

## Using migrations

Migrations is an easy way to run DDL scripts on your database.

## What is async/await?

`async/await` is a cleaner syntax for handling asynchronous code.

You can learn more about asynchronous code in JavaScript [here](https://exploringjs.com/impatient-js/ch_async-js.html#roadmap-async-functions).

Learn more about async/await & promises here: https://www.youtube.com/embed/videoseries?list=PLVcT2txrixoVW_HZsO70gf695a1zfXNvf

**callback**

```
query(“select * from table”, function(err, result){});
```
**promises**

```
query(“select * from table”).then(function(result){});
```

**async/await**

```
const result = await query(“select * from table”);
```


