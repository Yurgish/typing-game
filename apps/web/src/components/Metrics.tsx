import { useTypingMetricsStore } from '@/stores/useTypingMetricsStore';
import { formatTime } from '@/utils/metrics';

const Metrics = () => {
  const {
    screenStartTime,
    lessonStartTime,
    errors,
    backspaces,
    typedCharacters,
    correctCharacters,
    currentScreenRawWPM,
    currentScreenAdjustedWPM,
    currentScreenAccuracy,
    currentScreenTimeTaken
  } = useTypingMetricsStore();
  return (
    <div>
      <div>Screen Start Time: {screenStartTime}</div>
      <div>Lesson Start Time: {lessonStartTime}</div>
      <div>Errors: {errors}</div>
      <div>Backspaces: {backspaces}</div>
      <div>Typed Characters: {typedCharacters}</div>
      <div>Correct Characters: {correctCharacters}</div>
      <div>Current Screen Raw WPM: {currentScreenRawWPM}</div>
      <div>Current Screen Adjusted WPM: {currentScreenAdjustedWPM}</div>
      <div>Current Screen Accuracy: {currentScreenAccuracy}</div>
      <div>Current Screen Time Taken: {formatTime(currentScreenTimeTaken)}</div>
    </div>
  );
};

export default Metrics;
