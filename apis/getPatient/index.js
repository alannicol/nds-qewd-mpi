var request = require('request');

module.exports = function(args, finished) {

  if(args.patientId.exists) {
    
    request(createRequest(args.patientId, args.token), responseHandler(error, response, body));

  } else {
    return finished({error: 'Missing or invalid patient identifier'});
  }

  return finished(patientId);
};

function createRequest(patientId, token) {
  var uri = '';

  var request = {
    url: uri,
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    },
    qs: {
      patientId: patientId
    }
  };
}

function responseHandler(error, response, body) {
  if (response.statusCode == 200) {
    if (!error) {
      try {
        var patient = JSON.parse(body);
        cachePatientResource(nhsNumber, patient, session);
        callback(false);
      }
      catch(err) {
        callback({error: err});
      }
    }
    else {
      callback(error);
    }
  } else {
    return callback({error: 'Cannot connect to MPI server: ' + body});
  }
}