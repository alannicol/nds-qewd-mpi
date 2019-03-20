const log = require("../utils/logger.js");
const config = require('../configuration/global_config.json');
const pg = require('pg');

const GET_PATIENT_QUERY = 'SELECT P.id, I.value AS identity, P.prefix, N.value AS given,P.family, G.description as gender, P.birthdate, P.deceased,' +
'A.line1 as street, A.city, A.district, A.country, A.postalcode, P.telecom from mpi."Patient" AS P ' +
'INNER JOIN mpi."Identifier" AS I ON I.patientId = P.id ' +
'INNER JOIN mpi."Given_Name" AS N ON N.patientId = P.id ' +
'INNER JOIN mpi."Gender" AS G ON P.gender = G.id ' +
'INNER JOIN mpi."Address" AS A ON A.patientId = P.id ' +
'WHERE P.id = $1';

const GET_PATIENTS_QUERY = 'SELECT P.id, I.value AS identity, P.prefix, N.value AS given,P.family, G.description as gender, P.birthdate, P.deceased, ' +
'A.line1 as street, A.city, A.district, A.country, A.postalcode, P.telecom from mpi."Patient" AS P ' +
'INNER JOIN mpi."Identifier" AS I ON I.patientId = P.id ' +
'INNER JOIN mpi."Given_Name" AS N ON N.patientId = P.id ' +
'INNER JOIN mpi."Gender" AS G ON P.gender = G.id ' +
'INNER JOIN mpi."Address" AS A ON A.patientId = P.id ' +
'WHERE P.family = $1';

const CREATE_PATIENT_QUERY = 'INSERT INTO mpi."Patient" (prefix,family,telecom,gender,deceased,birthDate) \
VALUES ($1,$2,$3,$4,$5,$6) RETURNING id;';

const CREATE_PATIENT_IDENTIFIER_QUERY = 'INSERT INTO mpi."Identifier" (value, patientId) \
VALUES ($1, $2);';

const CREATE_PATIENT_GIVEN_NAME_QUERY = 'INSERT INTO mpi."Given_Name" (value, patientid) \
VALUES ($1, $2);';

const CREATE_PATIENT_ADDRESS_QUERY = 'INSERT INTO mpi."Address" (line1, line2, city, district, postalCode, country, patientid) \
VALUES ($1,$2,$3,$4,$5,$6,$7);';

const GET_GENDER_QUERY = 'SELECT * FROM mpi."Gender" WHERE description = $1';

const CONNECTION_STRING = 'postgres://postgres:postgres@host.docker.internal:5432/mpi';

const logger = log.createLogger();

exports.getPatient = function (patientId, callBack, finished) {

  logInfo("getPatient", patientId);
  var client = new pg.Client(CONNECTION_STRING);

  client.connect((error, client, done) => {
    if(error) throw error;
    client.query(GET_PATIENT_QUERY, [patientId],(error, result) => { 
      if(!error) {
        patient = createPatient(result.rows[0]);
        client.end();
        logInfo("getPatient Success", patientId);
        callBack(patient, finished);
      } else {
        callBack({error: 'Unable to retrieve patient with id of ' + patientId, status: {
          code: 404
        }}, finished);
      }
    });
  });
}

exports.getPatients = function (familyName, callBack, finished) {

  logInfo("getPatients", familyName);
  var client = new pg.Client(CONNECTION_STRING);

  client.connect((error, client, done) => {
    if(!error) {
      client.query(GET_PATIENTS_QUERY, [familyName],(error, result) => {
        if(!error) {
          client.end();
          handleGetPatientsResponse(familyName, result, callBack, finished);
        } else {
          handleGetPatientsError(familyName, error, callBack, finished);
        }
      });
    } else {
      handleGetPatientsError(familyName, error, callBack, finished);
    }
  });
}

function handleGetPatientsResponse(familyName, response, callBack, finished) {
  logInfo("getPatients", response);

  if (response.rowCount > 0) {   
    logInfo("getPatients Success", familyName);         
    callBack(createBundle(response), finished);
  } else {
    callBack({error: 'Unable to retrieve patient with name of ' + familyName, status: {
      code: 404
    }}, finished);
  }
}

function handleGetPatientsError(name, error, callBack, finished) {
  logError("getPatients",error, callBack);
  callBack({error: 'Unable to retrieve patient with name of ' + name, status: {
    code: 404
  }}, finished);
}

exports.createPatient = function(patient, callBack, finished) {

  var client;
  var genderId;
  var patientId;

  logInfo("createPatient", patient);

  client = new pg.Client(CONNECTION_STRING);
  
  client.connect((error, client, done) => {
    if(error) return rollBack(client, error, callBack, finished, 'Unable to create patient');
    query(client, GET_GENDER_QUERY, [patient.gender], callBack, finished, (result) => {
      genderId = result.rows[0].id;
      client.query('BEGIN', (error, result) => {
        if(error) return rollBack(client, error, callBack, finished, 'Unable to create patient');
        query(client, CREATE_PATIENT_QUERY, [patient.name.prefix, patient.name.family, patient.telecom, genderId, patient.deceasedBoolean, patient.birthDate], callBack, finished, (result) => { 
          patientId = result.rows[0].id;
          query(client, CREATE_PATIENT_IDENTIFIER_QUERY, [patient.identifier[0].value, patientId], callBack, finished, (result) => {
            query(client, CREATE_PATIENT_GIVEN_NAME_QUERY, [patient.name.given[0], patientId] , callBack, finished, (result) => {
              query(client, CREATE_PATIENT_ADDRESS_QUERY, [patient.address.line[0], patient.address.line[1], patient.address.city, patient.address.district, 
                patient.address.postalCode, patient.address.country, patientId] , callBack, finished, (error, result) => {
                client.query('COMMIT', client.end.bind(client));
                logInfo("createPatient Success", patient);
                callBack('Patient ' + patientId + ' has been created', finished);
              });
            });
          });
        });
      });     
    });
  }); 
}

function query(client, query, parameters, callBack, finished, nextProcess) {
  client.query(query,parameters,(error, result) => {
    if(error) return rollBack(client, error, callBack, finished, 'Unable to create patient');
    nextProcess(result);
  }); 
}

function rollBack(client, error, callBack, finished, errorMessage) {
  client.query('ROLLBACK', function() {
    client.end();
    logError("createPatient",error, callBack);
    callBack({error: errorMessage, status: {
      code: 404
    }}, finished);
  });
};

function createPatient(patient) {
  return createPatientObject(patient.id, patient.identity, patient.prefix, patient.given, patient.family, patient.gender, patient.birthDate, 
  patient.deceased, patient.street, patient.city, patient.district, patient.country, patient.postalcode, patient.telecom);
}

function createBundle(patients) {

  var bundleObject = [];

  for (i = 0; i < patients.rowCount; i++) { 
    patient = patients.rows[i];

    patientObject = createPatientObject(patient.id, patient.identity, patient.prefix, patient.given, patient.family, patient.gender, patient.birthDate, 
    patient.deceased, patient.street, patient.city, patient.district, patient.country, patient.postalcode, patient.telecom);

    bundleObject.push(patientObject);
  }

  var bundle = {
    entry: bundleObject
  }

  return bundle;
}

function createPatientObject(id, identity, prefix, given, family, gender, birthDate, 
  deceased, street, city, district, country, postalcode, telecom) {
  var patient = {
    resourceType: "Patient",
    id: id,
    identifier: [
      {
        system: "urn:oid:2.16.840.1.113883.2.1.3.2.4.16.53",
        value: identity
      }
    ],
    name: {
      resourceType: "HumanName",
      family: family,
      given: [
        given
      ],
      prefix: prefix
    },
    telecom: telecom,
    gender: gender,
    deceasedBoolean: deceased,
    birthDate: birthDate,
    address: {
      resourceType: "Address",
      line: [street
      ],
      city: city,
      district: district,
      postalCode: postalcode,
      country: country
    }
  };

  return patient;
}

function logInfo(method, info) {
  logger.info("method: " + method + " Info: " + JSON.stringify(info, null, 2));
}

function logError(method, error) {
  logger.error("method: " + method + " " + error);
}