var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("path/to/serviceAccountKey.json"),
  databaseURL: "https://clipme-32a80.firebaseio.com"
});
