type PostStats = {
  views: number;
  totalTime: number;
  clicks: number;
};

const stats: Record<number, PostStats> = {};
const categoryStats: Record<string, number> = {};

export function trackView(postId: number, duration: number, category: string) {
  if (!stats[postId]) {
    stats[postId] = { views: 0, totalTime: 0, clicks: 0 };
  }

  stats[postId].views += 1;
  stats[postId].totalTime += duration;

  // Track category preference
  if (!categoryStats[category]) {
    categoryStats[category] = 0;
  }

  categoryStats[category] += duration;


}

export function trackClick(postId: number) {
  if (!stats[postId]) {
    stats[postId] = { views: 0, totalTime: 0, clicks: 0 };
  }

  stats[postId].clicks += 1;


}

export function getStats() {
  return stats;
}

export function getPostScore(postId: number) {
  const stat = stats[postId];

  if (!stat) return 0;

  const avgTime = stat.views ? stat.totalTime / stat.views : 0;

  // Simple scoring formula
  return avgTime * 0.7 + stat.clicks * 2;
}

export function getTopPostId() {
  let bestId = null;
  let bestScore = -1;

  for (const id in stats) {
    const score = getPostScore(Number(id));
    if (score > bestScore) {
      bestScore = score;
      bestId = Number(id);
    }
  }

  return bestId;
}

export function getCategoryScore(category: string) {
  return categoryStats[category] || 0;
}

let trackingMode = "manipulative";
export function setTrackingMode(mode: string) {
  trackingMode = mode;
}
export function getTrackingMode() {
  return trackingMode;
}

export function getAttentionScore() {
  let totalTime = 0;
  let totalViews = 0;

  for (const id in stats) {
    totalTime += stats[id].totalTime;
    totalViews += stats[id].views;
  }

  if (totalViews === 0) return 0;

  return totalTime / totalViews;
}