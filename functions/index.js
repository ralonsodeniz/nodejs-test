const functions = require("firebase-functions");
const app = require("express")();
const cors = require("cors");
const { db } = require("./helpers/admin");

app.use(cors());

exports.api = functions.region("europe-west1").https.onRequest(app);
