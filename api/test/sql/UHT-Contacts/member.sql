CREATE TABLE [dbo].[member] (
    [house_ref] char(10) DEFAULT (space((1))),
    [person_no] numeric(2,0) DEFAULT ((0)),
    [forename] char(24) DEFAULT (space((1))),
    [surname] char(20) DEFAULT (space((1))),
    [ni_no] char(12) DEFAULT (space((1))),
    [dob] uhdate DEFAULT (''),
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