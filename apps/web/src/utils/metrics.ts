export const calculateWPM = (typedChars: number, correctChars: number, timeMs: number, targetLength: number) => {
  if (timeMs === 0 || typedChars === 0) {
    return { rawWPM: 0, adjustedWPM: 0, accuracy: 0 };
  }

  const minutes = timeMs / 60000;
  const rawWPM = typedChars / 5 / minutes;
  const accuracy = correctChars / targetLength;
  const adjustedWPM = rawWPM * accuracy;

  return {
    rawWPM: parseFloat(rawWPM.toFixed(2)),
    adjustedWPM: parseFloat(adjustedWPM.toFixed(2)),
    accuracy: parseFloat((accuracy * 100).toFixed(2)) // у відсотках
  };
};

export const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}h`;
  } else if (minutes > 0) {
    return `${minutes}:${String(seconds).padStart(2, '0')}m`;
  } else {
    return `${String(seconds).padStart(2, '0')}s`;
  }
};
