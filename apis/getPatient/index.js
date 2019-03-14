const mpi = require('../../utils/mpi.js');

module.exports = function (args, finished) {

  if (args.patientId !== "") {
    mpi.getPatient(args.patientId, mpiResponse, finished);
  } else {
    finished({error: 'Request does not include patient Id', status: {
      code: 404
    }});
  }
} 

function mpiResponse(response, finished) {
  finished(response);
}