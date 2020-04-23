USE uhtlive;

CREATE TABLE [member] (
    [member_sid] int DEFAULT ((0)),
    [title] char(10) DEFAULT (space((1))),
    [house_ref] char(10) DEFAULT (space((1))),
    [person_no] numeric(2,0) DEFAULT ((0)),
    [forename] char(24) DEFAULT (space((1))),
    [surname] char(20) DEFAULT (space((1))),
    [ni_no] char(12) DEFAULT (space((1))),
    [dob] datetime DEFAULT (''),
);

insert into member (member_sid, title, house_ref, person_no, forename, surname, ni_no, dob) values (111111, 'Mr','9383795', 1, 'Hodge', 'Maskelyne', 'AB062376W', '1981-06-01');
insert into member (member_sid, title, house_ref, person_no, forename, surname, ni_no, dob) values (222222, 'Ms','6867133', 2, 'Elwira', 'Moncur', 'CD877332Z', '1971-12-22');
insert into member (member_sid, title, house_ref, person_no, forename, surname, ni_no, dob) values (333333, 'Ms','2966927', 2, 'Dani', 'Beyn', 'EF926702A', '1955-07-23');
insert into member (member_sid, title, house_ref, person_no, forename, surname, ni_no, dob) values (444444, 'Mr','4750013', 3, 'Rodrick', 'Kellitt', 'GH210551B', '1983-08-11');
insert into member (member_sid, title, house_ref, person_no, forename, surname, ni_no, dob) values (555555, 'Mr','8539472', 1, 'Osmund', 'Watters', 'JK963646C', '1992-10-27');
insert into member (member_sid, title, house_ref, person_no, forename, surname, ni_no, dob) values (666666, 'Ms','7375016', 2, 'Deana', 'De Luna', 'LM474572D', '1984-03-03');
insert into member (member_sid, title, house_ref, person_no, forename, surname, ni_no, dob) values (777777, 'Ms','8381960', 1, 'Henrieta', 'Sterre', 'NO884836E', '1999-03-17');
insert into member (member_sid, title, house_ref, person_no, forename, surname, ni_no, dob) values (888888, 'Ms','4595514', 2, 'Claudina', 'Soame', 'PR226831F', '1948-08-17');
insert into member (member_sid, title, house_ref, person_no, forename, surname, ni_no, dob) values (999999, 'Mr','8282501', 1, 'Hartwell', 'Lorinez', 'ST949511G', '1942-05-24');
insert into member (member_sid, title, house_ref, person_no, forename, surname, ni_no, dob) values (000000, 'Mr','1101447', 1, 'Sherline', 'Deveril', 'UV388142H', '1973-12-18');


---------------------

CREATE TABLE [contacts] (
    [con_key] int DEFAULT ((0)),
    [con_ref] char(12) DEFAULT (space((1))),
    [con_address] char(200) DEFAULT (space((1))),
    [con_postcode] char(10) DEFAULT (space((1))),
    [con_phone1] char(21) DEFAULT (space((1))),
    [con_phone2] char(21) DEFAULT (space((1))),
    [con_phone3] char(21) DEFAULT (space((1))),
);

insert into contacts (con_key, con_ref, con_address, con_postcode, con_phone1, con_phone2, con_phone3) values (3848, '9383795', '9 Anderson Trail', 'N16 5DZ', '07111111111', '07123456789', '02111111111');
insert into contacts (con_key, con_ref, con_address, con_postcode, con_phone1, con_phone2, con_phone3) values (7250, '6867133', '1 Mallard Circle', 'N1 5DZ', '07222222222', '07123456789', '02222222222');
insert into contacts (con_key, con_ref, con_address, con_postcode, con_phone1, con_phone2, con_phone3) values (6452, '2966927', '65 Bunker Hill Hill', 'N16 5Z', '07333333333', '07123456789', '02333333333');
insert into contacts (con_key, con_ref, con_address, con_postcode, con_phone1, con_phone2, con_phone3) values (4097, '4750013', '321 Ridgeview Plaza', 'N6 4Z', '07444444444', '07123456789', '02444444444');
insert into contacts (con_key, con_ref, con_address, con_postcode, con_phone1, con_phone2, con_phone3) values (3913, '8539472', '2695 Twin Pines Pass', 'A16 5Z', '07555555555', '07123456789', '02555555555');
insert into contacts (con_key, con_ref, con_address, con_postcode, con_phone1, con_phone2, con_phone3) values (6586, '7375016', '20 Debra Road', 'N16 5DZ', '07666666666', '07123456789', '02666666666');
insert into contacts (con_key, con_ref, con_address, con_postcode, con_phone1, con_phone2, con_phone3) values (5380, '8381960', '8019 Mariners Cove Lane', 'A2 B4', '07777777777', '07123456789', '02777777777');
insert into contacts (con_key, con_ref, con_address, con_postcode, con_phone1, con_phone2, con_phone3) values (3451, '4595514', '8735 Washington Way', 'R2 D2', '07888888888', '07123456789', '02111111111');
insert into contacts (con_key, con_ref, con_address, con_postcode, con_phone1, con_phone2, con_phone3) values (6976, '8282501', '55 Pankratz Point', 'N3 6Z', '07999999999', '07123456789', '02111111111');
insert into contacts (con_key, con_ref, con_address, con_postcode, con_phone1, con_phone2, con_phone3) values (4043, '1101447', '9 Veith Way', 'N34 6O', '07000000000', '07123456789', '02111111111');

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


---------------------
CREATE TABLE [tenagree] (
    [tag_ref] char(11) DEFAULT (space((1))),
    [prop_ref] char(12) DEFAULT (space((1))),
    [house_ref] char(10) DEFAULT (space((1))),
    [cot] smalldatetime DEFAULT (''),
    [eot] smalldatetime DEFAULT (''),
    [tenure] char(3) DEFAULT (space((1))),
    [prd_code] char(2) DEFAULT (space((1))),
    [rent] numeric(9,2) DEFAULT ((0)),
    [cur_bal] numeric(9,2) DEFAULT ((0)),
    [u_saff_rentacc] char(20) DEFAULT (space((1)))
);

insert into tenagree (tag_ref, prop_ref, house_ref, cot, eot, tenure, prd_code, cur_bal, u_saff_rentacc) values ('000023/02', '841461088', '9383795', '2018-05-29', '2013-05-22', 'SEC', 'WK', -716.51, '471436430');
insert into tenagree (tag_ref, prop_ref, house_ref, cot, eot, tenure, prd_code, cur_bal, u_saff_rentacc) values ('000038/08', '579165050', '6867133', '2005-11-08', '2018-03-21', 'DEC', 'KW', -669.98, '593507764');
insert into tenagree (tag_ref, prop_ref, house_ref, cot, eot, tenure, prd_code, cur_bal, u_saff_rentacc) values ('000060/06', '711532210', '2966927', '2014-01-02', '2017-02-08', 'SEC', 'WK', -431.32, '707650073');
insert into tenagree (tag_ref, prop_ref, house_ref, cot, eot, tenure, prd_code, cur_bal, u_saff_rentacc) values ('000039/01', '019363148', '4750013', '2006-06-03', '2014-07-26', 'SEC', 'WK', -859.92, '031500691');
insert into tenagree (tag_ref, prop_ref, house_ref, cot, eot, tenure, prd_code, cur_bal, u_saff_rentacc) values ('000027/02', '028269624', '8539472', '2000-06-26', '2017-02-06', 'SEC', 'WK', -942.84, '410710831');
insert into tenagree (tag_ref, prop_ref, house_ref, cot, eot, tenure, prd_code, cur_bal, u_saff_rentacc) values ('000072/01', '750770968', '7375016', '2007-08-16', '2012-07-21', 'SEC', 'WK', -869.94, '357903098');
insert into tenagree (tag_ref, prop_ref, house_ref, cot, eot, tenure, prd_code, cur_bal, u_saff_rentacc) values ('000056/02', '957152794', '8381960', '2001-12-16', '2010-05-28', 'SEC', 'WK', -860.06, '761340403');
insert into tenagree (tag_ref, prop_ref, house_ref, cot, eot, tenure, prd_code, cur_bal, u_saff_rentacc) values ('000071/01', '041581425', '4595514', '2011-12-20', '2012-10-29', 'SEC', 'WK', -292.14, '339439311');
insert into tenagree (tag_ref, prop_ref, house_ref, cot, eot, tenure, prd_code, cur_bal, u_saff_rentacc) values ('000051/04', '975605363', '8282501', '2004-11-16', '2014-02-16', 'SEC', 'WK', -380.65, '330021755');
insert into tenagree (tag_ref, prop_ref, house_ref, cot, eot, tenure, prd_code, cur_bal, u_saff_rentacc) values ('000030/01', '522127710', '1101447', '2003-05-07', '2011-12-21', 'SEC', 'WK', -254.84, '120587287');
---------------
CREATE TABLE [tenure] (
    [ten_type] char(3) DEFAULT (space(1)),
    [ten_desc] char(15) DEFAULT (space(1)),
);

insert into tenure (ten_type, ten_desc) values ('SEC', 'CIT Group ');
insert into tenure (ten_type, ten_desc) values ('DEC', 'FactSet Res');
insert into tenure (ten_type, ten_desc) values ('SEC', 'Customers ');
insert into tenure (ten_type, ten_desc) values ('SEC', 'Colony ');
insert into tenure (ten_type, ten_desc) values ('SEC', 'STERIS plc');
insert into tenure (ten_type, ten_desc) values ('SEC', 'Net , Inc.');
insert into tenure (ten_type, ten_desc) values ('SEC', 'United States');
insert into tenure (ten_type, ten_desc) values ('SEC', 'Cirrus Logic.');
insert into tenure (ten_type, ten_desc) values ('SEC', 'Amplify Snack');
insert into tenure (ten_type, ten_desc) values ('SEC', 'Fortress Bi');

--------------
CREATE TABLE [Addresses] (
    [prop_ref] char(12),
    [post_code] char(10),
    [post_preamble] char(60),
    [aline1] char(50),
    [aline2] char(50),
    [aline3] char(50),
    [aline4] char(50),
);

insert into Addresses (prop_ref, post_code, post_preamble, aline1, aline2, aline3) values ('841461088', 'VD5 48Q', '9 Luster Avenue', '416 Norway Maple Hill', 'Hackney', 'LONDON');
insert into Addresses (prop_ref, post_code, post_preamble, aline1, aline2, aline3) values ('579165050', 'DV9 17V', '7433 Armistice Pass', '07777 Claremont Terrace', 'Hackney', 'LONDON');
insert into Addresses (prop_ref, post_code, post_preamble, aline1, aline2, aline3) values ('711532210', 'MJ7 66N', '78 Lindbergh Circle', '4 Emmet Pass', 'Hackney', 'LONDON');
insert into Addresses (prop_ref, post_code, post_preamble, aline1, aline2, aline3) values ('019363148', 'LS4 70D', '56 Briar Crest Park', '858 Delladonna Alley', 'Hackney', 'LONDON');
insert into Addresses (prop_ref, post_code, post_preamble, aline1, aline2, aline3) values ('028269624', 'IA9 67R', '3 Debs Park', '82946 Arizona Court', 'Hackney', 'LONDON');
insert into Addresses (prop_ref, post_code, post_preamble, aline1, aline2, aline3) values ('750770968', 'TJ8 22N', '5 Hooker Hill', '352 Lakewood Park', 'Hackney', 'LONDON');
insert into Addresses (prop_ref, post_code, post_preamble, aline1, aline2, aline3) values ('957152794', 'UL1 77B', '58 Butternut Street', '04 Anhalt Court', 'Hackney', 'LONDON');
insert into Addresses (prop_ref, post_code, post_preamble, aline1, aline2, aline3) values ('041581425', 'YA8 01V', '34701 Westport Drive', '6 Vera Avenue', 'Hackney', 'LONDON');
insert into Addresses (prop_ref, post_code, post_preamble, aline1, aline2, aline3) values ('975605363', 'DS8 57Y', '39 Crowley Alley', '917 Vernon Road', 'Hackney', 'LONDON');
insert into Addresses (prop_ref, post_code, post_preamble, aline1, aline2, aline3) values ('522127710', 'AR1 72X', '35 Thierer Plaza', '25 Gina Alley', 'Hackney', 'LONDON');
--------------

CREATE TABLE [period] (
    [prd_code] char(2) DEFAULT (space(1)),
    [prd_desc] char(16) DEFAULT (space(1)),
);

insert into period (prd_code, prd_desc) values ('WK', 'Monthly(2th)');
insert into period (prd_code, prd_desc) values ('KW', 'Monthly(3th)');
insert into period (prd_code, prd_desc) values ('WK', 'Monthly(6th)');
insert into period (prd_code, prd_desc) values ('WK', 'Monthly(0th)');
insert into period (prd_code, prd_desc) values ('WK', 'Monthly(1th)');
insert into period (prd_code, prd_desc) values ('WK', 'Monthly(9th)');
insert into period (prd_code, prd_desc) values ('WK', 'Monthly(3th)');
insert into period (prd_code, prd_desc) values ('WK', 'Monthly(8th)');
insert into period (prd_code, prd_desc) values ('WK', 'Monthly(9th)');
insert into period (prd_code, prd_desc) values ('WK', 'Monthly(0th)');

--------------------UHT Housing Register--------------

CREATE TABLE [wlapp] (
    [app_ref] char(10) DEFAULT (space(1)),
    [post_code] char(10) DEFAULT (space(1)),
    [corr_addr] char(150) DEFAULT (space(1)),
    [con_key] int DEFAULT (0),
    [wl_status] char(3) DEFAULT (space(1)),
    [u_novalet_ref] char(7) DEFAULT (''),
    [app_band] char(3) DEFAULT (''),
    PRIMARY KEY ([app_ref])
);


insert into wlapp (app_ref, post_code, corr_addr, con_key, wl_status, u_novalet_ref, app_band) values ('DIR6940111', 'H04 7OT', '26 Toban Junction', 629314841, '200', '2000111', 'URG');
insert into wlapp (app_ref, post_code, corr_addr, con_key, wl_status, u_novalet_ref, app_band) values ('DIR4704058', 'O70 5TH', '3 Schlimgen Point', 530672748, '200', '2000111', 'GEN');
insert into wlapp (app_ref, post_code, corr_addr, con_key, wl_status, u_novalet_ref, app_band) values ('DIR5135951', 'DT0 0AX', '56264 Westport Lane', 302934398, '200', '2000111', 'URG');
insert into wlapp (app_ref, post_code, corr_addr, con_key, wl_status, u_novalet_ref, app_band) values ('DIR7479057', 'S09 4NH', '3 Mandrake Alley', 868776284, '200', '2000111', 'URG');
insert into wlapp (app_ref, post_code, corr_addr, con_key, wl_status, u_novalet_ref, app_band) values ('DIR7350104', 'L36 0TK', '0742 Victoria Alley', 726669153, '200', '2000111', 'GEN');
insert into wlapp (app_ref, post_code, corr_addr, con_key, wl_status, u_novalet_ref, app_band) values ('DIR3646682', 'UC9 8EQ', '7 Goodland Parkway', 995371469, '200', '2000111', 'URG');
insert into wlapp (app_ref, post_code, corr_addr, con_key, wl_status, u_novalet_ref, app_band) values ('DIR9055215', 'JX3 0ZK', '2 Arrowood Alley', 146114001, '200', '2000111', 'URG');
insert into wlapp (app_ref, post_code, corr_addr, con_key, wl_status, u_novalet_ref, app_band) values ('DIR1784557', 'T34 9II', '3 Coolidge Park', 172168279, '200', '2000111', 'RES');
insert into wlapp (app_ref, post_code, corr_addr, con_key, wl_status, u_novalet_ref, app_band) values ('DIR6421750', 'AT8 1OC', '7742 Northport Court', 412769753, '200', '2000111', 'URG');
insert into wlapp (app_ref, post_code, corr_addr, con_key, wl_status, u_novalet_ref, app_band) values ('DIR9610142', 'VM1 3AE', '4014 Vermont Road', 240815067, '200', '2000111', 'URG');

---------------------

CREATE TABLE [wlmember] (
    [app_ref] char(10) DEFAULT (space((1))),
    [person_no] numeric(2,0) DEFAULT ((0)),
    [dob] datetime DEFAULT (' '),
    [forename] char(24) DEFAULT (space((1))),
    [surname] char(20) DEFAULT (space((1))),
    [ni_no] char(12) DEFAULT (space((1))),
    [title] char(10) DEFAULT (space((1))),
    [home_phone] char(20) DEFAULT (space((1))),
    [work_phone] char(20) DEFAULT (space((1))),
    [u_memmobile] char(20) DEFAULT (space((1))),
    [m_address] char(150) DEFAULT (space((1))),
    [u_eff_band_date] smalldatetime DEFAULT (''),

);

insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no, title) values ('DIR6940111', 4, '1965-03-25', 'Hillel', 'Lorenz', 'AB106755C', 'Mr');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no, title) values ('DIR4704058', 5, '1971-12-22', 'Elwira', 'Moncur', 'CD877332Z', 'Ms');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no, title) values ('DIR5135951', 3, '1971-05-18', 'Imojean', 'D''Abbot-Doyle', 'CC808991F', 'Mr');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no, title) values ('DIR7479057', 1, '1983-08-11', 'Rodrick', 'Kellitt', 'GH210551B', 'Mr')
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no, title) values ('DIR7350104', 1, '1965-08-15', 'Zilvia', 'Tomaello', 'RF735670C', 'Ms');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no, title) values ('DIR3646682', 1, '1975-04-13', 'Dasha', 'Sanchez', 'GD345625V', 'Mr');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no, title) values ('DIR9055215', 6, '1962-07-03', 'Marget', 'Rubie', 'JE799725S', 'Mr');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no, title) values ('DIR1784557', 2, '1979-12-15', 'Hartwell', 'Lorinez', 'KK933624D', 'Mr');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no, title) values ('DIR6421750', 2, '1979-12-14', 'Eadie', 'Bullan', 'JE019827F', 'Mr');
insert into wlmember (app_ref, person_no, dob, forename, surname, ni_no, title) values ('DIR9610142', 5, '1969-11-29', 'Nadya', 'Montes', 'ME918699A', 'Miss');
--------------------
CREATE TABLE [wlaneeds] (
    [app_ref] char(10) DEFAULT (space(1)),
    [r_to] char(20) DEFAULT (space(1)),
    [field_ref] char(20) DEFAULT (space(1))
);

insert into wlaneeds (app_ref, r_to, field_ref) values ('DIR6940111', '1', 'num_bedrooms');
insert into wlaneeds (app_ref, r_to, field_ref) values ('DIR4704058', '1', 'num_bedrooms');
insert into wlaneeds (app_ref, r_to, field_ref) values ('DIR5135951', '2', 'num_bedrooms');
insert into wlaneeds (app_ref, r_to, field_ref) values ('DIR7479057', '1', 'num_bedrooms');
insert into wlaneeds (app_ref, r_to, field_ref) values ('DIR7350104', '2', 'num_bedrooms');
insert into wlaneeds (app_ref, r_to, field_ref) values ('DIR3646682', '1', 'num_bedrooms');
insert into wlaneeds (app_ref, r_to, field_ref) values ('DIR9055215', '1', 'num_bedrooms');
insert into wlaneeds (app_ref, r_to, field_ref) values ('DIR1784557', '2', 'num_bedrooms');
insert into wlaneeds (app_ref, r_to, field_ref) values ('DIR6421750', '2', 'num_bedrooms');
insert into wlaneeds (app_ref, r_to, field_ref) values ('DIR9610142', '1', 'num_bedrooms');

-------ACADEMY BENEFITS---------

USE HBCTLIVEDB;

CREATE TABLE [hbclaim] (
    [claim_id] int,
    [check_digit] nvarchar(1),
    [status_ind] int
);


insert into hbclaim (claim_id, check_digit, status_ind) values (5260765, '6', 1);
insert into hbclaim (claim_id, check_digit, status_ind) values (5759744, '0', 2);
insert into hbclaim (claim_id, check_digit, status_ind) values (6060591, '3', 3);
insert into hbclaim (claim_id, check_digit, status_ind) values (5479047, '8', 4);
insert into hbclaim (claim_id, check_digit, status_ind) values (5879391, '3', 5);
insert into hbclaim (claim_id, check_digit, status_ind) values (6115325, '5', 6);
insert into hbclaim (claim_id, check_digit, status_ind) values (5587103, '4', 7);
insert into hbclaim (claim_id, check_digit, status_ind) values (5315153, '5', 8);
insert into hbclaim (claim_id, check_digit, status_ind) values (5167284, '3', 9);
insert into hbclaim (claim_id, check_digit, status_ind) values (5448076, '2', 0);

CREATE TABLE [hbmember] (
    [claim_id] int,
    [house_id] smallint,
    [person_ref] int,
    [surname] nvarchar(32),
    [forename] nvarchar(32),
    [birth_date] datetime2(7),
    [nino] nvarchar(10),
    [title] nvarchar(4)
);


insert into hbmember (claim_id, house_id, person_ref, surname, forename, birth_date, nino, title) values (5260765, 1, 1, 'Moncur', 'Elwira', '1971-12-22', 'CD877332Z', 'Ms');
insert into hbmember (claim_id, house_id, person_ref, surname, forename, birth_date, nino, title) values (5759744, 1, 1, 'Bullimore', 'Tate', '1971-09-25', 'CD877534Z', 'Ms');
insert into hbmember (claim_id, house_id, person_ref, surname, forename, birth_date, nino, title) values (6060591, 2, 2, 'Beden', 'Flor', '1981-02-08', 'CD877342Z', 'Mr');
insert into hbmember (claim_id, house_id, person_ref, surname, forename, birth_date, nino, title) values (5479047, 1, 1, 'Veare', 'Arlette', '1986-11-07', 'CD657332Z', 'Mr');
insert into hbmember (claim_id, house_id, person_ref, surname, forename, birth_date, nino, title) values (5879391, 3, 3, 'Manoelli', 'Nanny', '1987-05-22', 'CF877332Z', 'Ms');
insert into hbmember (claim_id, house_id, person_ref, surname, forename, birth_date, nino, title) values (6115325, 3, 3, 'Wegener', 'Tera', '1969-08-09', 'CD877332O', 'Mr');
insert into hbmember (claim_id, house_id, person_ref, surname, forename, birth_date, nino, title) values (6233154, 17, 2, 'Wherrett', 'Ruggiero', '1989-08-07', 'CD877355Z', 'Mr');
insert into hbmember (claim_id, house_id, person_ref, surname, forename, birth_date, nino, title) values (6534331, 11, 1, 'Metzing', 'Adara', '1949-12-29', 'CD877334E', 'Mrs');
insert into hbmember (claim_id, house_id, person_ref, surname, forename, birth_date, nino, title) values (6111340, 5, 3, 'Swettenham', 'Babara', '1941-08-05', 'FF577332Z', 'Miss');
insert into hbmember (claim_id, house_id, person_ref, surname, forename, birth_date, nino, title) values (5932526, 11, 1, 'Bourthouloume', 'Damaris', '1944-10-03', 'CE354652Z', 'Mr');

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
---------------------
CREATE TABLE [hbincome] (
    [claim_id] int,
    [house_id] smallint,
    [inc_amt] numeric(14,2),
    [freq_period] smallint,
    [freq_len] smallint,
    [inc_code] nvarchar(3),
);

insert into hbincome (claim_id, house_id, inc_amt, freq_period, freq_len, inc_code) values (5260765, 1, 89.56, 1, 2, 'DLL');
insert into hbincome (claim_id, house_id, inc_amt, freq_period, freq_len, inc_code) values (5759744, 1, 27.61, 1, 2, 'DLL');
insert into hbincome (claim_id, house_id, inc_amt, freq_period, freq_len, inc_code) values (6060591, 2, 2.03, 1, 2, 'DLL');
insert into hbincome (claim_id, house_id, inc_amt, freq_period, freq_len, inc_code) values (5479047, 1, 29.48, 1, 2, 'DLL');
insert into hbincome (claim_id, house_id, inc_amt, freq_period, freq_len, inc_code) values (5879391, 3, 22.47, 1, 2, 'DLL');
insert into hbincome (claim_id, house_id, inc_amt, freq_period, freq_len, inc_code) values (6115325, 3, 2.25, 1, 2, 'DLL');
insert into hbincome (claim_id, house_id, inc_amt, freq_period, freq_len, inc_code) values (5696752, 1, 67.75, 1, 2, 'YTS');
insert into hbincome (claim_id, house_id, inc_amt, freq_period, freq_len, inc_code) values (6908963, 1, 58.08, 1, 2, 'YTS');
insert into hbincome (claim_id, house_id, inc_amt, freq_period, freq_len, inc_code) values (6724267, 9, 25.13, 1, 2, 'YTS');
insert into hbincome (claim_id, house_id, inc_amt, freq_period, freq_len, inc_code) values (6969380, 2, 45.08, 1, 2, 'YTS');
-----------------------
CREATE TABLE [hbinccode] (
    [code] nvarchar(3),
    [to_date] datetime2(7),
    [descrip1] nvarchar(64)
);

insert into hbinccode (code, to_date, descrip1) values ('DLL', '2099-12-31', 'Future-proofed motivating workforce');
insert into hbinccode (code, to_date, descrip1) values ('DLL', '2099-12-31', 'Virtual encompassing internet solution');
insert into hbinccode (code, to_date, descrip1) values ('DLL', '2099-12-31', 'Multi-lateral tertiary extranet');
insert into hbinccode (code, to_date, descrip1) values ('DLL', '2099-12-31', 'Advanced clear-thinking algorithm');
insert into hbinccode (code, to_date, descrip1) values ('YTS', '2099-12-31', 'Managed methodical framework');
insert into hbinccode (code, to_date, descrip1) values ('YTS', '2099-12-31', 'Enterprise-wide coherent service-desk');
insert into hbinccode (code, to_date, descrip1) values ('YTS', '2099-12-31', 'Team-oriented system-worthy migration');
insert into hbinccode (code, to_date, descrip1) values ('YTS', '2099-12-31', 'Multi-channelled holistic alliance');
insert into hbinccode (code, to_date, descrip1) values ('YTS', '2099-12-31', 'Face to face responsive architecture');
insert into hbinccode (code, to_date, descrip1) values ('YTS', '2099-12-31', 'Innovative tertiary monitoring');

---ACADEMY COUNCIL TAX---

CREATE TABLE [ctaccount] (
    [account_ref] int,
    [account_cd] nvarchar(1),
    [lead_liab_title] nvarchar(8),
    [lead_liab_name] nvarchar(32),
    [lead_liab_forename] nvarchar(32),
    [lead_liab_surname] nvarchar(32),
    [for_addr1] nvarchar(32),
    [for_addr2] nvarchar(32),
    [for_addr3] nvarchar(32),
    [for_addr4] nvarchar(32),
    [for_postcode] nvarchar(8),
    [paymeth_code] nvarchar(5)
);


insert into ctaccount (account_ref, account_cd, lead_liab_title, lead_liab_name, lead_liab_forename, lead_liab_surname, for_addr1, for_addr2, for_addr3, for_addr4, for_postcode, paymeth_code) values (815631207, '5', 'Ms', 'COOKE,MS NADY', 'Nady', 'Cooke','6 Cascade Junction', '49','Norway Maple Pass', 'LONDON', 'I3 0RP', 'CASHM');
insert into ctaccount (account_ref, account_cd, lead_liab_title, lead_liab_name, lead_liab_forename, lead_liab_surname, for_addr1, for_addr2, for_addr3, for_addr4, for_postcode, paymeth_code) values (2566443, '4', 'mr', 'BULLIMORE,MR TATE', 'Tate', 'Bullimore','8 Schlimgen Terrace', '5111', 'Basil Avenue', 'LONDON', 'E0 1MO', 'CASHM');
insert into ctaccount (account_ref, account_cd, lead_liab_title, lead_liab_name, lead_liab_forename, lead_liab_surname, for_addr1, for_addr2, for_addr3, for_addr4, for_postcode, paymeth_code) values (27126442, '1', 'Ms', 'MONCUR,MS ELWIRA', 'Elwira', 'Moncur','8017 Garrison Point', '2', 'Lake View Crossing', 'LONDON', 'S3 1EV', 'CASHM');
insert into ctaccount (account_ref, account_cd, lead_liab_title, lead_liab_name, lead_liab_forename, lead_liab_surname, for_addr1, for_addr2, for_addr3, for_addr4, for_postcode, paymeth_code) values (35205909, '9', 'Mrs', 'OLLIVIER,MRS VAL', 'Val', 'Ollivier','320 Little Fleur Way', '62', 'Warrior Avenue', 'LONDON', 'L0 3DM', 'CASHM');
insert into ctaccount (account_ref, account_cd, lead_liab_title, lead_liab_name, lead_liab_forename, lead_liab_surname, for_addr1, for_addr2, for_addr3, for_addr4, for_postcode, paymeth_code) values (652268349, '2', 'Rev', 'PISCOPO,REV CLEMENTINA', 'Clementina', 'Piscopo','07 Orin Lane', '73', 'Steensland Terrace', 'LONDON', 'H5 2HM', 'CASHM');
insert into ctaccount (account_ref, account_cd, lead_liab_title, lead_liab_name, lead_liab_forename, lead_liab_surname, for_addr1, for_addr2, for_addr3, for_addr4, for_postcode, paymeth_code) values (524457367, '6', 'Ms', 'ROSCRIGG,MS ALF', 'Alf', 'Roscrigg','2499 Toban Drive', '40 Butterfield', 'Junction', 'LONDON', 'T6 2KQ', 'CASHM');
insert into ctaccount (account_ref, account_cd, lead_liab_title, lead_liab_name, lead_liab_forename, lead_liab_surname, for_addr1, for_addr2, for_addr3, for_addr4, for_postcode, paymeth_code) values (3472806, '5', 'Mr', 'GOULBOURN,MR WORTHY', 'Worthy', 'Goulbourn','6037 Dexter Way', '1', 'Sommers Way', 'LONDON', 'H5 7ZN', 'CASHM');
insert into ctaccount (account_ref, account_cd, lead_liab_title, lead_liab_name, lead_liab_forename, lead_liab_surname, for_addr1, for_addr2, for_addr3, for_addr4, for_postcode, paymeth_code) values (4392512, '6', 'Ms', 'LAURENTINO,MS EVIE', 'Evie', 'Laurentino','4065 Debs Hill', '8491', 'John Wall Plaza', 'LONDON', 'R1 1GT', 'CASHM');
insert into ctaccount (account_ref, account_cd, lead_liab_title, lead_liab_name, lead_liab_forename, lead_liab_surname, for_addr1, for_addr2, for_addr3, for_addr4, for_postcode, paymeth_code) values (3383987, '5', 'Mr', 'MCKEAG,MR PHILLIDA', 'Phillida', 'McKeag','540 Pawling Street', '063', 'Mitchell Way', 'LONDON', 'U9 1CX', 'CASHM');
insert into ctaccount (account_ref, account_cd, lead_liab_title, lead_liab_name, lead_liab_forename, lead_liab_surname, for_addr1, for_addr2, for_addr3, for_addr4, for_postcode, paymeth_code) values (4599257, '0', 'Ms', 'KILLIGREW,MS PREN', 'Pren', 'Killigrew','0 Clemons Place', '93931', 'Norway Maple Street', 'LONDON', 'F6 5QI', 'CASHM');


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

insert into hbctaxclaim (claim_id, ctax_claim_id, ctax_ref) values (7368451, 3, '81563120');
insert into hbctaxclaim (claim_id, ctax_claim_id, ctax_ref) values (5759744, 1, '25664434');
insert into hbctaxclaim (claim_id, ctax_claim_id, ctax_ref) values (5260765, 1, '271264421');
insert into hbctaxclaim (claim_id, ctax_claim_id, ctax_ref) values (2866464, 6, '35200939');
insert into hbctaxclaim (claim_id, ctax_claim_id, ctax_ref) values (9359082, 8, '65683492');
insert into hbctaxclaim (claim_id, ctax_claim_id, ctax_ref) values (8722915, 1, '5573676');
insert into hbctaxclaim (claim_id, ctax_claim_id, ctax_ref) values (2743325, 3, '21264421');
insert into hbctaxclaim (claim_id, ctax_claim_id, ctax_ref) values (3581194, 7, '5269188');
insert into hbctaxclaim (claim_id, ctax_claim_id, ctax_ref) values (8903330, 1, '4069341');
insert into hbctaxclaim (claim_id, ctax_claim_id, ctax_ref) values (3690439, 4, '9702729');

CREATE TABLE [ctoccupation] (
    [account_ref] int,
    [property_ref] nvarchar(18),
    [vacation_date] datetime
);

insert into ctoccupation (account_ref, property_ref, vacation_date) values (815631207, '109262008', '2020-01-02');
insert into ctoccupation (account_ref, property_ref, vacation_date) values (2566443, '680348096', '2017-09-11');
insert into ctoccupation (account_ref, property_ref, vacation_date) values (27126442, '109575307', '2017-10-04');
insert into ctoccupation (account_ref, property_ref, vacation_date) values (35205909, '267583903', '2017-08-28');
insert into ctoccupation (account_ref, property_ref, vacation_date) values (652268349, '149325830', '2017-06-02');
insert into ctoccupation (account_ref, property_ref, vacation_date) values (524457367, '648485095', '2019-05-01');
insert into ctoccupation (account_ref, property_ref, vacation_date) values (205020645, '171903858', '2018-11-01');
insert into ctoccupation (account_ref, property_ref, vacation_date) values (107807366, '247646667', '2018-12-07');
insert into ctoccupation (account_ref, property_ref, vacation_date) values (864594800, '301103337', '2019-02-28');
insert into ctoccupation (account_ref, property_ref, vacation_date) values (998885383, '953980029', '2018-04-15');
-------------
CREATE TABLE [vw_acc_bal] (
    [account_ref] int,
    [total] numeric
);

insert into vw_acc_bal (account_ref, total) values (815631207, 0.00);
insert into vw_acc_bal (account_ref, total) values (2566443, 0.00);
insert into vw_acc_bal (account_ref, total) values (27126442, 5.00);
insert into vw_acc_bal (account_ref, total) values (35205909, 13.50);
insert into vw_acc_bal (account_ref, total) values (652268349, 0.00);
insert into vw_acc_bal (account_ref, total) values (524457367, 8.00);
insert into vw_acc_bal (account_ref, total) values (3472806, 0.00);
insert into vw_acc_bal (account_ref, total) values (4392512, 0.00);
insert into vw_acc_bal (account_ref, total) values (3383987, 0.00);
insert into vw_acc_bal (account_ref, total) values (4599257, 0.00);


-------------
CREATE TABLE [ctpaymethod] (
    [paymeth_code] nvarchar(5),
    [paymeth_year] datetime,
    [paymeth_desc] nvarchar(60)
);

insert into ctpaymethod (paymeth_code, paymeth_year, paymeth_desc) values ('CASHM', '2019-04-01', 'Future-proofed motivating workforce');
insert into ctpaymethod (paymeth_code, paymeth_year, paymeth_desc) values ('CASHM', '2019-04-01', 'Virtual encompassing internet solution');
insert into ctpaymethod (paymeth_code, paymeth_year, paymeth_desc) values ('CASHM', '2019-04-01', 'Multi-lateral tertiary extranet');
insert into ctpaymethod (paymeth_code, paymeth_year, paymeth_desc) values ('CASHM', '2019-04-01', 'Advanced clear-thinking algorithm');
insert into ctpaymethod (paymeth_code, paymeth_year, paymeth_desc) values ('CASHM', '2019-04-01', 'Managed methodical framework');
insert into ctpaymethod (paymeth_code, paymeth_year, paymeth_desc) values ('CASHM', '2019-04-01', 'Enterprise-wide coherent service-desk');
insert into ctpaymethod (paymeth_code, paymeth_year, paymeth_desc) values ('CASHM', '2019-04-01', 'Team-oriented system-worthy migration');
insert into ctpaymethod (paymeth_code, paymeth_year, paymeth_desc) values ('CASHM', '2019-04-01', 'Multi-channelled holistic alliance');
insert into ctpaymethod (paymeth_code, paymeth_year, paymeth_desc) values ('CASHM', '2019-04-01', 'Face to face responsive architecture');
insert into ctpaymethod (paymeth_code, paymeth_year, paymeth_desc) values ('CASHM', '2019-04-01', 'Innovative tertiary monitoring');
---------------

CREATE TABLE [dbo].[cttransaction] (
    [process_date] datetime2(7),
    [tran_code] nvarchar(4),
    [tran_amount] numeric(14,2),
    [account_ref] int
);

insert into cttransaction (process_date, tran_code, tran_amount, account_ref) values ('2019-04-01', 'AEMA', 34.77, 815631207);
insert into cttransaction (process_date, tran_code, tran_amount, account_ref) values ('2019-04-01', 'ACCE', 35.77, 2566443);
insert into cttransaction (process_date, tran_code, tran_amount, account_ref) values ('2019-04-01', 'AEMA', 33.77, 27126442);
insert into cttransaction (process_date, tran_code, tran_amount, account_ref) values ('2019-04-01', 'ALEP', 32.77, 35205909);
insert into cttransaction (process_date, tran_code, tran_amount, account_ref) values ('2019-04-01', 'AEMA', 31.77, 652268349);
insert into cttransaction (process_date, tran_code, tran_amount, account_ref) values ('2019-04-01', 'AEMB', 37.97, 524457367);
insert into cttransaction (process_date, tran_code, tran_amount, account_ref) values ('2019-04-01', 'ALEP', 34.07, 3472806);
insert into cttransaction (process_date, tran_code, tran_amount, account_ref) values ('2019-04-01', 'AEMA', 34.57, 4392512);
insert into cttransaction (process_date, tran_code, tran_amount, account_ref) values ('2019-04-01', 'AEMB', 34.75, 3383987);
insert into cttransaction (process_date, tran_code, tran_amount, account_ref) values ('2019-04-01', 'AEMA', 34.37, 4599257);
---------------
CREATE TABLE [dbo].[cttrancode] (
    [tran_code] char(4),
    [tran_desc] varchar(30)
);
insert into cttrancode (tran_code, tran_desc) values ('AEMA', 'description 1');
insert into cttrancode (tran_code, tran_desc) values ('ACCE', 'description 2');
insert into cttrancode (tran_code, tran_desc) values ('AEMA', 'description 3');
insert into cttrancode (tran_code, tran_desc) values ('ALEP', 'description 4');
insert into cttrancode (tran_code, tran_desc) values ('AEMA', 'description 5');
insert into cttrancode (tran_code, tran_desc) values ('AEMB', 'description 6');
insert into cttrancode (tran_code, tran_desc) values ('ALEP', 'description 7');
insert into cttrancode (tran_code, tran_desc) values ('AEMA', 'description 8');
insert into cttrancode (tran_code, tran_desc) values ('AEMB', 'description 9');
insert into cttrancode (tran_code, tran_desc) values ('AEMA', 'description 0');

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
    [Title] varchar(4),
    [EmailAddress] varchar(255)
);

insert into CCContact (ContactNo, Forenames, Surname, NINo, DOB, UHContact, Title, EmailAddress) values (8852263, 'Elwira', 'Moncur', 'CD877332Z', '1971-12-22', 9802781, 'Ms', 'Elwira.M@yahoo.com');
insert into CCContact (ContactNo, Forenames, Surname, NINo, DOB, UHContact, Title, EmailAddress) values (4186867, 'Arlyn', 'Wilce', 'XY1186882E', '1973-08-23', 3651747, 'Ms', 'Arlyn.W@yahoo.com');
insert into CCContact (ContactNo, Forenames, Surname, NINo, DOB, UHContact, Title, EmailAddress) values (6240678, 'Arielle', 'Blenkharn', 'YV3079822V', '1987-06-18', 7741706, 'Mr', 'Arielle.B@yahoo.com');
insert into CCContact (ContactNo, Forenames, Surname, NINo, DOB, UHContact, Title, EmailAddress) values (9589034, 'Melisa', 'Hansbury', 'HB4070802G', '1954-04-27', 9229870, 'Mr', 'Melisa.H@yahoo.com');
insert into CCContact (ContactNo, Forenames, Surname, NINo, DOB, UHContact, Title, EmailAddress) values (2770924, 'Enrica', 'Haddacks', 'QW1666860W', '1953-01-08', 4288595, 'Mrs', 'Enrica.H@yahoo.com');
insert into CCContact (ContactNo, Forenames, Surname, NINo, DOB, UHContact, Title, EmailAddress) values (7316698, 'Marion', 'Eisold', 'CZ7830863D', '1962-03-29', 3252753, 'Ms', 'Marion.E@yahoo.com');
insert into CCContact (ContactNo, Forenames, Surname, NINo, DOB, UHContact, Title, EmailAddress) values (629036, 'Batholomew', 'Vacher', 'GT4627297R', '1970-07-11', 4808709, 'Mr', 'Batholomew.V@yahoo.com');
insert into CCContact (ContactNo, Forenames, Surname, NINo, DOB, UHContact, Title, EmailAddress) values (5252968, 'Aksel', 'Applegarth', 'CX0622002B', '1963-05-06', 2815228, 'Mr', 'Aksel.A@yahoo.com');
insert into CCContact (ContactNo, Forenames, Surname, NINo, DOB, UHContact, Title, EmailAddress) values (6340257, 'Drucie', 'Donner', 'JI9527697X', '1953-08-18', 9680326, 'Ms', 'Drucie.D@yahoo.com');
insert into CCContact (ContactNo, Forenames, Surname, NINo, DOB, UHContact, Title, EmailAddress) values (1877088, 'Steve', 'Jenner', 'SZ8914270O', '1969-04-12', 1586922, 'Mr', 'Steve.J@yahoo.com');
