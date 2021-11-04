create table pizza_order (
	id integer primary key AUTOINCREMENT,
	small real,
	medium real,
	large real,
	username text,
	status text --new, paid, deliverd--
);