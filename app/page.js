"use client";

import { Card } from './card';
import { useState, useEffect } from 'react';


const generateMapping = () => {
	const mapping = [];
	for(let i = 0; i < 4; i++){
		mapping.push(parseInt(i/2) + 1);
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
	const [currentSelection, setCurrentSelection]= useState([-1,-1]); 
	const [matched, setMatched] = useState([]); 
	const [timer, setTimer] = useState(60); // Initial timer value in seconds

	const refreshGame = () => {
	 mapping = generateMapping(); 
	 setCurrentSelection([-1,-1]);
	 setMatched([]);
	 setTimer(60); 
	}

  
	useEffect(() => {
	  const interval = setInterval(() => {
		setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
	  }, 1000);
  
	  return () => clearInterval(interval); // Cleanup interval on component unmount
  
	}, []);


	return (
		<main className="flex flex-col h-screen w-screen bg-gray-100 p-3">
			<div className = "text-3xl p-8">Sound Match</div>
			<div className = "flex flex-col items-center justify-center w-3/4">
			<div className = "flex flex-row gap-24">
				<div className="text-sm">
					Time Remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
				</div>
				<div className="text-sm">
					Matched Sounds: {Math.floor(matched.length / 2)}
				</div>
				<button className = "bg-blue-500 m-4 rounded-md w-24 h-12 flex justify-center items-center text-white" onClick={refreshGame}>Restart</button>
			</div>
			{[...Array(2)].map((_, rowIndex) => (
				<div key={rowIndex} className="flex flex-row m-2 gap-2">
					{[...Array(2)].map((_, colIndex) => (
					<Card
						key={`${rowIndex}-${colIndex}`}
						currentSelection={currentSelection}
						setCurrentSelection={setCurrentSelection}
						idx = {rowIndex * 2 + colIndex}
						mapping = {mapping}
						matched = {matched}
						setMatched = {setMatched}
					/>
					))}
				</div>
			))}
			</div>

		</main>
	)
}
