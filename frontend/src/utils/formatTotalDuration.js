export const formatTotalDuration = (tracks) => {
  if (!tracks || tracks.length === 0) return "0 minutes";

  const totalSeconds = tracks.reduce((sum, track) => sum + track.duration, 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} hrs ${minutes} minutes`;
  }
  return `${minutes} minutes`;
};