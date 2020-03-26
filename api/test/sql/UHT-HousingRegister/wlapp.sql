CREATE TABLE [dbo].[wlapp] (
    [app_ref] char(10) DEFAULT (space(1)),
    [post_code] char(10) DEFAULT (space(1)),
    [corr_addr] char(150) DEFAULT (space(1)),
    [con_key] int DEFAULT (0),
    PRIMARY KEY ([app_ref])
);

insert into wlmember (app_ref, post_code, corr_addr, con_key) values ('DIR6940111', 'H04 7OT', '26 Toban Junction', 629314841);
insert into wlmember (app_ref, post_code, corr_addr, con_key) values ('DIR4704058', 'O70 5TH', '3 Schlimgen Point', 530672748);
insert into wlmember (app_ref, post_code, corr_addr, con_key) values ('DIR5135951', 'DT0 0AX', '56264 Westport Lane', 302934398);
insert into wlmember (app_ref, post_code, corr_addr, con_key) values ('DIR7479057', 'S09 4NH', '3 Mandrake Alley', 868776284);
insert into wlmember (app_ref, post_code, corr_addr, con_key) values ('DIR7350104', 'L36 0TK', '0742 Victoria Alley', 726669153);
insert into wlmember (app_ref, post_code, corr_addr, con_key) values ('DIR3646682', 'UC9 8EQ', '7 Goodland Parkway', 995371469);
insert into wlmember (app_ref, post_code, corr_addr, con_key) values ('DIR9055215', 'JX3 0ZK', '2 Arrowood Alley', 146114001);
insert into wlmember (app_ref, post_code, corr_addr, con_key) values ('DIR1784557', 'T34 9II', '3 Coolidge Park', 172168279);
insert into wlmember (app_ref, post_code, corr_addr, con_key) values ('DIR6421750', 'AT8 1OC', '7742 Northport Court', 412769753);
insert into wlmember (app_ref, post_code, corr_addr, con_key) values ('DIR9610142', 'VM1 3AE', '4014 Vermont Road', 240815067);