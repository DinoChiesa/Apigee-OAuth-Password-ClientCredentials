// validateUser.js
// ------------------------------------------------------------------
//
// Validate the user based on the passed-in values.
// This code relies on the user database stored / embedded in userDb.js .
//
/* global userDb, context */

var username = context.getVariable('request.formparam.username');
var password = context.getVariable('request.formparam.password');
var statusVar = 'user_is_authentic';
var rolesVar = 'user_roles';
var result = false;

if (username && password) {
  if (userDb && userDb[username]) {
    var storedRecord = userDb[username];
    if (storedRecord) {
      // user has been found
      // check password match. NEVER DO THIS IN PRODUCTION!
      if (storedRecord.password == password) {
        // authenticated
        result = true;
        context.setVariable(rolesVar, userDb[username].roles.join(','));
      }
    }
  }
}

context.setVariable(statusVar, result);
