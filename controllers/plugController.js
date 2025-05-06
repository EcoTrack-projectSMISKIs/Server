const Plug = require('../models/Plug');
const User = require('../models/User');
const axios = require('axios');
const mqttClient = require('../utils/mqttClient');

//  Get all plugs
exports.getAllPlugs = async (req, res) => {
  try {
    const plugs = await Plug.find();
    res.json(plugs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
}; // can be used lol


//  Turn ON plug
exports.turnOnPlug = async (req, res) => {
  try {
    const plug = await Plug.findById(req.params.id);
    if (!plug) return res.status(404).json({ message: 'Plug not found' });

    const response = await axios.get(`http://${plug.ip}/cm?cmnd=Power%20On`);

    const topic = `ecotrack/plug/${plug._id}/status`;
    const payload = JSON.stringify({ id: plug._id, name: plug.name, power: 'ON' });

    mqttClient.publish(topic, payload);

    plug.status = true;
    await plug.save();

    res.json({
      message: `Plug ${plug.name} turned ON + status updated`,
      httpResponse: response.data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Turn OFF plug
exports.turnOffPlug = async (req, res) => {
  try {
    const plug = await Plug.findById(req.params.id);
    if (!plug) return res.status(404).json({ message: 'Plug not found' });

    const response = await axios.get(`http://${plug.ip}/cm?cmnd=Power%20Off`);

    const topic = `ecotrack/plug/${plug._id}/status`;
    const payload = JSON.stringify({ id: plug._id, name: plug.name, power: 'OFF' });

    mqttClient.publish(topic, payload);

    plug.status = false;
    await plug.save();

    res.json({
      message: `Plug ${plug.name} turned OFF + status updated`,
      httpResponse: response.data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Get plug status + update energy
exports.getPlugStatus = async (req, res) => {
  try {
    const plug = await Plug.findById(req.params.id);
    if (!plug) return res.status(404).json({ message: 'Plug not found' });

    const response = await axios.get(`http://${plug.ip}/cm?cmnd=Status%208`);
    const energy = response.data?.StatusSNS?.ENERGY;

    const topic = `ecotrack/plug/${plug._id}/status`;
    const payload = JSON.stringify({
      id: plug._id,
      name: plug.name,
      energy: energy || {},
      timestamp: new Date().toISOString()
    });

    mqttClient.publish(topic, payload);

    plug.energy = energy || {};
    await plug.save();

    res.json({
      message: 'Plug status fetched & energy updated',
      energy: energy,
      raw: response.data
    });
  } catch (err) {
    if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
      return res.status(503).json({ error: 'Plug is unreachable or offline' });
    }
    res.status(500).json({ error: err.message });
  }
};

// ==============================================================================================================



//  Update plug details
exports.updatePlug = async (req, res) => { // SHOULD NOT USE FOR A WHILE
  try {
    const updatedPlug = await Plug.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, ip: req.body.ip },
      { new: true }
    );
    if (!updatedPlug) return res.status(404).json({ message: 'Plug not found' });
    res.json(updatedPlug);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; // should not used for a while




//  Delete plug
exports.deletePlug = async (req, res) => { // SHOULD NOT USE FOR A WHILE
  try {
    const deletedPlug = await Plug.findByIdAndDelete(req.params.id);
    if (!deletedPlug) return res.status(404).json({ message: 'Plug not found' });

    // ✅ Also remove plug ref from User's plugs array
    await User.updateOne({ plugs: deletedPlug._id }, { $pull: { plugs: deletedPlug._id } });

    res.json({ message: 'Plug deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; // SHOULD NOT USE FOR A WHILE

 // ==============================================================================================================

// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 


// this is for adding plugs to user



//  Add plug + link to user
exports.addPlug = async (req, res) => {
  try {
    const { name, ip, user } = req.body;
    if (!name || !ip || !user) {
      return res.status(400).json({ message: 'Name, IP, and User are required' });
    }

    const newPlug = new Plug({ name, ip, user });
    await newPlug.save();

    await User.findByIdAndUpdate(user, { $push: { plugs: newPlug._id } });

    res.json({ message: 'Plug added & linked to user successfully', plug: newPlug });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; // 

// ==============================================================================================================

// ==============================================================================================================
// 
//  Connect plug to user manually (if needed)
exports.connectPlugToUser = async (req, res) => {
  try {
    const { plugId, userId } = req.body;
    const plug = await Plug.findById(plugId);
    if (!plug) return res.status(404).json({ message: 'Plug not found' });

    plug.user = userId;
    await plug.save();

    await User.findByIdAndUpdate(userId, { $addToSet: { plugs: plugId } });

    res.json({ message: `Plug ${plug.name} connected to user`, plug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// new added // doing automation
exports.addPlugFromDevice = async (req, res) => {
  try {
    const { ip, userId } = req.params;

    if (!ip || !userId) {
      return res.status(400).json({ message: 'IP and User ID are required' });
    }

    // Optional: Check if a plug with this IP already exists
    let plug = await Plug.findOne({ ip });

    if (plug) {
      // Update existing plug IP (if needed)
      plug.ip = ip;
    } else {
      // Create new plug
      plug = new Plug({ name: `Plug-${ip}`, ip, user: userId });
    }

    await plug.save();

    // Add to user plugs if not already linked
    await User.findByIdAndUpdate(userId, { $addToSet: { plugs: plug._id } });

    res.json({ message: `Plug added/updated from Tasmota`, plug });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};