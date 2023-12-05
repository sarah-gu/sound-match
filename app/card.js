import { noteHandler } from "./music";

export const Card = ({currentSelection, setCurrentSelection, idx, mapping, matched, setMatched}) => {
	const doOnClick = () => {
		if(matched.includes(idx))
		{
			return; 
		}
		if(currentSelection[0] == idx){
			setCurrentSelection([currentSelection[1], -1]);
		}
		else if(currentSelection[1] == idx){
			setCurrentSelection([currentSelection[0], -1]);
		}
		else {
			if(currentSelection[0] != -1 && currentSelection[1] == -1){
				setCurrentSelection([currentSelection[0], idx])
				if(mapping[currentSelection[0]] == mapping[idx]){
					setMatched([...matched, idx, currentSelection[0]]);
				}
			}
			else{
				setCurrentSelection([idx, -1]);
			}
			noteHandler(mapping[idx]); 
		}
		console.log("currentSelection[0]", currentSelection[0]);
		console.log("mapping 0:", mapping[currentSelection[0]]);
		console.log("currentSelection[1]", currentSelection[1]);
		console.log("mapping 0:",mapping[currentSelection[1]]);
	}
	return (
		<button
		  className={`h-64 w-64 flex justify-center items-center rounded-lg ${
			matched.includes(idx) ? 'bg-green-500' : currentSelection[0] === idx || currentSelection[1] === idx
			  ? 'bg-blue-500'  // Change to blue if only one value matches
			  : 'bg-slate-300'
		  }`}
		  onClick={doOnClick}
		>
		  	<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"/></svg>

		</button>
	  );
	  
	  
	  
}