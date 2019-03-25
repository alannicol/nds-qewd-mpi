SELECT P.id, I.value AS identity, P.prefix, N.value AS given,P.family, G.description as gender, P.birthdate, P.deceased, 
A.line1 as street, A.city, A.district, A.country, A.postalcode, T.value from mpi."Patient" AS P 
INNER JOIN mpi."Identifier" AS I ON I.patientId = P.id
INNER JOIN mpi."Given_Name" AS N ON N.patientId = P.id
INNER JOIN mpi."Gender" AS G ON P.gender = G.id
INNER JOIN mpi."Address" AS A ON A.patientId = P.id
INNER JOIN mpi."Telecom" AS T ON T.patientId = P.id
WHERE P.id = 1

SELECT P.id, I.value AS identity, P.prefix, N.value AS given,P.family, G.description as gender, P.birthdate, P.deceased, 
A.line1 as street, A.city, A.district, A.country, A.postalcode, T.value from mpi."Patient" AS P 
INNER JOIN mpi."Identifier" AS I ON I.patientId = P.id
INNER JOIN mpi."Given_Name" AS N ON N.patientId = P.id
INNER JOIN mpi."Gender" AS G ON P.gender = G.id
INNER JOIN mpi."Address" AS A ON A.patientId = P.id
INNER JOIN mpi."Telecom" AS T ON T.patientId = P.id
WHERE P.family = 'Bloggs'

INSERT INTO mpi."Patient" (prefix,family,gender,deceased,birthDate)
VALUES
('Mr', 'Doe' ,1,false,'1970-01-01') RETURNING id;

INSERT INTO mpi."Identifier" (value, patientId)
VALUES
('1234567890', id);

INSERT INTO mpi."Given_Name" (value, patientId)
VALUES
('John', id);

INSERT INTO mpi."Address" (line1, line2, city, district, postalCode, country, patientId)
VALUES
('139  Princes Street','','Romanby','Falkirk','DL7 5AF','UK', id);

INSERT INTO mpi."Telecom" (value, used, patientId)
VALUES
('000-111-2222', 'Home', 1);

