const mpi = require('../../utils/mpi.js');

module.exports = function (args, finished) {

  try {
    if (typeof args.patientId !== "undefined") {
      mpi.getPatient(args.patientId, mpiResponse, finished);
    } else {
      mpiResponse("Request does not include patient Id");
    }
  } catch (err) {
    console.log(err);
  }
}

function mpiResponse(patient, finished) {
  finished(patient);
}