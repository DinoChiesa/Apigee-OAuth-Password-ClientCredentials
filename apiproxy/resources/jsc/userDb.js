// userDb.js
// ------------------------------------------------------------------
//
// This is a mock user validation database.
//
// NEVER Store passwords in real systems.
//
// I just wanted a mock user authentication service.
//

var userDb = {

      "dino@apigee.com":  {
        password: "IloveAPIs",
        roles: ['read', 'edit']
      },

      "don@knuth.com": {
        password: "Recursion1",
        roles: ['read', 'edit', 'delete']
      },

      "albert@einstein.us": {
        password: "Relativity",
        roles: ['read']
      }

      // You can add more records here.
      // Also, you can add other properties to each record. If you DO add other data items, then
      // you would also need to modify the proxy to attach those properties to
      // a token issued by Edge.
      //
      // Follow the example in the GenerateAccessToken policy for the roles.
    };
