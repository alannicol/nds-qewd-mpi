const mpi = require('../../utils/mpi.js');

module.exports = function (args, finished) {

  if (args.req.body !== "") {
    mpi.createPatient(args.req.body, mpiResponse, finished);
  } else {
    finished({error: 'Request does not include patient body', status: {
      code: 404
    }});
  }
}

function mpiResponse(response, finished) {
  finished(response);
}