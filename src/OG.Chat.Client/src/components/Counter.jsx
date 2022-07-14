import { useState } from 'react';

export const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count => count + 1);

  const decrement = () => setCount(count => count - 1);

  const incrementBy10 = () => setCount(count => count + 10);

  const decrementBy10 = () => setCount(count => count - 10);

  return (
    <div>
      <h2>
        Number: <b>{count}</b>
      </h2>
      <br />
      <br />
      <button onClick={() => increment()}>Increment</button>{' '}
      <button onClick={() => decrement()}>Decrement</button>{' '}
      <button onClick={() => incrementBy10()}>Increment 10</button>{' '}
      <button onClick={() => decrementBy10()}>Decrement 10</button>{' '}
    </div>
  );
};
