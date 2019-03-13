const mpi = require('../../utils/mpi.js');

module.exports = function (args, finished) {
 
  try {
    if(typeof args.req.query !== "undefined") {
      mpi.getPatients(args.req.query.name,mpiResponse, finished);
    } else {
      mpiResponse("Request does not include patient name query");
    } 
  } catch(err) {
    console.log(err);
  }
}

function mpiResponse(patient, finished) {
  finished(patient);
}