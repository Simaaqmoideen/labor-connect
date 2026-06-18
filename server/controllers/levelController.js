const { Worker, JobRequest, Rating, WorkerAchievement } = require('../models');

// Level thresholds
const LEVEL_THRESHOLDS = {
  bronze: { min: 0, max: 299 },
  silver: { min: 300, max: 599 },
  gold: { min: 600, max: 899 },
  platinum: { min: 900, max: Infinity }
};

const LEVEL_ORDER = ['bronze', 'silver', 'gold', 'platinum'];

const LEVEL_META = {
  bronze: { emoji: '🥉', label: 'Bronze Worker', color: '#CD7F32', minPoints: 0 },
  silver: { emoji: '🥈', label: 'Silver Worker', color: '#C0C0C0', minPoints: 300 },
  gold: { emoji: '🥇', label: 'Gold Worker', color: '#FFD700', minPoints: 600 },
  platinum: { emoji: '💎', label: 'Platinum Worker', color: '#E5E4E2', minPoints: 900 }
};

/**
 * Calculate composite level points from worker metrics.
 * Weighted: jobs_completed (30%), rating (25%), reliability (20%), attendance (15%), acceptance (10%)
 */
function calculateLevelPoints(worker) {
  const jobScore = Math.min(worker.jobs_completed || 0, 100) * 3; // max 300 from jobs
  const ratingScore = ((parseFloat(worker.rating_avg) || 0) / 5) * 250; // max 250
  const reliabilityScore = ((parseFloat(worker.reliability_score) || 0) / 100) * 200; // max 200
  const attendanceScore = ((parseFloat(worker.attendance_score) || 0) / 100) * 150; // max 150
  const acceptanceScore = ((parseFloat(worker.acceptance_rate) || 0) / 100) * 100; // max 100

  return Math.round(jobScore + ratingScore + reliabilityScore + attendanceScore + acceptanceScore);
}

function determineLevel(points) {
  if (points >= LEVEL_THRESHOLDS.platinum.min) return 'platinum';
  if (points >= LEVEL_THRESHOLDS.gold.min) return 'gold';
  if (points >= LEVEL_THRESHOLDS.silver.min) return 'silver';
  return 'bronze';
}

const getWorkerLevel = async (req, res) => {
  try {
    const worker = await Worker.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] }
    });
    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    const points = calculateLevelPoints(worker);
    const level = determineLevel(points);

    // Update if changed
    if (worker.level !== level || worker.level_points !== points) {
      const oldLevel = worker.level;
      await Worker.update({ level, level_points: points }, { where: { id: worker.id } });

      // Create level-up achievement if promoted
      if (LEVEL_ORDER.indexOf(level) > LEVEL_ORDER.indexOf(oldLevel)) {
        await WorkerAchievement.create({
          worker_id: worker.id,
          type: 'level_up',
          title: `Promoted to ${LEVEL_META[level].label}!`,
          description: `Reached ${points} points and earned ${LEVEL_META[level].emoji} ${level} status.`,
          icon: LEVEL_META[level].emoji
        });
      }
    }

    const currentIdx = LEVEL_ORDER.indexOf(level);
    const nextLevel = currentIdx < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[currentIdx + 1] : null;
    const currentThreshold = LEVEL_THRESHOLDS[level];
    const nextThreshold = nextLevel ? LEVEL_THRESHOLDS[nextLevel] : null;

    const progressPercent = nextThreshold
      ? Math.round(((points - currentThreshold.min) / (nextThreshold.min - currentThreshold.min)) * 100)
      : 100;

    res.json({
      level,
      points,
      meta: LEVEL_META[level],
      nextLevel: nextLevel ? {
        level: nextLevel,
        meta: LEVEL_META[nextLevel],
        pointsNeeded: nextThreshold.min - points,
        progressPercent: Math.min(progressPercent, 100)
      } : null,
      breakdown: {
        jobs_completed: worker.jobs_completed || 0,
        rating_avg: parseFloat(worker.rating_avg) || 0,
        reliability_score: parseFloat(worker.reliability_score) || 0,
        attendance_score: parseFloat(worker.attendance_score) || 0,
        acceptance_rate: parseFloat(worker.acceptance_rate) || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLevelProgress = async (req, res) => {
  try {
    const worker = await Worker.findByPk(req.user.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    const achievements = await WorkerAchievement.findAll({
      where: { worker_id: worker.id },
      order: [['earned_at', 'DESC']],
      limit: 50
    });

    const points = calculateLevelPoints(worker);
    const level = determineLevel(points);

    // Generate milestones
    const milestones = [];
    if (worker.jobs_completed >= 5) milestones.push({ title: 'First 5 Jobs', icon: '⭐', done: true });
    if (worker.jobs_completed >= 25) milestones.push({ title: '25 Jobs Champion', icon: '🏅', done: true });
    if (worker.jobs_completed >= 50) milestones.push({ title: 'Half Century', icon: '🎯', done: true });
    if (worker.jobs_completed >= 100) milestones.push({ title: 'Century Master', icon: '💯', done: true });
    if (parseFloat(worker.rating_avg) >= 4.5) milestones.push({ title: 'Top Rated', icon: '🌟', done: true });
    if (parseFloat(worker.reliability_score) >= 95) milestones.push({ title: 'Ultra Reliable', icon: '🔒', done: true });
    if (worker.is_verified) milestones.push({ title: 'Verified Identity', icon: '✔', done: true });

    // Upcoming milestones
    if (worker.jobs_completed < 5) milestones.push({ title: 'Complete 5 Jobs', icon: '⭐', done: false, remaining: 5 - worker.jobs_completed });
    else if (worker.jobs_completed < 25) milestones.push({ title: 'Complete 25 Jobs', icon: '🏅', done: false, remaining: 25 - worker.jobs_completed });
    else if (worker.jobs_completed < 50) milestones.push({ title: 'Complete 50 Jobs', icon: '🎯', done: false, remaining: 50 - worker.jobs_completed });
    else if (worker.jobs_completed < 100) milestones.push({ title: 'Complete 100 Jobs', icon: '💯', done: false, remaining: 100 - worker.jobs_completed });

    // Recommendations
    const recommendations = [];
    if (parseFloat(worker.rating_avg) < 4.0) {
      recommendations.push('Focus on quality work to improve your rating above 4.0 ⭐');
    }
    if (parseFloat(worker.acceptance_rate) < 80) {
      recommendations.push('Accept more job requests to increase your acceptance rate 📈');
    }
    if (parseFloat(worker.reliability_score) < 90) {
      recommendations.push('Complete jobs on time to boost your reliability score 🔒');
    }
    if (!worker.is_verified) {
      recommendations.push('Upload verification documents to earn the Verified badge ✔');
    }
    if (worker.jobs_completed < 10) {
      recommendations.push(`Complete ${10 - worker.jobs_completed} more jobs to gain visibility 🎯`);
    }

    res.json({
      level,
      points,
      meta: LEVEL_META[level],
      achievements,
      milestones,
      recommendations,
      allLevels: LEVEL_META,
      thresholds: LEVEL_THRESHOLDS
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWorkerLevel,
  getLevelProgress,
  LEVEL_META,
  LEVEL_THRESHOLDS,
  calculateLevelPoints,
  determineLevel
};
