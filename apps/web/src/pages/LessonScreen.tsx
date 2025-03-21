import { useEffect } from "react";

import TypingText from "@/components/TypingText/TypingText";
import { useTypingHandler } from "@/hooks/useTypingHandler";
import { useTypingStore } from "@/stores/useTypingStore";

export default function LessonScreen() {
  const { setTargetText } = useTypingStore();
  useTypingHandler();

  useEffect(() => {
    setTargetText(
      "sdgfjlkdskjls sdglkjgsdlkj sgsdlkjgsdlkjsgdg sdgsdlkjgsdlkj; kjsdh skdj sdkjhs dkjh hkj sdkhj sdkhj sd sdkhj sdkhj sdkhj",
    );
  }, [setTargetText]);

  return (
    <>
      <TypingText />
    </>
  );
}
