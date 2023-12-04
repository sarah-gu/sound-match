import { noteHandler } from "./music";

export const Card = ({currentSelection, setCurrentSelection, idx, mapping}) => {
	const doOnClick = () => {
		if(currentSelection[0] == idx){
			setCurrentSelection([currentSelection[1], -1]);
		}
		else if(currentSelection[1] == idx){
			setCurrentSelection([currentSelection[0], -1]);
		}
		else {
			currentSelection[0] != -1 && currentSelection[1] == -1 ?
			setCurrentSelection([currentSelection[0], idx]) : setCurrentSelection([idx, -1]);
		}
		noteHandler(mapping[idx]);
	}
	return (
		<button className= {`h-40 w-40 flex justify-center items-center rounded-lg ${
			currentSelection[0] == idx || currentSelection[1] == idx ? 'bg-blue-500' : 'bg-slate-300'
		  }`} onClick = {doOnClick} >My Card</button>
	)
}