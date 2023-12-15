import { noteHandler } from "./music";

const background_colors = [
  "bg-purple",
  "bg-pink",
  "bg-blue",
  "bg-dark-pink",
  "bg-light-blue",
  "bg-cream",
  "bg-pink",
  "bg-purple",
  "bg-blue",
  "bg-dark-pink",
  "bg-light-blue",
  "bg-cream",
  "bg-dark-pink",
  "bg-purple",
  "bg-pink",
  "bg-light-blue",
];

export const Card = ({
  currentSelection,
  setCurrentSelection,
  idx,
  mapping,
  matched,
  setMatched,
  gridSize,
  isPlaying,
  setIsPlaying,
  synths,
  level,
  wordCards,
}) => {
  const doOnClick = () => {
    if (matched.includes(idx)) {
      return;
    }
    if (currentSelection[0] == idx) {
      setCurrentSelection([currentSelection[1], -1]);
    } else if (currentSelection[1] == idx) {
      setCurrentSelection([currentSelection[0], -1]);
    } else {
      if (currentSelection[0] != -1 && currentSelection[1] == -1) {
        setCurrentSelection([currentSelection[0], idx]);
        if (mapping[currentSelection[0]] == mapping[idx]) {
          setMatched([...matched, idx, currentSelection[0]]);
        }
      } else {
        setCurrentSelection([idx, -1]);
      }
      if (wordCards.hasOwnProperty(idx)) {
        return;
      }
      setIsPlaying(true);
      noteHandler(mapping[idx], setIsPlaying, synths, level);
    }
    // console.log("currentSelection[0]", currentSelection[0]);
    // console.log("mapping 0:", mapping[currentSelection[0]]);
    // console.log("currentSelection[1]", currentSelection[1]);
    // console.log("mapping 0:", mapping[currentSelection[1]]);
  };
  return (
    <button
      className={`${
        gridSize == 2 ? "h-64 w-64" : "h-36 w-36"
      }  flex justify-center items-center rounded-lg shadow-lg border-4 m-1 border-black ${
        !isPlaying && !matched.includes(idx)
          ? "hover:bg-card-color-selected"
          : ""
      } ${
        matched.includes(idx)
          ? "bg-card-color-matched"
          : currentSelection[0] === idx || currentSelection[1] === idx
          ? "bg-card-color-selected" // Change to blue if only one value matches
          : background_colors[idx]
      }`}
      onClick={doOnClick}
      disabled={isPlaying || matched.includes(idx)}
    >
      {matched.includes(idx) ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="16"
          width="16"
          viewBox="0 0 512 512"
          className="text-white"
        >
          <path d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z" />
        </svg>
      ) : wordCards.hasOwnProperty(idx) && currentSelection.includes(idx) ? (
        <div>{wordCards[idx]}</div>
      ) : (
        <div></div>
      )}
    </button>
  );
};
