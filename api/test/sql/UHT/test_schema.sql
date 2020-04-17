USE uhtlive;

CREATE TABLE [member] (
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

CREATE TABLE [contacts] (
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

CREATE TABLE [househ] (
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

CREATE TABLE [wlapp] (
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

CREATE TABLE [wlmember] (
    [app_ref] char(10) DEFAULT (space((1))),
    [person_no] numeric(2,0) DEFAULT ((0)),
    [dob] datetime DEFAULT (' '),
    [forename] char(24) DEFAULT (space((1))),
    [surname] char(20) DEFAULT (space((1))),
    [ni_no] char(12) DEFAULT (space((1))),
);

insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no) values ('DIR6940111', 4, '1965-03-25', 'Hillel', 'Lorenz', 'AB106755C');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no) values ('DIR4704058', 5, '1971-12-22', 'Elwira', 'Moncur', 'CD877332Z');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no) values ('DIR5135951', 3, '1971-05-18', 'Imojean', 'D''Abbot-Doyle', 'CC808991F');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no) values ('DIR7479057', 1, '1983-08-11', 'Rodrick', 'Kellitt', 'GH210551B');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no) values ('DIR7350104', 1, '1965-08-15', 'Zilvia', 'Tomaello', 'RF735670C');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no) values ('DIR3646682', 1, '1975-04-13', 'Dasha', 'Sanchez', 'GD345625V');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no) values ('DIR9055215', 6, '1962-07-03', 'Marget', 'Rubie', 'JE799725S');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no) values ('DIR1784557', 2, '1979-12-15', 'Hartwell', 'Lorinez', 'KK933624D');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no) values ('DIR6421750', 2, '1979-12-14', 'Eadie', 'Bullan', 'JE019827F');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no) values ('DIR9610142', 5, '1969-11-29', 'Nadya', 'Montes', 'ME918699A');

-------ACADEMY BENEFITS---------

USE HBCTLIVEDB;

CREATE TABLE [hbclaim] (
    [claim_id] int,
    [check_digit] nvarchar(1)
);


insert into hbclaim (claim_id, check_digit) values (5260765, '6');
insert into hbclaim (claim_id, check_digit) values (5759744, '0');
insert into hbclaim (claim_id, check_digit) values (6060591, '3');
insert into hbclaim (claim_id, check_digit) values (5479047, '8');
insert into hbclaim (claim_id, check_digit) values (5879391, '3');
insert into hbclaim (claim_id, check_digit) values (6115325, '5');
insert into hbclaim (claim_id, check_digit) values (5587103, '4');
insert into hbclaim (claim_id, check_digit) values (5315153, '5');
insert into hbclaim (claim_id, check_digit) values (5167284, '3');
insert into hbclaim (claim_id, check_digit) values (5448076, '2');

CREATE TABLE [hbmember] (
    [claim_id] int,
    [house_id] smallint,
    [person_ref] int,
    [surname] nvarchar(32),
    [forename] nvarchar(32),
    [birth_date] datetime2(7),
    [nino] nvarchar(10)
);

insert into hbmember (claim_id, house_id, person_ref, surname, forename, birth_date, nino) values (5260765, 1, 1, 'Moncur', 'Elwira', '1971-12-22', 'CD877332Z');
insert into hbmember (claim_id, house_id, person_ref, surname, forename, birth_date, nino) values (5759744, 1, 1, 'Bullimore', 'Tate', '1971-09-25', 'CD877534Z');
insert into hbmember (claim_id, house_id, person_ref, surname, forename, birth_date, nino) values (6060591, 2, 2, 'Beden', 'Flor', '1981-02-08', 'CD877342Z');
insert into hbmember (claim_id, house_id, person_ref, surname, forename, birth_date, nino) values (5479047, 1, 1, 'Veare', 'Arlette', '1986-11-07', 'CD657332Z');
insert into hbmember (claim_id, house_id, person_ref, surname, forename, birth_date, nino) values (5879391, 3, 3, 'Manoelli', 'Nanny', '1987-05-22', 'CF877332Z');
insert into hbmember (claim_id, house_id, person_ref, surname, forename, birth_date, nino) values (6115325, 3, 3, 'Wegener', 'Tera', '1969-08-09', 'CD877332O');
insert into hbmember (claim_id, house_id, person_ref, surname, forename, birth_date, nino) values (6233154, 17, 2, 'Wherrett', 'Ruggiero', '1989-08-07', 'CD877355Z');
insert into hbmember (claim_id, house_id, person_ref, surname, forename, birth_date, nino) values (6534331, 11, 1, 'Metzing', 'Adara', '1949-12-29', 'CD877334E');
insert into hbmember (claim_id, house_id, person_ref, surname, forename, birth_date, nino) values (6111340, 5, 3, 'Swettenham', 'Babara', '1941-08-05', 'FF577332Z');
insert into hbmember (claim_id, house_id, person_ref, surname, forename, birth_date, nino) values (5932526, 11, 1, 'Bourthouloume', 'Damaris', '1944-10-03', 'CE354652Z');

CREATE TABLE [hbhousehold] (
    [claim_id] int,
    [house_id] smallint,
    [to_date] datetime2(7),
    [addr1] nvarchar(35),
    [addr2] nvarchar(35),
    [addr3] nvarchar(32),
    [addr4] nvarchar(32),
    [post_code] nvarchar(10)
);

insert into hbhousehold (claim_id, house_id, to_date, addr1, addr2, addr3, post_code) values (5260765, 1, '2099-12-31', '6 Cascade Junction', '49 Norway Maple Pass', 'LONDON', 'I3 0RP');
insert into hbhousehold (claim_id, house_id, to_date, addr1, addr2, addr3, post_code) values (5759744, 1, '2099-12-31', '8 Schlimgen Terrace', '5111 Basil Avenue', 'LONDON', 'E0 1MO');
insert into hbhousehold (claim_id, house_id, to_date, addr1, addr2, addr3, post_code) values (6060591, 2, '2099-12-31', '8017 Garrison Point', '2 Lake View Crossing', 'LONDON', 'S3 1EV');
insert into hbhousehold (claim_id, house_id, to_date, addr1, addr2, addr3, post_code) values (5479047, 1, '2099-12-31', '320 Little Fleur Way', '62 Warrior Avenue', 'LONDON', 'L0 3DM');
insert into hbhousehold (claim_id, house_id, to_date, addr1, addr2, addr3, post_code) values (5879391, 3, '2099-12-31', '07 Orin Lane', '73 Steensland Terrace', 'LONDON', 'H5 2HM');
insert into hbhousehold (claim_id, house_id, to_date, addr1, addr2, addr3, post_code) values (6115325, 3, '2099-12-31', '2499 Toban Drive', '40 Butterfield Junction', 'LONDON', 'T6 2KQ');
insert into hbhousehold (claim_id, house_id, to_date, addr1, addr2, addr3, post_code) values (5696752, 12, '2019-07-14', '6037 Dexter Way', '1 Sommers Way', 'LONDON', 'H5 7ZN');
insert into hbhousehold (claim_id, house_id, to_date, addr1, addr2, addr3, post_code) values (6908963, 18, '2019-09-05', '4065 Debs Hill', '8491 John Wall Plaza', 'LONDON', 'R1 1GT');
insert into hbhousehold (claim_id, house_id, to_date, addr1, addr2, addr3, post_code) values (6724267, 9, '2019-05-01', '540 Pawling Street', '063 Mitchell Way', 'LONDON', 'U9 1CX');
insert into hbhousehold (claim_id, house_id, to_date, addr1, addr2, addr3, post_code) values (6969380, 20, '2019-04-28', '0 Clemons Place', '93931 Norway Maple Street', 'LONDON', 'F6 5QI');


---ACADEMY COUNCIL TAX---

CREATE TABLE [ctaccount] (
    [account_ref] int,
    [account_cd] nvarchar(1),
    [lead_liab_title] nvarchar(8),
    [lead_liab_name] nvarchar(32),
    [lead_liab_forename] nvarchar(32),
    [lead_liab_surname] nvarchar(32)
);

insert into ctaccount (account_ref, account_cd, lead_liab_title, lead_liab_name, lead_liab_forename, lead_liab_surname) values (472335332, '0', 'Ms', 'STERNDALE,MS ALFONSE', 'Alfonse', 'Sterndale');
insert into ctaccount (account_ref, account_cd, lead_liab_title, lead_liab_name, lead_liab_forename, lead_liab_surname) values (25664432, '4', 'MR', 'BULLIMORE,MR TATE', 'Tate', 'Bullimore');
insert into ctaccount (account_ref, account_cd, lead_liab_title, lead_liab_name, lead_liab_forename, lead_liab_surname) values (27126442, '1', 'Ms', 'MONCUR,MS ELWIRA', 'Elwira', 'Moncur');
insert into ctaccount (account_ref, account_cd, lead_liab_title, lead_liab_name, lead_liab_forename, lead_liab_surname) values (352059093, '9', 'Mrs', 'OLLIVIER,MRS VAL', 'Val', 'Ollivier');
insert into ctaccount (account_ref, account_cd, lead_liab_title, lead_liab_name, lead_liab_forename, lead_liab_surname) values (652268349, '2', 'Rev', 'PISCOPO,REV CLEMENTINA', 'Clementina', 'Piscopo');
insert into ctaccount (account_ref, account_cd, lead_liab_title, lead_liab_name, lead_liab_forename, lead_liab_surname) values (524457367, '6', 'Ms', 'ROSCRIGG,MS ALF', 'Alf', 'Roscrigg');
insert into ctaccount (account_ref, account_cd, lead_liab_title, lead_liab_name, lead_liab_forename, lead_liab_surname) values (3472806, '5', 'Mr', 'GOULBOURN,MR WORTHY', 'Worthy', 'Goulbourn');
insert into ctaccount (account_ref, account_cd, lead_liab_title, lead_liab_name, lead_liab_forename, lead_liab_surname) values (4392512, '6', 'Ms', 'LAURENTINO,MS EVIE', 'Evie', 'Laurentino');
insert into ctaccount (account_ref, account_cd, lead_liab_title, lead_liab_name, lead_liab_forename, lead_liab_surname) values (3383987, '5', 'Mr', 'MCKEAG,MR PHILLIDA', 'Phillida', 'McKeag');
insert into ctaccount (account_ref, account_cd, lead_liab_title, lead_liab_name, lead_liab_forename, lead_liab_surname) values (4599257, '0', 'Ms', 'KILLIGREW,MS PREN', 'Pren', 'Killigrew');

CREATE TABLE [ctproperty] (
    [property_ref] nvarchar(18),
    [addr1] nvarchar(35),
    [addr2] nvarchar(35),
    [addr3] nvarchar(32),
    [addr4] nvarchar(32),
    [postcode] nvarchar(8)
);

insert into ctproperty (property_ref, addr1, addr2, addr3, postcode) values ('109262008', '5 Northfield Park', '58 Muir Plaza','LONDON', 'T9 7KR');
insert into ctproperty (property_ref, addr1, addr2, addr3, postcode) values ('680348096', '50884 Westridge Road', '79 Talisman Point', 'LONDON','G6 7UB');
insert into ctproperty (property_ref, addr1, addr2, addr3, postcode) values ('109575307', '0 Claremont Alley', '6906 Northwestern Avenue', 'LONDON','I0 5XL');
insert into ctproperty (property_ref, addr1, addr2, addr3, postcode) values ('267583903', '92548 Kensington Junction', '090 Dixon Junction', 'LONDON','N9 8CK');
insert into ctproperty (property_ref, addr1, addr2, addr3, postcode) values ('149325830', '509 Cherokee Pass', '57 Truax Parkway', 'LONDON','T0 0TF');
insert into ctproperty (property_ref, addr1, addr2, addr3, postcode) values ('648485095', '25 Maple Wood Park', '3 Prairie Rose Alley', 'LONDON','Q0 0ZE');
insert into ctproperty (property_ref, addr1, addr2, addr3, postcode) values ('574217061', '0 Sauthoff Plaza', '10552 Hollow Ridge Center', 'LONDON','F4 4NM');
insert into ctproperty (property_ref, addr1, addr2, addr3, postcode) values ('119594222', '3105 West Road', '55 John Wall Parkway', 'LONDON','J6 2OK');
insert into ctproperty (property_ref, addr1, addr2, addr3, postcode) values ('829925393', '6 Killdeer Avenue', '4276 American Ash Terrace', 'LONDON','L8 5ZB');
insert into ctproperty (property_ref, addr1, addr2, addr3, postcode) values ('662772030', '70 Dottie Place', '48 Golf View Way', 'LONDON','B1 8VV');

CREATE TABLE [hbctaxclaim] (
    [claim_id] int,
    [ctax_claim_id] smallint,
    [ctax_ref] nvarchar(9)
);

insert into hbctaxclaim (claim_id, ctax_claim_id, ctax_ref) values (7368451, 3, '8156312075');
insert into hbctaxclaim (claim_id, ctax_claim_id, ctax_ref) values (5759744, 14, '256644324');
insert into hbctaxclaim (claim_id, ctax_claim_id, ctax_ref) values (5260765, 14, '271264421');
insert into hbctaxclaim (claim_id, ctax_claim_id, ctax_ref) values (2866464, 6, '3520590939');
insert into hbctaxclaim (claim_id, ctax_claim_id, ctax_ref) values (9359082, 8, '6522683492');
insert into hbctaxclaim (claim_id, ctax_claim_id, ctax_ref) values (8722915, 14, '5244573676');
insert into hbctaxclaim (claim_id, ctax_claim_id, ctax_ref) values (5260765, 3, '271264421');
insert into hbctaxclaim (claim_id, ctax_claim_id, ctax_ref) values (3581194, 7, '533269188');
insert into hbctaxclaim (claim_id, ctax_claim_id, ctax_ref) values (8903330, 13, '428069341');
insert into hbctaxclaim (claim_id, ctax_claim_id, ctax_ref) values (3690439, 4, '999702729');

CREATE TABLE [ctoccupation] (
    [account_ref] int,
    [property_ref] nvarchar(18),
    [vacation_date] datetime
);

insert into ctoccupation (account_ref, property_ref, vacation_date) values (815631207, '109262008', '2020-01-02');
insert into ctoccupation (account_ref, property_ref, vacation_date) values (25664432, '680348096', '2017-09-11');
insert into ctoccupation (account_ref, property_ref, vacation_date) values (27126442, '109575307', '2017-10-04');
insert into ctoccupation (account_ref, property_ref, vacation_date) values (5759744, '267583903', '2017-08-28');
insert into ctoccupation (account_ref, property_ref, vacation_date) values (652268349, '149325830', '2017-06-02');
insert into ctoccupation (account_ref, property_ref, vacation_date) values (524457367, '648485095', '2019-05-01');
insert into ctoccupation (account_ref, property_ref, vacation_date) values (205020645, '171903858', '2018-11-01');
insert into ctoccupation (account_ref, property_ref, vacation_date) values (107807366, '247646667', '2018-12-07');
insert into ctoccupation (account_ref, property_ref, vacation_date) values (864594800, '301103337', '2019-02-28');
insert into ctoccupation (account_ref, property_ref, vacation_date) values (998885383, '953980029', '2018-04-15');

---UHW-----
USE uhwlive;

CREATE TABLE [CCContact] (
    [ContactNo] int,
    [Forenames] varchar(40),
    [Surname] varchar(40),
    [Addr1] varchar(40),
    [Addr2] varchar(40),
    [Addr3] varchar(40),
    [Addr4] varchar(40),
    [PostCode] varchar(8),
    [NINo] varchar(12),
    [DOB] datetime,
    [UHContact] int,
);
insert into CCContact (ContactNo, Forenames, Surname, NINo, DOB, UHContact) values (8852263, 'Elwira', 'Moncur', 'CD877332Z', '1971-12-22', 9802781);
insert into CCContact (ContactNo, Forenames, Surname, NINo, DOB, UHContact) values (4186867, 'Arlyn', 'Wilce', 'XY1186882E', '1973-08-23', 3651747);
insert into CCContact (ContactNo, Forenames, Surname, NINo, DOB, UHContact) values (6240678, 'Arielle', 'Blenkharn', 'YV3079822V', '1987-06-18', 7741706);
insert into CCContact (ContactNo, Forenames, Surname, NINo, DOB, UHContact) values (9589034, 'Melisa', 'Hansbury', 'HB4070802G', '1954-04-27', 9229870);
insert into CCContact (ContactNo, Forenames, Surname, NINo, DOB, UHContact) values (2770924, 'Enrica', 'Haddacks', 'QW1666860W', '1953-01-08', 4288595);
insert into CCContact (ContactNo, Forenames, Surname, NINo, DOB, UHContact) values (7316698, 'Marion', 'Eisold', 'CZ7830863D', '1962-03-29', 3252753);
insert into CCContact (ContactNo, Forenames, Surname, NINo, DOB, UHContact) values (629036, 'Batholomew', 'Vacher', 'GT4627297R', '1970-07-11', 4808709);
insert into CCContact (ContactNo, Forenames, Surname, NINo, DOB, UHContact) values (5252968, 'Aksel', 'Applegarth', 'CX0622002B', '1963-05-06', 2815228);
insert into CCContact (ContactNo, Forenames, Surname, NINo, DOB, UHContact) values (6340257, 'Drucie', 'Donner', 'JI9527697X', '1953-08-18', 9680326);
insert into CCContact (ContactNo, Forenames, Surname, NINo, DOB, UHContact) values (1877088, 'Steve', 'Jenner', 'SZ8914270O', '1969-04-12', 1586922);