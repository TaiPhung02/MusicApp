import React, { useState } from "react";

const Seekbar = ({ value, min, max, onInput, setSeekTime, appTime }) => {
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(0);

  const getTime = (time) =>
    `${Math.floor(time / 60)}:${`0${Math.floor(time % 60)}`.slice(-2)}`;

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setHoverPosition(percent * 100);
    setHoverTime(getTime(percent * max));
  };

  return (
    <div className="relative flex items-center w-full group">
      <button
        type="button"
        onClick={() => setSeekTime(appTime - 5)}
        className="hidden lg:block text-white mr-3">
        -
      </button>

      <p className="text-white text-xs">{getTime(value)}</p>

      <div className="relative w-32 md:w-56 2xl:w-96 h-2 mx-3 2xl:mx-6 flex items-center">
        {hoverTime && (
          <div
            className="absolute bottom-6 bg-black text-white text-xs px-2 py-1 rounded-lg opacity-80"
            style={{
              left: `${hoverPosition}%`,
              transform: "translateX(-50%)",
            }}>
            {hoverTime}
          </div>
        )}

        <div className="absolute w-full h-full bg-[#29282d] rounded-full"></div>

        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#ff5500] to-[#ff2200] rounded-full transition-all"
          style={{ width: `${(value / max) * 100}%` }}
        />

        <input
          type="range"
          step="any"
          value={value}
          min={min}
          max={max}
          onInput={onInput}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverTime(null)}
          className="absolute w-full h-2 opacity-0 cursor-pointer appearance-none"
        />
      </div>

      <p className="text-white text-xs">{getTime(max)}</p>

      <button
        type="button"
        onClick={() => setSeekTime(appTime + 5)}
        className="hidden lg:block text-white ml-3">
        +
      </button>
    </div>
  );
};

export default Seekbar;
