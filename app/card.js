import { noteHandler } from "./music";

export const Card = ({currentSelection, setCurrentSelection, idx, mapping}) => {
	let clickedOnce = true
	const doOnClick = (event) => {
		const buttonClassName = event.currentTarget.className;
		const isGreen = buttonClassName.includes('bg-green-500');

		if (isGreen) {
			return;
		}

		if(currentSelection[0] == idx){
			setCurrentSelection([currentSelection[1], -1]);
			clickedOnce = !clickedOnce;
		}
		else if(currentSelection[1] == idx){
			setCurrentSelection([currentSelection[0], -1]);
			clickedOnce = !clickedOnce;
		}
		else {
			currentSelection[0] != -1 && currentSelection[1] == -1 ?
			setCurrentSelection([currentSelection[0], idx]) : setCurrentSelection([idx, -1]);
		}
		if(clickedOnce) {
			noteHandler(mapping[idx]);
		}
		console.log("currentSelection[0]", currentSelection[0]);
		console.log("mapping 0:", mapping[currentSelection[0]]);
		console.log("currentSelection[1]", currentSelection[1]);
		console.log("mapping 0:",mapping[currentSelection[1]]);
	}
	return (
		<button
		  className={`h-40 w-40 flex justify-center items-center rounded-lg ${
			currentSelection[0] === idx || currentSelection[1] === idx
			  ? mapping[currentSelection[0]] === mapping[currentSelection[1]]
				? 'bg-green-500' // Change to green if both values match
				: 'bg-blue-500'  // Change to blue if only one value matches
			  : 'bg-slate-300'
		  }`}
		  onClick={doOnClick}
		>
		  My Card
		</button>
	  );
	  
	  
	  
}