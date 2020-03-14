const { db } = require("../helpers/admin");

exports.AuthCheck = authedRole => {
  return async (req, res, next) => {
    let userId = "";
    if (req.headers.authorization) {
      userId = req.headers.authorization;
    } else {
      return res
        .status(401)
        .json({ error: "authorization is needed for this endpoint" });
    }
    try {
      const userRef = db.doc(`clients/${userId}`);
      const userSnapshot = await userRef.get();
      if (!userSnapshot.exists)
        return res
          .status(401)
          .json({ error: "authorization is needed for this endpoint" });
      const userData = userSnapshot.data();
      const { role } = userData;

      if (authedRole === "both") {
        if (role !== "admin" && role !== "user")
          return res.status(403).json({ error: "insuficent authorization" });
      } else if (role !== authedRole)
        return res.status(403).json({ error: "insuficent authorization" });
      req.role = role;
      return next();
    } catch (error) {
      console.log("error while checking authorization", error.message);
      return res.status(500).json({ error: error.message });
    }
  };
};
