import express from "express";
import {
  getManagerByServiceId,
  listManagersAndServices,
} from "../../data/queries/manageQueries.js";

const router = express.Router();

router.get("/recup/:serviceId", async (req, res) => {
  const serviceId = req.params.serviceId;
  const manager = await getManagerByServiceId(serviceId);
  if (manager) {
    res.json(manager);
  } else {
    res.status(404).send("Manager non trouvé.");
  }
});

router.get("/list-managers-and-services", async (req, res) => {
  const result = await listManagersAndServices();
  if (result) {
    res.json(result);
  } else {
    res.status(500).send("Erreur lors de la récupération des données.");
  }
});

export default router;
