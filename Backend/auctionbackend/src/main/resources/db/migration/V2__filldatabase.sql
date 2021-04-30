INSERT INTO gender (name)
VALUES             ('Female'),
                   ('Male');


INSERT INTO customer (first_name, last_name, email, password, active, date_of_birth, gender_id)
VALUES               ('Mable', 'Lambert', 'mableLambert@mail.com', '$2a$10$mEaB0Na.WE3a8weOY6SzsOSnMmU4ZFPN90z0UFGNSJOPibSFQgQay' , true ,'2000-01-01', 2),
                     ('Milton', 'Warren', 'miltonWarren@mail.com', '$2a$10$mEaB0Na.WE3a8weOY6SzsOSnMmU4ZFPN90z0UFGNSJOPibSFQgQay', true ,'2000-01-01', 2),
					 ('Loyd', 'Parks', 'loydParks@mail.com', '$2a$10$mEaB0Na.WE3a8weOY6SzsOSnMmU4ZFPN90z0UFGNSJOPibSFQgQay', true ,'2000-01-01', 2),
					 ('Charlie', 'Fuller', 'charlieFuller@mail.com', '$2a$10$mEaB0Na.WE3a8weOY6SzsOSnMmU4ZFPN90z0UFGNSJOPibSFQgQay', true ,'2000-01-01', 1),
					 ('Azra', 'Becirevic', 'azra.becirevic1998@gmail.com', '$2a$10$mEaB0Na.WE3a8weOY6SzsOSnMmU4ZFPN90z0UFGNSJOPibSFQgQay', true ,'2000-01-01', 1);


INSERT INTO category (name)
VALUES               ('Women'),
                     ('Men'),
					 ('Kids'),
					 ('Home'),
					 ('Art'),
					 ('Computers'),
					 ('Mobile'),
					 ('Electronics'),
					 ('Sport'),
					 ('Health & Beauty');


INSERT INTO subcategory (name, category_id)
VALUES               ('Women clothes', 1),
                     ('Women shoes', 1),
					 ('Women bags', 1),
					 ('Men clothes', 2),
					 ('Men shoes', 2),
					 ('Kids clothes', 3),
					 ('Home decoration', 4),
					 ('Painting', 5),
					 ('Computer', 6),
					 ('Mobile phones', 7),
					 ('Mobile cases', 7),
					 ('Vacuum cleaners', 8),
					 ('Sport equipment', 9),
					 ('Makeup', 10);


INSERT INTO product (name, start_date, end_date, start_price, description, created_on, modified_on, customer_id, end_date_payment, paid)
VALUES              ('Black T-Shirt', '2021-03-30', '2021-04-20', 50.55, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 5, null, false),
                    ('Red Shirt', '2021-03-30', '2021-05-30', 60, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 5, null, false),
					('White Shirt', '2021-03-30', '2021-05-30', 70, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 5, null, false),
					('Purple sneakers', '2021-03-30', '2021-05-30', 200, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 5, null, false),
					('White sneakers', '2021-03-30', '2021-04-20', 150, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 5, null, false),
					('Pink sneakers', '2021-03-30', '2021-05-30', 130, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 4, null, false),
					('Red bag', '2021-03-30', '2021-05-30', 100, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 4, null, false),
					('Camel bag', '2021-03-30', '2021-05-30', 80, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 4, null, false),
					('Black bag', '2021-03-30', '2021-05-30', 100, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 4, null, false),
					('Beige bag', '2021-03-30', '2021-05-30', 85, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 4, null, false),
					('White T-Shirt', '2021-03-30', '2021-05-30', 100, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 3, null, false),
					('Black shirt', '2021-03-30', '2021-05-30', 170, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 3, null, false),
					('Blue shirt', '2021-03-30', '2021-05-30', 155, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 3, null, false),
					('Black sneakers', '2021-03-30', '2021-05-30', 100, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 3, null, false),
					('Grey sneakers', '2021-03-30', '2021-05-30', 135, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 3, null, false),
					('White-Orange sneakers', '2021-03-30', '2021-05-30', 145, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 2, null, false),
					('Navy-White T-Shirt', '2021-03-30', '2021-05-30', 70, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 2, null, false),
			        ('Blue T-Shirt', '2021-03-30', '2021-05-30', 70, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 2, null, false),
					('Cloud decoration', '2021-03-30', '2021-05-30', 70, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 2, null, false),
					('Candlestick', '2021-03-30', '2021-05-30', 90, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 2, null, false),
					('Flower picture', '2021-03-30', '2021-05-30', 70, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 1, null, false),
					('Computer', '2021-03-30', '2021-05-30', 70, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 1, null, false),
					('Mobile phone', '2021-03-30', '2021-05-30', 70, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 1, null, false),
					('Mobile case', '2021-03-30', '2021-05-30', 70, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 2, null, false),
					('Vacuum cleaner', '2021-03-30', '2021-05-30', 150, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 3, null, false),
					('Robot vacuum', '2021-03-30', '2021-05-30', 150, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 4, null, false),
					('Ball', '2021-03-30', '2021-05-30', 150, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 3, null, false),
					('Ball', '2021-03-30', '2021-05-30', 150, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 2, null, false),
					('Mascara', '2021-03-30', '2021-05-30', 20, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 5, null, false),
					('Bronzer', '2021-03-30', '2021-05-30', 20, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut blandit consequat placerat. Donec eget tortor sed mi pharetra facilisis.', current_timestamp, current_timestamp, 5, null, false);


INSERT INTO subcategory_products (subcategory_id, product_id)
VALUES                           (1, 1),
                                 (1, 2),
								 (1, 3),
								 (2, 4),
								 (2, 5),
								 (2, 6),
								 (3, 7),
								 (3, 8),
								 (3, 9),
								 (3, 10),
								 (4, 11),
								 (4, 12),
								 (4, 13),
								 (5, 14),
								 (5, 15),
								 (5, 16),
								 (6, 17),
								 (6, 18),
								 (7, 19),
								 (7, 20),
								 (8, 21),
								 (9, 22),
								 (10, 23),
								 (11, 24),
								 (12, 25),
								 (12, 26),
								 (13, 27),
								 (13, 28),
								 (14, 29),
								 (14, 30);


INSERT INTO bid (bid_price, date_of_bid_placement, customer_id, product_id)
VALUES          (61, '2021-04-18', 2, 2),
                (80, '2021-04-18', 3, 2),
                (210, '2021-04-18', 2, 4),
                (230, '2021-04-18', 3, 4),
                (60, '2021-04-15', 4, 1),
                (160, '2021-04-10', 1, 5);


