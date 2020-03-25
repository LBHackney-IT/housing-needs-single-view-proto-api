CREATE TABLE [dbo].contacts (
    [con_key] int DEFAULT ((0)),
    [con_ref] char(12) DEFAULT (space((1))),
    [con_address] char(200) DEFAULT (space((1))),
    [con_postcode] char(10) DEFAULT (space((1))),
);

