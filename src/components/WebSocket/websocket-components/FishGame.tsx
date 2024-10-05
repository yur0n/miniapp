import { useState, useEffect } from 'react';
import { socket } from '../socket';
import { useInitData } from '@telegram-apps/sdk-react';
import NoFishImg from '/images/nofish.webp'
import FishImg from '/images/fish.webp'

export function FishGame() {
  const username = useInitData()?.user?.username;
	const [tries, setTries] = useState(5);
	const [fishBalance, setFishBalance] = useState(0);
	const [currImage, setCurrImage] = useState(NoFishImg)
	const [modal, setModal] = useState(false);
	const [msg1, setMsg1] = useState('');
	const [msg2, setMsg2] = useState('');

	useEffect(()=> {
		const balance = localStorage.getItem('fish-balance');
		setFishBalance(Number(balance));
	})


	const fish = { 'tiny': 1, 'smallest': 2, 'smaller': 3, 'small': 4, 'normal': 5, 'big': 6, 'bigger': 7, 'biggest': 8, 'giant': 9 } as const;
	const fishKeys = Object.keys(fish) as Array<keyof typeof fish>
	const getRandomFish = () => {
		return fishKeys[Math.floor(Math.random() * fishKeys.length)];
	}

	const fishing = () => {
		if (tries > 0) {
			const randomFish = getRandomFish()
			const price: number = fish[randomFish]
			socket.emit('fishing', username, price);
			setCurrImage(FishImg)
			setTries(prev => --prev);
			localStorage.setItem('fish-balance', (fishBalance + price).toString());
			showModal(true, `You've got ${randomFish.toUpperCase()} fish`, `Price: $${price}`);
		} else {
			showModal(true, `You have no more tries left`)
		}

	}

	const handleModalClose = () => {
		setCurrImage(NoFishImg);
		showModal(false);
	}

	const showModal = (state: boolean, firstMsg = '', secondMsg = '') => {
		setModal(state);
		setMsg1(firstMsg);
		setMsg2(secondMsg);
	}


  return (
    <>
			<img src={currImage} alt="a"  style={{ 
          maxWidth: '100%',  // Ensure the image doesn't overflow horizontally
          maxHeight: '100%', // Ensure the image doesn't overflow vertically
          objectFit: 'contain'  // Maintain the image aspect ratio and ensure it fits inside the container
        }} />
			{
				modal 
				? 
				<div>
					<div>
						<p>{msg1}</p>
						<p>{msg2}</p>
					</div>
					<button onClick={handleModalClose}>
						OK
					</button>
				</div>
				:
				<div>
					<p>Tries: {tries}</p>
					<p>Balance: {fishBalance}</p>
					<button onClick={fishing}>
						FISHING
					</button>
				</div>
			}
    </>
  );
}