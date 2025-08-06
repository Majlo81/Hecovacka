const express = require('express');
const router = express.Router();

// Mock goals data
const demoGoals = [
  {
    _id: 'goal1',
    userId: 'user1',
    activity: 'kliky',
    target: 100,
    unit: 'krát',
    frequency: 'denne',
    deadline: '22:00',
    description: 'Denný tréning pre lepšiu kondíciu',
    createdAt: new Date(),
    isActive: true
  }
];

// Get user's goals
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      goals: demoGoals
    }
  });
});

// Create new goal
router.post('/', (req, res) => {
  const { activity, target, unit, frequency, deadline, description } = req.body;
  
  const newGoal = {
    _id: Date.now().toString(),
    userId: 'current-user',
    activity,
    target: parseInt(target),
    unit,
    frequency,
    deadline,
    description,
    createdAt: new Date(),
    isActive: true
  };
  
  demoGoals.push(newGoal);
  
  res.json({
    success: true,
    message: 'Cieľ úspešne vytvorený',
    data: {
      goal: newGoal
    }
  });
});

module.exports = router;
