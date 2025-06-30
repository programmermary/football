import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import CardBatman from '../assets/cardBatman.jpg';

function CardPage() {
  const [showCard, setShowCard] = useState(false);
  const navigate = useNavigate();

  const onClickHandle = () => {
    // Launch confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Show card after 2 seconds
    setTimeout(() => {
      setShowCard(true);
    }, 2000);
  };

  const handleRestart = () => {
    navigate('/');
  };

  return (
    <div className='bg-red-300 w-screen h-screen flex flex-col gap-4 p-4 items-center justify-center'>
      <h1 className='text-2xl font-bold text-white text-center'>
        🎉 You are here because you got a high score! 🎉
      </h1>

      {/* 🎁 Click Me Section (hidden after card is shown) */}
      {!showCard && (
        <div className='flex flex-col items-center gap-4 bg-white p-6 rounded-lg shadow-lg'>
          <h2 className='text-lg font-medium'>Click the button to claim your prize:</h2>
          <button
            onClick={onClickHandle}
            className='bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition duration-300'
          >
            🎁 Click Me!
          </button>
        </div>
      )}

      {/* 🎂 Card Display */}
      {showCard && (
        <div className='card mt-6 flex flex-col items-center gap-4 animate-fade-in'>
          <img src={CardBatman} alt="card" className='w-64 rounded shadow-lg' />
          <h1 className='text-white text-2xl font-bold'>🎂 Happy Birthday! 🎂</h1>

          <button
            onClick={handleRestart}
            className='mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300'
          >
            🔄 Start New Game
          </button>
        </div>
      )}
    </div>
  );
}

export default CardPage;
