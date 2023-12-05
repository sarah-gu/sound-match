"use client";

import { Card } from './card';
import { useState } from 'react';

const generateMapping = () => {
	const mapping = [];
	const values = [1, 1, 2, 2];
  
	while (mapping.length < 4) {
	  const randomIndex = Math.floor(Math.random() * values.length);
	  const randomValue = values[randomIndex];
  
	  mapping.push(randomValue);
	  values.splice(randomIndex, 1);
	}
  
	console.log(mapping);
	return mapping;
  };
  

export default function Home() {
	const [currentSelection, setCurrentSelection]= useState([-1,-1]); 
	const mapping = generateMapping();

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
					/>
					))}
				</div>
			))}
			</div>
		</main>
	)
}
