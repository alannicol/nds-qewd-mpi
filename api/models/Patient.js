export default class Patient {
    constructor(id, identifier, family, given, telecom, gender, deceased, birthDate) {
        this.id = id;
        this.identifier = identifier;
        this.family = family;
        this.given = given;
        this.telecom = telecom;
        this.gender = gender;
        this.deceased = deceased;
        this.birthDate = birthDate;
    }
}