TRUNCATE TABLE mpi."Patient" RESTART IDENTITY CASCADE;

INSERT INTO mpi."Patient" (prefix,family,gender,deceased,birthDate)
VALUES
('Mr', 'Doe', 1,false,'1970-01-01'),
('Mrs', 'Doe',2,false,'1971-02-02'),
('Mr', 'Bloggs',1,false,'1973-03-03'),
('Mrs', 'Bloggs',2,false,'1974-04-04');

INSERT INTO mpi."Identifier" (value, patientId)
VALUES
('1234567890', 1),
('2345678901', 2),
('3456789012', 3),
('4567890123', 4);

INSERT INTO mpi."Given_Name" (value, patientId)
VALUES
('John', 1),
('Jane', 2),
('Billy', 3),
('Betty', 4);

INSERT INTO mpi."Address" (line1, line2, city, district, postalCode, country, patientId)
VALUES
('139  Princes Street','','Romanby','Falkirk','DL7 5AF','UK', 1),
('99  Bouverie Road','','Robeston Wathen','East Sussex','SA67 9XF','UK', 2),
('90  Gloucester Road','','Clashban','Norfolk','IV25 9SU','UK', 3),
('88  Redcliffe Way','','Woodthorpe','Merseyside','S43 0NB','UK', 4);

INSERT INTO mpi."Telecom" (value, used, patientId)
VALUES
('000-111-2222', 'Home', 1),
('111-111-2222', 'Home', 2),
('222-111-2222', 'Home', 3),
('333-111-2222', 'Home', 4);