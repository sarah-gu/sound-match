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
		  className={`h-40 w-40 flex justify-center items-center rounded-lg ${
			matched.includes(idx) ? 'bg-green-500' : currentSelection[0] === idx || currentSelection[1] === idx
			  ? 'bg-blue-500'  // Change to blue if only one value matches
			  : 'bg-slate-300'
		  }`}
		  onClick={doOnClick}
		>
		  My Card
		</button>
	  );
	  
	  
	  
}