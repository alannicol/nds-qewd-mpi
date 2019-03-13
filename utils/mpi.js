const config = require('../configuration/global_config.json');
const pg = require('pg');

const connectionString = 'postgres://postgres:postgres@host.docker.internal:5432/mpi';

module.exports = function (patientId, callBack) {

  var client = new pg.Client(connectionString);

  client.connect((error, client, done) => {
    if(!error) {
      client.query('SELECT * FROM mpi."Patient" AS P WHERE P.id = $1', [patientId],(error, response) => {
        var result;
        console.log(response);
        if(!error && response) {
          result = createPatient(response.rows[0]);
        } else {
          result = "Unable to retrieve patient with id of " + patientId;
        }
        client.end();
        callBack(result);
      });
    } else {
      callBack("Unable to connect to database!");
    }
  });
}

function createPatient(patient) {
  console.log(patient);
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