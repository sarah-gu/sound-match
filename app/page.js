"use client";

import { Card } from "./card";
import { SideElement } from "./sidebar";
import { useState, useEffect } from "react";

const generateMapping = () => {
  const mapping = [];
  for (let i = 0; i < 16; i++) {
    mapping.push(parseInt(i / 2) + 1);
  }

  for (let i = mapping.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mapping[i], mapping[j]] = [mapping[j], mapping[i]];
  }

  console.log(mapping);
  return mapping;
};

let mapping = generateMapping();

export default function Home() {
  const [currentSelection, setCurrentSelection] = useState([-1, -1]);
  const [matched, setMatched] = useState([]);
  const [timer, setTimer] = useState(60); // Initial timer value in seconds

  const refreshGame = () => {
    mapping = generateMapping();
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

  return (
    <main className="flex flex-col h-screen w-screen bg-white">
      <div className="text-5xl p-8 font-bold flex justify-center border-b-2 text-card-color-matched">
        SOUND MATCH
      </div>
      <div className="flex flex-row justify-center gap-6 rounded-xl p-12 mx-24">
        <div className="flex flex-col items-center justify-center rounded-lg">
          {[...Array(4)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex flex-row m-2 gap-2">
              {[...Array(4)].map((_, colIndex) => (
                <Card
                  key={`${rowIndex}-${colIndex}`}
                  currentSelection={currentSelection}
                  setCurrentSelection={setCurrentSelection}
                  idx={rowIndex * 4 + colIndex}
                  mapping={mapping}
                  matched={matched}
                  setMatched={setMatched}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-10 p-6 justify-center items-center">
          <SideElement header="LEVEL" contents="1" />
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
          {/* <div className="text-sm">
            Matched Sounds: {Math.floor(matched.length / 2)}
          </div> */}
          <button
            className="border border-card-color-matched text-card-color-matched hover:bg-brown m-4 rounded-full w-32 h-12 flex justify-center items-center font-bold"
            onClick={refreshGame}
          >
            RESTART
          </button>
        </div>
      </div>
    </main>
  );
}
