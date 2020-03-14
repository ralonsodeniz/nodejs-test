const axios = require("axios");

const { db } = require("../helpers/admin");

exports.getAllClients = async (req, res) => {
  try {
    const { data } = await axios.get(
      "http://www.mocky.io/v2/5808862710000087232b75ac"
    );
    const { clients } = data;
    const batch = db.batch();
    clients.forEach(client => {
      const clientRef = db.doc(`clients/${client.id}`);
      batch.set(clientRef, { ...client }, { merge: true });
    });
    await batch.commit();
    return res.json({ message: "clients added to db" });
  } catch (error) {
    console.log("error while getting clients data", error.message);
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllPolicies = async (req, res) => {
  try {
    const { data } = await axios.get(
      "http://www.mocky.io/v2/580891a4100000e8242b75c5"
    );
    const { policies } = data;
    const batch = db.batch();
    policies.forEach(policy => {
      const policyRef = db.doc(`policies/${policy.id}`);
      batch.set(policyRef, { ...policy });
    });
    await batch.commit();
    return res.json({ message: "policies added to db" });
  } catch (error) {
    console.log("error while getting policies data", error.message);
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteAllClients = async (req, res) => {
  try {
    const clientsRef = db.collection("/clients");
    const clientsSnapshot = await clientsRef.get();
    const clientsDocs = clientsSnapshot.docs;
    const batch = db.batch();
    clientsDocs.forEach(clientDoc => {
      const clientDocRef = clientDoc.ref;
      batch.delete(clientDocRef);
    });
    await batch.commit();
    return res.json({ message: "clients deleted successfully" });
  } catch (error) {
    console.log("error while deleting clients data", error.message);
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteAllPolicies = async (req, res) => {
  try {
    const policiesRef = db.collection("/policies");
    const policiesSnapshot = await policiesRef.get();
    const policiesDocs = policiesSnapshot.docs;
    const batch = db.batch();
    policiesDocs.forEach(policyDoc => {
      const policyDocRef = policyDoc.ref;
      batch.delete(policyDocRef);
    });
    await batch.commit();
    return res.json({ message: "policies deleted successfully" });
  } catch (error) {
    console.log("error while deleting policies data", error.message);
    return res.status(500).json({ error: error.message });
  }
};
