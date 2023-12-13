"use client";

import { Card } from './card';
import { useState } from 'react';


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
	const refreshGame = () => {
	 mapping = generateMapping(); 
	 setCurrentSelection([-1,-1]);
	 setMatched([]);
	}
	return (
		<main className="flex flex-col h-screen w-screen bg-gray-100 p-3">
			<div className = "text-3xl p-8">Sound Match</div>
			<div className = "flex flex-col items-center justify-center">
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
			<button className = "bg-blue-500 m-4 rounded-md w-24 h-12 flex justify-center items-center text-white" onClick={refreshGame}>Restart</button>
		</main>
	)
}
