const functions = require("firebase-functions");
const app = require("express")();
const cors = require("cors");

const { db } = require("./helpers/admin");

const {
  getAllClients,
  getAllPolicies,
  deleteAllClients,
  deleteAllPolicies
} = require("./handlers/handlers");

app.use(cors());

app.get("/clients/store", getAllClients);
app.get("/policies/store", getAllPolicies);
app.delete("/clients/delete", deleteAllClients);
app.delete("/policies/delete", deleteAllPolicies);

exports.api = functions.region("europe-west1").https.onRequest(app);
