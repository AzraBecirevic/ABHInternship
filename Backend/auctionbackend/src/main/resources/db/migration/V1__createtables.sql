CREATE TABLE gender(
  id integer GENERATED ALWAYS AS IDENTITY,
  name varchar(255),
  PRIMARY KEY(id)
);

CREATE TABLE customer(
  id integer GENERATED ALWAYS AS IDENTITY,
  first_name varchar(255),
  last_name varchar(255),
  email varchar(255),
  password varchar(255),
  date_of_birth timestamp,
  phone_number varchar(255),
  active boolean,
  profile_image varchar(10485760),
  gender_id integer ,
  stripe_id varchar(255),
  PRIMARY KEY(id),
  CONSTRAINT fk_gender
      FOREIGN KEY(gender_id)
	  REFERENCES gender(id)
);

CREATE TABLE country(
  id integer GENERATED ALWAYS AS IDENTITY,
  name varchar(255),
  PRIMARY KEY(id)
);

CREATE TABLE state(
  id integer GENERATED ALWAYS AS IDENTITY,
  name varchar(255),
  country_id integer,
  PRIMARY KEY(id),
  CONSTRAINT fk_country
      FOREIGN KEY(country_id)
	  REFERENCES country(id)
);

CREATE TABLE city(
  id integer GENERATED ALWAYS AS IDENTITY,
  name varchar(255),
  state_id integer,
  PRIMARY KEY(id),
  CONSTRAINT fk_state
      FOREIGN KEY(state_id)
	  REFERENCES state(id)
);


CREATE TABLE zip_code(
  id integer GENERATED ALWAYS AS IDENTITY,
  zip_code varchar(255),
  PRIMARY KEY(id)
);

CREATE TABLE delivery_address(
  id integer GENERATED ALWAYS AS IDENTITY,
  street varchar(255),
  zip_code_id integer,
  city_id integer,
  customer_id integer,
  PRIMARY KEY(id),
  CONSTRAINT fk_zip_code
      FOREIGN KEY(zip_code_id)
	  REFERENCES zip_code(id),
  CONSTRAINT fk_city
      FOREIGN KEY(city_id)
	  REFERENCES city(id),
  CONSTRAINT fk_customer
      FOREIGN KEY(customer_id)
	  REFERENCES customer(id)
);

CREATE TABLE category(
  id integer GENERATED ALWAYS AS IDENTITY,
  name varchar(255),
  PRIMARY KEY(id)
);

CREATE TABLE subcategory(
  id integer GENERATED ALWAYS AS IDENTITY,
  name varchar(255),
  category_id integer,
  PRIMARY KEY(id),
  CONSTRAINT fk_category
      FOREIGN KEY(category_id)
	  REFERENCES category(id)
);

CREATE TABLE product(
  id integer GENERATED ALWAYS AS IDENTITY,
  name varchar(255),
  start_price double precision,
  start_date timestamp,
  end_date timestamp,
  description varchar(700),
  created_on timestamp,
  modified_on timestamp,
  customer_id integer,
  paid boolean,
  PRIMARY KEY(id),
  CONSTRAINT fk_product_customer
      FOREIGN KEY(customer_id)
	  REFERENCES customer(id)
);


CREATE TABLE image(
  id integer GENERATED ALWAYS AS IDENTITY,
  image varchar(10485760),
  product_id integer,
  PRIMARY KEY(id),
  CONSTRAINT fk_product_image
      FOREIGN KEY(product_id)
	  REFERENCES product(id)
);

CREATE TABLE bid(
  id integer GENERATED ALWAYS AS IDENTITY,
  date_of_bid_placement timestamp,
  bid_price double precision,
  customer_id integer,
  product_id integer,
  PRIMARY KEY(id),
  CONSTRAINT fk_customer_bid
      FOREIGN KEY(customer_id)
	  REFERENCES customer(id),
  CONSTRAINT fk_product_bid
      FOREIGN KEY(product_id)
	  REFERENCES product(id)
);

CREATE TABLE subcategory_products(
  subcategory_id integer,
  product_id integer,
  CONSTRAINT fk_product_subcategory
      FOREIGN KEY(subcategory_id)
	  REFERENCES subcategory(id),
  CONSTRAINT fk_subcategory_product
      FOREIGN KEY(product_id)
	  REFERENCES product(id)
);