/**
 * @typedef {Object} Phone
 * @property {string} mobile mobile phone number
 * @property {string} home home phone number
 */

/**
 * User class [Used by ...]{@link Grid}
 * @property {number} age - age of the user
 */
class User {
  /**
   * @param {string} name
   * @param {Phone} phone
   */
  constructor(name, phone) {
    this.name = name;
    this.phone = phone;
  }

  /** @return {number}  */
  get age() {
    return 18;
  }
}

function testUser() {
  let user = new User("John", {home: "Home", mobile: "123-456"}); // typescript must check this
  console.assert(typeof user.name === "string");
  console.assert(typeof user.phone === "object");
}
