const admin = require("firebase-admin");

const serviceAccount = require("../config/nodejs-test-99e75-firebase-adminsdk-7869e-5d59416229.json");
const { firebaseConfig } = require("../config/config");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseConfig.databaseURL
});

const db = admin.firestore();
const storage = admin.storage();

module.exports = {
  admin,
  db,
  storage
};
