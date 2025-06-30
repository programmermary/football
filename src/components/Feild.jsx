import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import messi from '../assets/messi.png';
import football from '../assets/football.png';

function Field() {
  const [messiPos, setMessiPos] = useState({ x: 200, y: 200 });
  const [ballPos, setBallPos] = useState({ x: 300, y: 200 });
  const [ballVelocity, setBallVelocity] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [score, setScore] = useState(0);

  const fieldRef = useRef(null);
  const goalRef = useRef(null);
  const navigate = useNavigate();

  // Animate ball movement and check for goal
  useEffect(() => {
    let animationFrame;

    const moveBall = () => {
      setBallPos((prev) => {
        const newX = prev.x + ballVelocity.x;
        const newY = prev.y + ballVelocity.y;

        if (goalRef.current && fieldRef.current) {
          const ballSize = 64;
          const ballRect = {
            x: newX,
            y: newY,
            width: ballSize,
            height: ballSize,
          };

          const goalRect = goalRef.current.getBoundingClientRect();
          const fieldRect = fieldRef.current.getBoundingClientRect();

          const goalBox = {
            x: goalRect.left - fieldRect.left,
            y: goalRect.top - fieldRect.top,
            width: goalRect.width,
            height: goalRect.height,
          };

          const isCollision =
            ballRect.x < goalBox.x + goalBox.width &&
            ballRect.x + ballRect.width > goalBox.x &&
            ballRect.y < goalBox.y + goalBox.height &&
            ballRect.y + ballRect.height > goalBox.y;

          if (isCollision) {
            setScore((prevScore) => {
              const newScore = prevScore + 1;
              if (newScore >= 4) {
                setTimeout(() => navigate('/card'), 500);
              }
              return newScore;
            });

            return {
              x: fieldRef.current.offsetWidth / 2 - 32,
              y: fieldRef.current.offsetHeight / 2 - 32,
            };
          }
        }

        return { x: newX, y: newY };
      });

      setBallVelocity((prev) => ({
        x: prev.x * 0.95,
        y: prev.y * 0.95,
      }));

      animationFrame = requestAnimationFrame(moveBall);
    };

    if (ballVelocity.x !== 0 || ballVelocity.y !== 0) {
      animationFrame = requestAnimationFrame(moveBall);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [ballVelocity, navigate]);

  // Handle drag start/end
  const handleMouseDown = () => setDragging(true);
  const handleTouchStart = () => setDragging(true);
  const handleMouseUp = () => setDragging(false);
  const handleTouchEnd = () => setDragging(false);

  // Handle dragging with boundary constraints
  const handleMove = (clientX, clientY) => {
    if (!dragging || !fieldRef.current) return;

    const rect = fieldRef.current.getBoundingClientRect();
    const fieldWidth = fieldRef.current.offsetWidth;
    const fieldHeight = fieldRef.current.offsetHeight;

    const messiSize = 96;
    let x = clientX - rect.left - messiSize / 2;
    let y = clientY - rect.top - messiSize / 2;

    // Clamp Messi inside field
    x = Math.max(0, Math.min(x, fieldWidth - messiSize));
    y = Math.max(0, Math.min(y, fieldHeight - messiSize));

    setMessiPos({ x, y });

    // Collision with ball
    const dx = ballPos.x - x;
    const dy = ballPos.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 48) {
      const directionX = dx / distance;
      const directionY = dy / distance;

      setBallVelocity({
        x: directionX * 10,
        y: directionY * 10,
      });
    }
  };

  const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);
  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  return (
    <div
      ref={fieldRef}
      className="fixed top-0 left-0 w-screen h-screen bg-green-600 flex flex-col justify-between items-center py-6 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Score */}
      <div className="absolute top-4 left-4 text-white text-2xl font-bold z-50">
        Score: {score}
      </div>

      {/* Messi */}
      <img
        src={messi}
        alt="Messi"
        className="w-24 h-24 rounded-full border-4 border-white absolute z-50 cursor-pointer"
        style={{ left: messiPos.x, top: messiPos.y }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        draggable={false}
      />

      {/* Ball */}
      <img
        src={football}
        alt="Football"
        className="w-16 h-16 rounded-full border-4 border-white absolute z-40"
        style={{ left: ballPos.x, top: ballPos.y }}
        draggable={false}
      />

      {/* Top Goal */}
      <div className="relative w-full h-1/4 flex justify-center items-start">
        <div className="w-3/4 h-full border-4 border-white flex flex-col items-center justify-start">
          <div className="w-1/2 h-1/2 border-4 border-white mt-2"></div>
        </div>
        <div className="absolute bottom-[-40px] w-20 h-11 border-4 border-white rounded-b-full bg-green-600"></div>
      </div>

      {/* Midfield */}
      <div className="relative w-full h-1/2 flex items-center justify-center">
        <div className="w-32 h-32 border-4 border-white rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
        <div className="absolute w-full h-1 bg-white"></div>
      </div>

      {/* Bottom Goal */}
      <div className="relative w-full h-1/4 flex justify-center items-end">
        <div className="absolute top-[-40px] w-20 h-11 border-4 border-white rounded-t-full bg-green-600"></div>
        <div className="w-3/4 h-full border-4 border-white flex flex-col items-center justify-end">
          <div
            ref={goalRef}
            className="w-1/2 h-1/2 border-4 border-white mb-2"
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Field;
