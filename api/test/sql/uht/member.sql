CREATE TABLE [dbo].member (
    [house_ref] char(10) DEFAULT (space((1))),
    [person_no] numeric(2,0) DEFAULT ((0)),
    [forename] char(24) DEFAULT (space((1))),
    [surname] char(20) DEFAULT (space((1))),
    [ni_no] char(12) DEFAULT (space((1))),
    [dob] uhdate DEFAULT (''),
);

insert into member (house_ref, person_no, forename, surname, ni_no, dob) values ("7131304020", 1, 'Hodge', 'Maskelyne', "730623760", '1981-06-01');
insert into member (house_ref, person_no, forename, surname, ni_no, dob) values ("2427775674", 2, 'Elwira', 'Moncur', "168773324", '1971-12-22');
insert into member (house_ref, person_no, forename, surname, ni_no, dob) values ("7887164068", 2, 'Dani', 'Beyn', "829267023", '1955-07-23');
insert into member (house_ref, person_no, forename, surname, ni_no, dob) values ("8073085119", 3, 'Rodrick', 'Kellitt', "652105512", '1983-08-11');
insert into member (house_ref, person_no, forename, surname, ni_no, dob) values ("7356865954", 1, 'Osmund', 'Watters', "249636468", '1992-10-27');
insert into member (house_ref, person_no, forename, surname, ni_no, dob) values ("1608405594", 2, 'Deana', 'De Luna', "514745725", '1984-03-03');
insert into member (house_ref, person_no, forename, surname, ni_no, dob) values ("1017288101", 1, 'Henrieta', 'Sterre', "918848361", '1999-03-17');
insert into member (house_ref, person_no, forename, surname, ni_no, dob) values ("4693143740", 2, 'Claudina', 'Soame', "802268319", '1948-08-17');
insert into member (house_ref, person_no, forename, surname, ni_no, dob) values ("1831722457", 1, 'Hartwell', 'Lorinez', "519495116", '1942-05-24');
insert into member (house_ref, person_no, forename, surname, ni_no, dob) values ("4186305455", 1, 'Sherline', 'Deveril', "593881422", '1973-12-18');