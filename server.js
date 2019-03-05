import express from 'express';
import MPIController from './api/controllers/MPIController';

const PORT = process.env.PORT || 3000;

var app = express();
var controller = new MPIController();

app.get('/patient/:patientId', controller.getPatient);
app.get('/patients', controller.getPatients);
app.post('/patients', controller.createPatient);

app.listen(PORT, () => {
  console.log('Server is listening on port ', PORT);
});