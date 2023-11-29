"use client";

import { Card } from './card';
import { useState } from 'react';

export default function Home() {

	return (
		<main className="flex flex-col h-screen w-screen bg-gray-100 p-3">
			<div className = "text-3xl p-8">Sound Match</div>
			<div className = "flex flex-col items-center justify-center">
			{[...Array(4)].map((_, rowIndex) => (
				<div key={rowIndex} className="flex flex-row m-2 gap-2">
					{[...Array(4)].map((_, colIndex) => (
					<Card
						key={`${rowIndex}-${colIndex}`}
					/>
					))}
				</div>
			))}
			</div>
		</main>
	)
}
