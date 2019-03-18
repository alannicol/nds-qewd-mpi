const log = require("../utils/logger.js");
const config = require('../configuration/global_config.json');
const pg = require('pg');

const GET_PATIENT_QUERY = 'SELECT I.value AS identity, P.prefix, N.value AS given,P.family, G.description as gender, P.birthdate, P.deceased, 
A.line1 as street, A.city, A.district, A.country, A.postalcode, P.telecom from mpi."Patient" AS P 
INNER JOIN mpi."Identifier" AS I ON I.patientId = P.id
INNER JOIN mpi."Given_Name" AS N ON N.patientId = P.id
INNER JOIN mpi."Gender" AS G ON P.gender = G.id
INNER JOIN mpi."Address" AS A ON A.patientId = P.id
WHERE P.id = $1';

const GET_PATIENTS_QUERY = 'SELECT I.value AS identity, P.prefix, N.value AS given,P.family, G.description as gender, P.birthdate, P.deceased, 
A.line1 as street, A.city, A.district, A.country, A.postalcode, P.telecom from mpi."Patient" AS P 
INNER JOIN mpi."Identifier" AS I ON I.patientId = P.id
INNER JOIN mpi."Given_Name" AS N ON N.patientId = P.id
INNER JOIN mpi."Gender" AS G ON P.gender = G.id
INNER JOIN mpi."Address" AS A ON A.patientId = P.id
WHERE P.family = $1';

const CREATE_PATIENT_QUERY = 'INSERT INTO mpi."Patient" (prefix,family,telecom,gender,deceased,birthDate)
VALUES
($1, $2, $3,$4,$5,$6) RETURNING id;';

const CONNECTION_STRING = 'postgres://postgres:postgres@host.docker.internal:5432/mpi';

const logger = log.createLogger();

exports.getPatient = function (patientId, callBack, finished) {

  var client = new pg.Client(CONNECTION_STRING);

  client.connect((error, client, done) => {
    if(error) throw error;

    client.query(GET_PATIENT_QUERY, [patientId],(error, response) => {  
      if(!error && response) {
        patient = createPatient(response.rows[0]);
        client.end();
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

  logInfo("getPatients", name, callBack);
  var client = new pg.Client(CONNECTION_STRING);

  client.connect((error, client, done) => {
    if(!error) {
      client.query(GET_PATIENTS_QUERY, [familyName],(error, response) => { 
        if(!error) {
          client.end();
          handleGetPatientsResponsefamilyName, response, callBack, finished);
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
  if (response.rows.size > 0) {            
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

  var client = new pg.Client(CONNECTION_STRING);

  client.connect((error, client, done) => {
    if(error) throw error;

    client.query(CREATE_PATIENT_QUERY, 
    [patient.id, patient.identifier[0].value, patient.name.family, patient.name.given[0], patient.name.prefix, patient.gender,patient.deceasedBoolean, patient.birthDate],(error, response) => {  
      if(!error) {
        client.end();
        callBack('Patient ' + patient.id + ' created', finished);
      } else {
        callBack({error: 'Unable to create patient ' + name, status: {
          code: 404
        }}, finished);
      }
    });
  });
}

function createPatient(patient) {
  return  createPatientObject(patient.id, patient.identifier, patient.family, patient.given, patient.prefix, patient.gender,
  patient.deceased, patient.dob);
}

function createBundle(patients) {

  var bundleObject = [];

  console.log(patients);
  console.log(patients.size);

  for (i = 0; i < patients.length; i++) { 
    patient = patients.row[i];

    patientObject = createPatientObject(patient.id, patient.identifier, patient.family, patient.given, patient.prefix, patient.gender,
      patient.deceased, patient.dob);

    bundleObject.push(patientObject);
  }

  var bundle = {
    entry: bundleObject
  }

  return bundle;
}

function createPatientObject(id, identifierValue, family, given, prefix, gender, 
  deceasedBoolean, birthDate) {
  var patient = {
    resourceType: "Patient",
    id: id,
    identifier: [
      {
        system: "urn:oid:2.16.840.1.113883.2.1.3.2.4.16.53",
        value: identifierValue
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
    telecom: "",
    gender: gender,
    deceasedBoolean: deceasedBoolean,
    birthDate: birthDate,
    address: {
      resourceType: "Address",
      line: [""
      ],
      city: "",
      district: "",
      postalCode: "",
      country: ""
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