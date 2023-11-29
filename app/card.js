"use client";
import {useState} from "react"; 

export const Card = () => {
	const [isClicked, setIsClicked] = useState(false); 
	const doOnClick = () => {
		console.log(isClicked); 
		setIsClicked(!isClicked); 
	}
	return (
		<button className= {`h-40 w-40 flex justify-center items-center rounded-lg ${
			isClicked ? 'bg-blue-500' : 'bg-slate-300'
		  }`} onClick = {doOnClick} >My Card</button>
	)
}