CREATE TABLE [dbo].[wlmember] (
    [app_ref] char(10) DEFAULT (space((1))),
    [person_no] numeric(2,0) DEFAULT ((0)),
    [dob] uhdate DEFAULT (' '),
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