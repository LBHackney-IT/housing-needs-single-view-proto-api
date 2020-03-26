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