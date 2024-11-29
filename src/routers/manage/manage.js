import express from "express";
import { getManageByServiceId } from "../../data/queries/manageQueries.js";

const router = express.Router();

router.get("/:serviceId", async (req, res) => {
  const serviceId = req.params.serviceId;
  const manage = await getManageByServiceId(serviceId);
  if (manage) {
    res.json(manage);
  } else {
    res.status(404).send("Manage non trouvé.");
  }
});

export default router;
