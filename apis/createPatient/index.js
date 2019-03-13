const mpi = require('../../utils/mpi.js');

module.exports = function (args, finished) {

  try {
    if (typeof args.req.body !== "undefined") {
      mpi.createPatient(args.req.body, mpiResponse, finished);
    } else {
      mpiResponse("Request does not include patient body");
    }
  } catch (err) {
    console.log(err);
  }
}

function mpiResponse(patient, finished) {
  finished(patient);
}