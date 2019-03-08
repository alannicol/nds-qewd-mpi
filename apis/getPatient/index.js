module.exports = function (args, finished) {

  console.log('Got Request');

var pg = require('pg');
var connectionString = 'postgres://postgres:postgres@host.docker.internal:5432/mpi';

var client = new pg.Client(connectionString);

client.connect((err, client, done) => {
  console.log(err);
  console.log("connected");
  var query = 'SELECT * FROM mpi."Patient"';
  console.log(query);
  client.query(query,(err, res) => {
    console.log(err);
    console.log(res);
  });
});

//client.end()
  
  //var pool = createConnectionPool();
  
  //console.log('Created pool');
  //console.log(pool);
  //console.log('Query pool');
  //pool.query('SELECT * FROM mpi."Patient" WHERE id=' + args.patientId, processFindPatient);
 // pool.query('select schema_name from information_schema.schemata', processFindPatient);
}

function createConnectionPool() {
  const Pool = require('pg').Pool;

 const pool = new Pool({
   user: 'postgres',
   password: 'postgres',
   host: '127.0.0.1',
   port: 5432,
   database: 'mpi',
   schema: 'mpi'
 })
 
 pool.connect((error, client, done) => {
   console.log(error);
   console.log(client);
   console.log(done);
 });
// pool.query('select schema_name from information_schema.schemata', processFindPatient);

 return pool;
};

function processFindPatient(error, results) {
  
  console.log(error);
  console.log(results);
  if (!error) {
    
  } else {
    throw error;
  }
  
  //response.status(200).json(results.rows)
}

/*module.exports = function(args, finished) {

  if(args.patientId.exists) {


  } else {
    return finished({error: 'Missing or invalid patient identifier'});
  }

  return finished(patientId);
}; */

