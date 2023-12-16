"use client";

import { Card } from "./card";
import { SideElement } from "./sidebar";
import { useState, useEffect } from "react";
import { getRandomSynthMethod } from "./music";

const generateMapping = ({ gridSize, level }) => {
  console.log(gridSize);
  const mapping = [];
  for (let i = 0; i < gridSize * gridSize; i++) {
    mapping.push(parseInt(i / 2) + 1);
  }

  for (let i = mapping.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mapping[i], mapping[j]] = [mapping[j], mapping[i]];
  }

  console.log(mapping);

  let synthMethods = [];
  let wordCards = {};
  if (level == 3) {
    synthMethods = getRandomSynthMethod();
    console.log(synthMethods);
    var alreadySet = [];
    mapping.forEach((card, idx) => {
      if (!alreadySet.includes(card)) {
        const synth = synthMethods[card - 1][0];
        const synthVals = synthMethods[card - 1][1];
        console.log(synth);
        if (!alreadySet.includes(card)) {
          wordCards[idx] =
            synth.useAdditive && synthVals[1] != 0
              ? `ADDITIVE, num partials: ${synthVals[0]} lfo switch: ${synthVals[1]}\n lfo freq: ${synthVals[2]}\n lfo gain: ${synthVals[2]}`
              : synth.useAdditive && synthVals[1] == 0
              ? `ADDITIVE, num partials: ${synthVals[0]}`
              : synth.useFrequency
              ? `FREQUENCY,\n mod index: ${synthVals[0]}\n mod freq: ${synthVals[1]}\n`
              : "WAVETABLE";
          alreadySet.push(card);
        }
      }
    });
  }

  return { mapping, synthMethods, wordCards };
};

let { mapping, synthMethods, wordCards } = generateMapping({
  gridSize: 2,
  level: 1,
});

export default function Home() {
  const [currentSelection, setCurrentSelection] = useState([-1, -1]);
  const [matched, setMatched] = useState([]);
  const [timer, setTimer] = useState(60); // Initial timer value in seconds
  const [displayMenu, setDisplayMenu] = useState(false);
  const [level, setLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const gridSize = level == 1 ? 2 : 4;

  const refreshGame = () => {
    ({ mapping, synthMethods, wordCards } = generateMapping({
      gridSize: gridSize,
      level: level,
    }));
    setCurrentSelection([-1, -1]);
    setMatched([]);
    setTimer(60);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [timer]);

  const onLevelChange = (level) => {
    setLevel(level);
    setDisplayMenu(false);
    ({ mapping, synthMethods, wordCards } = generateMapping({
      gridSize: level == 1 ? 2 : 4,
      level: level,
    }));
    setCurrentSelection([-1, -1]);
    setMatched([]);
    setTimer(60);
  };

  return (
    <main className="flex flex-col h-screen w-screen bg-white">
      <div className="text-5xl p-8 font-bold flex justify-center border-b-2 text-black">
        sound match
      </div>
      <div className="flex flex-row m-2">
        <div className="flex flex-col p-3 basis-1/6">
          <div className="text-sm">
            <button
              className="w-24 text-white bg-black hover:bg-card-color-selected rounded-md h-8 flex justify-center items-center font-bold"
              onClick={() => {
                setDisplayMenu(!displayMenu);
              }}
            >
              pick level
            </button>
          </div>
          {displayMenu ? (
            <div className="flex flex-col pt-2 text-white rounded-lg justify-center divide-y w-36">
              <button
                className="hover:bg-card-color-selected bg-card-color-unselected rounded-md"
                onClick={() => onLevelChange(1)}
              >
                1
              </button>
              <button
                className="hover:bg-card-color-selected bg-card-color-unselected rounded-md "
                onClick={() => onLevelChange(2)}
              >
                2
              </button>
              <button
                className="hover:bg-card-color-selected bg-card-color-unselected rounded-md "
                onClick={() => onLevelChange(3)}
              >
                3
              </button>
            </div>
          ) : (
            <div className="mt-12">
              {level == 1
                ? "match sounds on a 2x2 grid. sounds generated via evolutionary method of genetic algorithm."
                : level == 2
                ? "match sounds on a 4x4 grid. sounds generated via evolutionary method of genetic algorithm."
                : "match sounds based on synthesis type.  sounds generated via evolutionary method of genetic algorithm + synthesis."}
              <div className="mt-24">
                {" "}
                ***note: tile color does NOT correspond to match
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-row justify-center gap-10 rounded-xl mx-24 basis-5/6 mt-12">
          <div className="flex flex-col items-center justify-center rounded-lg">
            {[...Array(gridSize)].map((_, rowIndex) => (
              <div key={rowIndex} className="flex flex-row">
                {[...Array(gridSize)].map((_, colIndex) => (
                  <Card
                    key={`${rowIndex}-${colIndex}`}
                    currentSelection={currentSelection}
                    setCurrentSelection={setCurrentSelection}
                    idx={rowIndex * gridSize + colIndex}
                    mapping={mapping}
                    matched={matched}
                    setMatched={setMatched}
                    gridSize={gridSize}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    synths={synthMethods}
                    level={level}
                    wordCards={wordCards}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-10 p-6 justify-center items-center">
            <SideElement header="LEVEL" contents={level} />
            <SideElement
              header="TIME"
              contents={`${Math.floor(timer / 60)}:${
                timer % 60 < 10 ? `0${timer % 60}` : timer % 60
              }`}
            />
            <SideElement
              header="SCORE"
              contents={Math.floor(matched.length / 2)}
            />

            <button
              className="border border-black text-black hover:bg-card-color-selected m-4 rounded-full w-32 h-12 flex justify-center items-center font-bold"
              onClick={refreshGame}
            >
              restart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
