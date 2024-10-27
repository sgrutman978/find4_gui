import { useEffect, useState } from 'react';

function Find4Animation() {

	// [l,t,c]
	const pairs = [[0,0,0], [0,1,0], [0,2,0], [0,3,0], [0,4,0], [1,0,0], [1,2,0], [2,0,0], //f
					[3,1,1], [3,3,1], [3,4,1], //i
					[4,2,0], [4,3,0], [4,4,0], [5,2,0], [6,2,0], [6,3,0], [6,4,0], //n
					[7,2,1], [7,3,1], [7,4,1], [8,2,1], [8,4,1], [9,0,1], [9,1,1], [9,2,1], [9,3,1], [9,4,1], //d
					[10,0,0], [10,1,0], [10,2,0], [11,2,0], [12,0,0], [12,1,0], [12,2,0], [12,3,0], [12,4,0], //4
					[13,4,1], //.
					[14,1,0], [14,3,0], [14,4,0], //i
					[15,2,1], [15,3,1], [15,4,1], [16,2,1], [16,4,1], [17,2,1], [17,3,1], [17,4,1] //o
					];
	const [items, setItems] = useState([<></>]);
	const [reset, setReset] = useState(0);
	const [counter, setCounter] = useState(0);



	useEffect(() => {
		let i = 0;
		setItems([]);
		pairs.forEach(([l,t,c]) => {
			setTimeout(() => {
				setItems(prev => [...prev, <div className={"ball " + (!c?"yellow":"red")} style={{left:(10+l*40), top:(10+t*40)}}></div>]); //key={`ball${l}${t}${c}${reset}${i}${Date.now()}`}
			}, (i+1)*100);
			i = i + 1;
		});
		let x: JSX.Element[] = [];
			pairs.forEach(([l,t,c]) => {
				x.push(<div className={"ball " + (!c?"yellow":"red")} style={{left:(10+l*40), top:(10+t*40)}}></div>); //key={`ball${l}${t}${c}${reset}${Date.now()}2`}
		});
		for(let q = 1; q < 11; q=q+1){
			setTimeout(() => {
				setItems((q%2?[]:x));
			}, ((i+1)*100+q*200));
			if(q == 10){
				setTimeout(() => {
					setReset(prev => prev + 1);
				}, (i+1)*100+q*200+5000);
			}
		}

		// let li = [<></>];
		// let i = 0;
		// pairs.forEach(([l,t,c]) => {
		// 	li.push(<div key={`balll${l}t${t}c${c}reset${reset}i${i}date${Date.now()}`} className={"ball " + (!c?"yellow":"red")} style={{left:(10+l*40), top:(10+t*40)}}></div>)
		// 	i++;
		// });
		// setItems(li);

	}, [reset])

  return (
	<div className="find4AnimationContainer" key={"animationContainer"+Date.now()}>
		{
		    items
		}
	</div>
  );
}

export default Find4Animation;

