INSERT INTO mpi."Patient" (prefix,family,telecom,gender,deceased,birthDate)
VALUES
('Mr', 'Doe', '000-111-2222',1,false,'1970-01-01'),
('Mrs', 'Doe', '111-222-3333',2,false,'1971-02-02'),
('Mr', 'Bloggs', '222-333-4444',1,false,'1973-03-03'),
('Mrs', 'Bloggs', '333-444-5555',2,false,'1974-04-04');

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