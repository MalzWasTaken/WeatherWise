import { getAlertsByEmail, addWeatherAlert,deleteWeatherAlert } from "../models/alerts.js";

async function getAlerts(req, res) {
  try {
    const results = await getAlertsByEmail(req.params.email);
    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}


async function addAlerts(req, res) {
  try {
    const results = await addWeatherAlert(req.body);
    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

async function deleteAlerts(req, res) {
  try {
    await deleteWeatherAlert(req.params.id);
    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export {getAlerts,addAlerts,deleteAlerts}