const mpi = require('../../utils/mpi.js');

module.exports = function (args, finished) {

  if(args.patientId) {
    mpi(args.patientId,mpiResponse);
  }
  
  function mpiResponse(patient) {
    finished(patient);
  }
}