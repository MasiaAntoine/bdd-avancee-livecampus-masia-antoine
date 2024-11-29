import express from "express";
import {
  getAllServices,
  getServiceById,
  addService,
  deleteService,
  updateService,
} from "../../data/queries/serviceQueries.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const services = await getAllServices();
  if (services) {
    res.json(services);
  } else {
    res.status(500).send("Erreur lors de la récupération des services.");
  }
});

router.get("/:id", async (req, res) => {
  const serviceId = req.params.id;
  const service = await getServiceById(serviceId);
  if (service) {
    res.json(service);
  } else {
    res.status(404).send("Service non trouvé.");
  }
});

router.post("/", async (req, res) => {
  const { name, office_number } = req.body;
  const newService = await addService(name, office_number);
  if (newService) {
    res.status(201).json(newService);
  } else {
    res.status(500).send("Erreur lors de l'ajout du service.");
  }
});

router.delete("/:id", async (req, res) => {
  const serviceId = req.params.id;
  const deletedService = await deleteService(serviceId);
  if (deletedService) {
    res.json(deletedService);
  } else {
    res.status(404).send("Service non trouvé.");
  }
});

router.put("/:id", async (req, res) => {
  const serviceId = req.params.id;
  const { name, office_number } = req.body;
  const updatedService = await updateService(serviceId, name, office_number);
  if (updatedService) {
    res.json(updatedService);
  } else {
    res.status(500).send("Erreur lors de la mise à jour du service.");
  }
});

export default router;
