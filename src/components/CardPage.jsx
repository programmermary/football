import React, { useState } from 'react'
import confetti from 'canvas-confetti'
import fromTo from '../assets/fromTo.jpg'
function CardPage() {
  const [showCard, setShowCard] = useState(false)

  const onClickHandle = () => {
    // 1. Fireworks
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    })

    // 2. Wait 2 seconds, then show card
    setTimeout(() => {
      setShowCard(true)
    }, 2000)
  }

  return (
    <div className='bg-red-300 w-screen h-screen flex flex-col gap-4 p-4 items-center justify-center'>
      <h1 className='text-2xl font-bold text-white text-center'>
        🎉 You are here because you got a high score! 🎉
      </h1>

      <div className='flex flex-col items-center gap-4 bg-white p-6 rounded-lg shadow-lg'>
        <h2 className='text-lg font-medium'>Click the button to claim your prize:</h2>

        {/* 👇 Only show the button if the card is not yet shown */}
        {!showCard && (
          <button
            onClick={onClickHandle}
            className='bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition duration-300'
          >
            🎁 Click Me!
          </button>
        )}
      </div>

      {/* 🎉 Show card after delay */}
      {showCard && (
        <div className='card mt-6 flex flex-col items-center gap-2 animate-fade-in'>
          <img src={fromTo} alt="card" className='w-64 rounded shadow-lg' />
          <h1 className='text-white text-2xl font-bold'>🎂 Happy Birthday! 🎂</h1>
        </div>
      )}
    </div>
  )
}

export default CardPage
