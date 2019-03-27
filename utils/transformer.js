const log = require("../utils/logger.js");

const logger = log.createLogger();

exports.transformTo = function (patient) {

  logInfo("transformTo", patient);
  
  var telecom = patient.telecom[0].value;

  logInfo("transformTo", telecom);

  patient.telecom = telecom; 
  
  logInfo("transformTo", patient);

  return patient;
}

exports.transformFrom = function (patient) {

    logInfo("transformFrom", patient);
    
    var telecom = patient.telecom;

    patient.telecom = [
      {
        "system": "phone",
        "value": telecom,
        "use": "home",
        "rank": "1"
      } 
    ]; 
    
    logInfo("transformFrom", patient);

    return patient;
}

function logInfo(method, info) {
  logger.info("method: " + method + " Info: " + JSON.stringify(info, null, 2));
}