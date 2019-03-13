const config = require('../configuration/global_config.json');
const pg = require('pg');

const connectionString = 'postgres://postgres:postgres@host.docker.internal:5432/mpi';

exports.getPatient = function (patientId, callBack, finished) {

  var client = new pg.Client(connectionString);

  client.connect((error, client, done) => {
    if(error) throw error;

    client.query('SELECT * FROM mpi."Patient" AS P WHERE P.id = $1', [patientId],(error, response) => {  
      if(!error && response) {
        result = createPatient(response.rows[0]);
      } else {
        result = "Unable to retrieve patient with id of " + patientId;
      }
      client.end();
      callBack(result, finished);
    });
  });
}

exports.getPatients = function (name, callBack, finished) {
  var client = new pg.Client(connectionString);

  client.connect((error, client, done) => {
    if(error) throw error;

    client.query('SELECT * FROM mpi."Patient" AS P WHERE P.family = $1', [name],(error, response) => {  
      if(!error && response) {
        console.log(response);
        result = createPatient(response.rows[0]);
      } else {
        result = "Unable to retrieve patient with name of " + name;
      }
      client.end();
      callBack(result, finished);
    });
  });
}

exports.createPatient = function(patient, callBack, finished) {
  var client = new pg.Client(connectionString);

  console.log(patient);
  client.connect((error, client, done) => {
    if(error) throw error;

    client.query('INSERT into mpi."Patient" (id,identifier,family,given,prefix,gender,deceased,dob) VALUES($1,$2,$3,$4,$5,$6,$7,$8)', 
    [patient.id, patient.identifier[0].value, patient.name.family, patient.name.given[0], patient.name.prefix, patient.gender,patient.deceasedBoolean, patient.birthDate],(error, response) => {  
      if(!error) {
        result = "Patient created";
      } else {
        result = "Unable to create patient";
      }
      client.end();
      callBack(result, finished);
    });
  });
}

function createPatient(patient) {
  return  createPatientObject(patient.id, patient.identifier, patient.family, patient.given, patient.prefix, patient.gender,
  patient.deceased, patient.dob);
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