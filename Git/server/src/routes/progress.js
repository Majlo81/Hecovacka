const express = require('express');
const router = express.Router();

// Mock progress data
const demoProgress = [
  {
    _id: 'progress1',
    goalId: 'goal1',
    userId: 'user1',
    date: new Date().toISOString().split('T')[0],
    completed: 60,
    target: 100,
    percentage: 60,
    comment: 'Dobré ráno, urobil som 60 klikov!',
    timestamp: new Date()
  },
  {
    _id: 'progress2',
    goalId: 'goal1',
    userId: 'user1',
    date: new Date(Date.now() - 24*60*60*1000).toISOString().split('T')[0],
    completed: 100,
    target: 100,
    percentage: 100,
    comment: 'Perfektný deň! Všetko splnené! 💪',
    timestamp: new Date(Date.now() - 24*60*60*1000)
  }
];

// Get progress for a goal
router.get('/goal/:goalId', (req, res) => {
  const { goalId } = req.params;
  
  // Return demo data or empty if no goal
  if (goalId === 'goal1' || goalId === 'demo-goal') {
    return res.json({
      success: true,
      data: {
        progress: demoProgress
      }
    });
  }
  
  // Fallback demo data for any goal
  res.json({
    success: true,
    data: {
      progress: [
        {
          _id: 'demo-progress-1',
          goalId: goalId,
          userId: 'demo-user',
          date: new Date().toISOString().split('T')[0],
          completed: 75,
          target: 100,
          percentage: 75,
          comment: 'Skvelý pokrok dnes! 🔥',
          timestamp: new Date()
        },
        {
          _id: 'demo-progress-2',
          goalId: goalId,
          userId: 'demo-user',
          date: new Date(Date.now() - 24*60*60*1000).toISOString().split('T')[0],
          completed: 50,
          target: 100,
          percentage: 50,
          comment: 'Polovica splnená, pokračujem!',
          timestamp: new Date(Date.now() - 24*60*60*1000)
        }
      ]
    }
  });
});

// Update progress
router.post('/update', (req, res) => {
  const { goalId, completed, target, comment } = req.body;
  
  const newProgress = {
    _id: Date.now().toString(),
    goalId,
    userId: 'current-user',
    date: new Date().toISOString().split('T')[0],
    completed: parseInt(completed),
    target: parseInt(target),
    percentage: Math.round((completed / target) * 100),
    comment: comment || '',
    timestamp: new Date()
  };
  
  demoProgress.push(newProgress);
  
  res.json({
    success: true,
    message: 'Pokrok úspešne aktualizovaný',
    data: {
      progress: newProgress
    }
  });
});

module.exports = router;
