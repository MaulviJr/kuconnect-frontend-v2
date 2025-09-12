import "ldrs/react/Bouncy.css";
import { Bouncy } from "ldrs/react";

export default function Loader({
  size = 50,
  speed = 1,
  color = "#34d399",
  fullScreen = false,
}) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "fixed inset-0 bg-white/50 z-50" : "w-full h-full"
      }`}>
      <Bouncy size={size} speed={speed} color={color} />
    </div>
  );
}
