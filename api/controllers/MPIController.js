import Patient from "../models/Patient";

export default class MPIcontroller {
    constructor() {
    }
    
    getPatient(req, res) {
        res.json(new Patient(req.params.patientId, "111 222 333", "Nicol", "Alan", "0141 633 0336", "male", "false", "19/08/1974"));
    } 

    getPatients(req, res) {
        var given = JSON.parse(req.query);
        console.log(given);
        res.json(new Patient("1", "111 222 333", given, given, "0141 633 0336", "male", "false", "19/08/1974"));
    }

    createPatient(req, res) {
        res.json("");
    }
};