-- create table seaberorder (
-- 	id BIGSERIAL PRIMARY KEY,
-- 	orderid VARCHAR(200),
-- 	fromlocation VARCHAR(200)DEFAULT NULL,
-- 	tolocation VARCHAR(200) DEFAULT NULL,
-- 	cargotype VARCHAR(200) DEFAULT NULL,
-- 	cargoamount INT DEFAULT NULL
-- );


create table orders (
	id BIGSERIAL PRIMARY KEY,
	orderid VARCHAR(200),
	fromlocation VARCHAR(200)DEFAULT NULL,
	tolocation VARCHAR(200) DEFAULT NULL,
	cargotype VARCHAR(200) DEFAULT NULL,
	cargoamount INT DEFAULT NULL,
	updated_at TIMESTAMPTZ DEFAULT Now(),
	ordersent Boolean DEFAULT false
);

CREATE INDEX orderid_index ON orders(orderid)