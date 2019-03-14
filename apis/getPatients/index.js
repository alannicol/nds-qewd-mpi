const mpi = require('../../utils/mpi.js');

module.exports = function (args, finished) {

  if(args.req.query !== "") {
    mpi.getPatients(args.req.query.name,mpiResponse, finished);
  } else {
    finished({error: 'Request does not include patient name query', status: {
      code: 404
    }});
  } 
}

function mpiResponse(response, finished) {
  finished(response);
}