const express = require('express');
const router = express.Router();

// Mock data for demo
const demoGroups = [
  {
    _id: 'demo-group',
    name: 'Demo Skupina',
    members: [
      { _id: 'user1', name: 'Ty', currentGoal: '100 klikov denne', progress: { current: 60, target: 100, percentage: 60 }, status: 'active' },
      { _id: 'user2', name: 'Michal', currentGoal: '5km behanie denne', progress: { current: 0, target: 5, percentage: 0 }, status: 'behind' },
      { _id: 'user3', name: 'Janko', currentGoal: '50 drepov denne', progress: { current: 45, target: 50, percentage: 90 }, status: 'active' }
    ]
  }
];

// Get user's groups
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      groups: demoGroups
    }
  });
});

// Get group members
router.get('/:groupId/members', (req, res) => {
  const { groupId } = req.params;
  
  if (groupId === 'demo-group') {
    return res.json({
      success: true,
      data: {
        members: demoGroups[0].members
      }
    });
  }
  
  res.status(404).json({
    success: false,
    message: 'Skupina nenájdená'
  });
});

module.exports = router;
