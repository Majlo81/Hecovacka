const express = require('express');
const router = express.Router();

// Mock hecovačky data
const demoHecovacky = [
  {
    _id: 'msg1',
    senderName: 'Janko',
    message: 'Michal, tvoje nohy už zabúdli na existenciu! Poď! Nebo budeš grúľ!',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    type: 'vtipné'
  },
  {
    _id: 'msg2',
    senderName: 'Al',
    message: 'Žbun! To je len rozvinčiek! Tvoja kondička je slabšia ako wifi v tuneli!',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    type: 'vtipné'
  },
  {
    _id: 'msg3',
    senderName: 'Ty',
    message: 'Poď na to, šampión! Vieš na to! 💪',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: 'motivačné'
  }
];

// Get hecovačky for a group
router.get('/grouped-:groupId', (req, res) => {
  const { groupId } = req.params;
  
  if (groupId === 'demo-group') {
    return res.json({
      success: true,
      data: {
        messages: demoHecovacky
      }
    });
  }
  
  res.json({
    success: true,
    data: {
      messages: []
    }
  });
});

// Send new hecovačka
router.post('/', (req, res) => {
  const { groupId, toUserId, message, type } = req.body;
  
  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Správa je povinná'
    });
  }
  
  const newHecovacka = {
    _id: Date.now().toString(),
    senderName: 'Ty',
    message: message,
    timestamp: new Date(),
    type: type || 'motivačné',
    groupId,
    toUserId
  };
  
  demoHecovacky.unshift(newHecovacka);
  
  res.json({
    success: true,
    message: 'Hecovačka úspešne poslaná',
    data: {
      hecovacka: newHecovacka
    }
  });
});

module.exports = router;
