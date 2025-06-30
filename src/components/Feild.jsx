import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import messi from '../assets/messi.png';
import football from '../assets/football.png';

const BALL_SIZE = 64;
const MESSI_SIZE = 96;

function Field() {
  const [messiPos, setMessiPos] = useState({ x: 200, y: 200 });
  const [ballPos, setBallPos] = useState({ x: 0, y: 0 });
  const [ballVelocity, setBallVelocity] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [score, setScore] = useState(0);

  const fieldRef = useRef(null);
  const goalRef = useRef(null);
  const navigate = useNavigate();

  // Center the ball on first render
  useEffect(() => {
    if (fieldRef.current) {
      const field = fieldRef.current;
      const centerX = field.offsetWidth / 2 - BALL_SIZE / 2;
      const centerY = field.offsetHeight / 2 - BALL_SIZE / 2;
      setBallPos({ x: centerX, y: centerY });
    }
  }, []);

  // Animate ball movement and check for goal
  useEffect(() => {
    let animationFrame;

    const moveBall = () => {
      setBallPos((prev) => {
        let newX = prev.x + ballVelocity.x;
        let newY = prev.y + ballVelocity.y;

        const fieldWidth = fieldRef.current.offsetWidth;
        const fieldHeight = fieldRef.current.offsetHeight;

        let newVelX = ballVelocity.x;
        let newVelY = ballVelocity.y;

        // Bounce off left/right
        if (newX <= 0 || newX >= fieldWidth - BALL_SIZE) {
          newVelX = -newVelX * 0.9;
          newX = Math.max(0, Math.min(newX, fieldWidth - BALL_SIZE));
        }

        // Bounce off top/bottom
        if (newY <= 0 || newY >= fieldHeight - BALL_SIZE) {
          newVelY = -newVelY * 0.9;
          newY = Math.max(0, Math.min(newY, fieldHeight - BALL_SIZE));
        }

        // Apply friction
        newVelX *= 0.95;
        newVelY *= 0.95;

        // Stop if velocity is very low
        if (Math.abs(newVelX) < 0.1) newVelX = 0;
        if (Math.abs(newVelY) < 0.1) newVelY = 0;

        setBallVelocity({ x: newVelX, y: newVelY });

        // Check collision with goal
        if (goalRef.current && fieldRef.current) {
          const ballRect = {
            x: newX,
            y: newY,
            width: BALL_SIZE,
            height: BALL_SIZE,
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
              x: fieldWidth / 2 - BALL_SIZE / 2,
              y: fieldHeight / 2 - BALL_SIZE / 2,
            };
          }
        }

        return { x: newX, y: newY };
      });

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

    let x = clientX - rect.left - MESSI_SIZE / 2;
    let y = clientY - rect.top - MESSI_SIZE / 2;

    x = Math.max(0, Math.min(x, fieldWidth - MESSI_SIZE));
    y = Math.max(0, Math.min(y, fieldHeight - MESSI_SIZE));

    setMessiPos({ x, y });

    const dx = ballPos.x - x;
    const dy = ballPos.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 48) {
      const directionX = dx / distance;
      const directionY = dy / distance;

      const kickStrength = 12;

      setBallVelocity({
        x: directionX * kickStrength,
        y: directionY * kickStrength,
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
