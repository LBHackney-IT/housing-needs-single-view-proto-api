CREATE TABLE [dbo].[member] (
    [house_ref] char(10) DEFAULT (space((1))),
    [person_no] numeric(2,0) DEFAULT ((0)),
    [forename] char(24) DEFAULT (space((1))),
    [surname] char(20) DEFAULT (space((1))),
    [ni_no] char(12) DEFAULT (space((1))),
    [dob] datetime DEFAULT (''),
);

insert into member (house_ref, person_no, forename, surname, ni_no, dob) values ('9383795', 1, 'Hodge', 'Maskelyne', 'AB062376W', '1981-06-01');
insert into member (house_ref, person_no, forename, surname, ni_no, dob) values ('6867133', 2, 'Elwira', 'Moncur', 'CD877332Z', '1971-12-22');
insert into member (house_ref, person_no, forename, surname, ni_no, dob) values ('2966927', 2, 'Dani', 'Beyn', 'EF926702A', '1955-07-23');
insert into member (house_ref, person_no, forename, surname, ni_no, dob) values ('4750013', 3, 'Rodrick', 'Kellitt', 'GH210551B', '1983-08-11');
insert into member (house_ref, person_no, forename, surname, ni_no, dob) values ('8539472', 1, 'Osmund', 'Watters', 'JK963646C', '1992-10-27');
insert into member (house_ref, person_no, forename, surname, ni_no, dob) values ('7375016', 2, 'Deana', 'De Luna', 'LM474572D', '1984-03-03');
insert into member (house_ref, person_no, forename, surname, ni_no, dob) values ('8381960', 1, 'Henrieta', 'Sterre', 'NO884836E', '1999-03-17');
insert into member (house_ref, person_no, forename, surname, ni_no, dob) values ('4595514', 2, 'Claudina', 'Soame', 'PR226831F', '1948-08-17');
insert into member (house_ref, person_no, forename, surname, ni_no, dob) values ('8282501', 1, 'Hartwell', 'Lorinez', 'ST949511G', '1942-05-24');
insert into member (house_ref, person_no, forename, surname, ni_no, dob) values ('1101447', 1, 'Sherline', 'Deveril', 'UV388142H', '1973-12-18');


---------------------

CREATE TABLE [dbo].[contacts] (
    [con_key] int DEFAULT ((0)),
    [con_ref] char(12) DEFAULT (space((1))),
    [con_address] char(200) DEFAULT (space((1))),
    [con_postcode] char(10) DEFAULT (space((1))),
);

insert into contacts (con_key, con_ref, con_address, con_postcode) values (3848, '9383795', '9 Anderson Trail', 'N16 5DZ');
insert into contacts (con_key, con_ref, con_address, con_postcode) values (7250, '6867133', '1 Mallard Circle', 'N1 5DZ');
insert into contacts (con_key, con_ref, con_address, con_postcode) values (6452, '2966927', '65 Bunker Hill Hill', 'N16 5Z');
insert into contacts (con_key, con_ref, con_address, con_postcode) values (4097, '4750013', '321 Ridgeview Plaza', 'N6 4Z');
insert into contacts (con_key, con_ref, con_address, con_postcode) values (3913, '8539472', '2695 Twin Pines Pass', 'A16 5Z');
insert into contacts (con_key, con_ref, con_address, con_postcode) values (6586, '7375016', '20 Debra Road', 'N16 5DZ');
insert into contacts (con_key, con_ref, con_address, con_postcode) values (5380, '8381960', '8019 Mariners Cove Lane', 'A2 B4');
insert into contacts (con_key, con_ref, con_address, con_postcode) values (3451, '4595514', '8735 Washington Way', 'R2 D2');
insert into contacts (con_key, con_ref, con_address, con_postcode) values (6976, '8282501', '55 Pankratz Point', 'N3 6Z');
insert into contacts (con_key, con_ref, con_address, con_postcode) values (4043, '1101447', '9 Veith Way', 'N34 6O');

-------------------

CREATE TABLE [dbo].[househ] (
    [house_ref] char(10) DEFAULT (space((1))),
);

insert into househ (house_ref) values ('9383795');
insert into househ (house_ref) values ('6867133');
insert into househ (house_ref) values ('2966927');
insert into househ (house_ref) values ('4750013');
insert into househ (house_ref) values ('8539472');
insert into househ (house_ref) values ('7375016');
insert into househ (house_ref) values ('8381960');
insert into househ (house_ref) values ('4595514');
insert into househ (house_ref) values ('8282501');
insert into househ (house_ref) values ('1101447');

--------------------

CREATE TABLE [dbo].[wlapp] (
    [app_ref] char(10) DEFAULT (space(1)),
    [post_code] char(10) DEFAULT (space(1)),
    [corr_addr] char(150) DEFAULT (space(1)),
    [con_key] int DEFAULT (0),
    PRIMARY KEY ([app_ref])
);

insert into wlapp (app_ref, post_code, corr_addr, con_key) values ('DIR6940111', 'H04 7OT', '26 Toban Junction', 629314841);
insert into wlapp (app_ref, post_code, corr_addr, con_key) values ('DIR4704058', 'O70 5TH', '3 Schlimgen Point', 530672748);
insert into wlapp (app_ref, post_code, corr_addr, con_key) values ('DIR5135951', 'DT0 0AX', '56264 Westport Lane', 302934398);
insert into wlapp (app_ref, post_code, corr_addr, con_key) values ('DIR7479057', 'S09 4NH', '3 Mandrake Alley', 868776284);
insert into wlapp (app_ref, post_code, corr_addr, con_key) values ('DIR7350104', 'L36 0TK', '0742 Victoria Alley', 726669153);
insert into wlapp (app_ref, post_code, corr_addr, con_key) values ('DIR3646682', 'UC9 8EQ', '7 Goodland Parkway', 995371469);
insert into wlapp (app_ref, post_code, corr_addr, con_key) values ('DIR9055215', 'JX3 0ZK', '2 Arrowood Alley', 146114001);
insert into wlapp (app_ref, post_code, corr_addr, con_key) values ('DIR1784557', 'T34 9II', '3 Coolidge Park', 172168279);
insert into wlapp (app_ref, post_code, corr_addr, con_key) values ('DIR6421750', 'AT8 1OC', '7742 Northport Court', 412769753);
insert into wlapp (app_ref, post_code, corr_addr, con_key) values ('DIR9610142', 'VM1 3AE', '4014 Vermont Road', 240815067);

---------------------

CREATE TABLE [dbo].[wlmember] (
    [app_ref] char(10) DEFAULT (space((1))),
    [person_no] numeric(2,0) DEFAULT ((0)),
    [dob] datetime DEFAULT (' '),
    [forename] char(24) DEFAULT (space((1))),
    [surname] char(20) DEFAULT (space((1))),
    [ni_no] char(12) DEFAULT (space((1))),
);

insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no) values ('DIR6940111', 4, '1965-03-25', 'Hillel', 'Lorenz', 'AB106755C');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no) values ('DIR4704058', 5, '1981-08-31', 'Bee', 'Rummer', 'CD945302R');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no) values ('DIR5135951', 3, '1971-05-18', 'Imojean', 'D''Abbot-Doyle', 'CC808991F');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no) values ('DIR7479057', 1, '1989-01-28', 'Arney', 'Pollok', 'FF453208S');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no) values ('DIR7350104', 1, '1965-08-15', 'Zilvia', 'Tomaello', 'RF735670C');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no) values ('DIR3646682', 1, '1975-04-13', 'Dasha', 'Sanchez', 'GD345625V');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no) values ('DIR9055215', 6, '1962-07-03', 'Marget', 'Rubie', 'JE799725S');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no) values ('DIR1784557', 2, '1979-12-15', 'Gordie', 'Drayson', 'KK933624D');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no) values ('DIR6421750', 2, '1979-12-14', 'Eadie', 'Bullan', 'JE019827F');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no) values ('DIR9610142', 5, '1969-11-29', 'Nadya', 'Montes', 'ME918699A');