import { useState, FormEvent } from 'react';
import { socket } from '../socket';
import { useInitData } from '@telegram-apps/sdk-react';

export function MyForm() {
  const username = useInitData()?.user?.username;
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clicks, setClicks] = useState(0)

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(5000).emit('create-something', value, () => {
      setIsLoading(false);
    });
  }

  function clicker() {
    socket.emit('click', username);
    let newClick = clicks + 1
    setClicks(newClick)
  }

  return (
    <>
    <form onSubmit={ onSubmit }>
      <input onChange={ e => setValue(e.target.value) } />

      <button type="submit" disabled={ isLoading }>Submit</button>
    </form>
    <button onClick={ clicker }>CLICK ME</button>
    <p>YOUR CLIKS: {clicks}</p>
    </>

    
  );
}