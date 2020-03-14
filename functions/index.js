const functions = require("firebase-functions");
const app = require("express")();
const cors = require("cors");

const { db } = require("./helpers/admin");
const { AuthCheck } = require("./helpers/middleware");
const {
  getAllClients,
  getAllPolicies,
  deleteAllClients,
  deleteAllPolicies,
  getClientById,
  getClientByName,
  getClientByPolicyId,
  getClientPolicies
} = require("./handlers/handlers");

app.use(cors());

app.get("/clients/store", getAllClients);
app.get("/policies/store", getAllPolicies);
app.delete("/clients/delete", deleteAllClients);
app.delete("/policies/delete", deleteAllPolicies);

app.get("/clients/clientId/:clientId", AuthCheck("both"), getClientById);
app.get("/clients/clientName/:clientName", AuthCheck("both"), getClientByName);
app.get("/clients/policyId/:policyId", AuthCheck("admin"), getClientByPolicyId);

app.get(
  "/policies/clientName/:clientName",
  AuthCheck("admin"),
  getClientPolicies
);

exports.api = functions.region("europe-west1").https.onRequest(app);
