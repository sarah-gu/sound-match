"use client";

import { Card } from './card';
import { useState } from 'react';

const generateMapping = () => {
	const mapping = [];
	while (mapping.length < 16) {
		const random = Math.floor(Math.random() * 2) + 1;
		mapping.push(random);
	}
	console.log(mapping);
	return mapping;
}

export default function Home() {
	const [currentSelection, setCurrentSelection]= useState([-1,-1]); 
	const mapping = generateMapping();

	return (
		<main className="flex flex-col h-screen w-screen bg-gray-100 p-3">
			<div className = "text-3xl p-8">Sound Match</div>
			<div className = "flex flex-col items-center justify-center">
			{[...Array(4)].map((_, rowIndex) => (
				<div key={rowIndex} className="flex flex-row m-2 gap-2">
					{[...Array(4)].map((_, colIndex) => (
					<Card
						key={`${rowIndex}-${colIndex}`}
						currentSelection={currentSelection}
						setCurrentSelection={setCurrentSelection}
						idx = {rowIndex * 4 + colIndex}
						mapping = {mapping}
					/>
					))}
				</div>
			))}
			</div>
		</main>
	)
}
