import React, { useState } from "react";
import {
  BsFillVolumeUpFill,
  BsVolumeDownFill,
  BsFillVolumeMuteFill,
} from "react-icons/bs";

const VolumeBar = ({ value, min, max, onChange, setVolume }) => {
  const [hoverVolume, setHoverVolume] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setHoverPosition(percent * 100);
    setHoverVolume(((percent * max) * 100).toFixed(0));
  };

  return (
    <div className="relative flex items-center w-full group">
      {/* Volume Icon */}
      {/* {value > 0.5 ? (
        <BsFillVolumeUpFill
          size={25}
          color="#FFF"
          onClick={() => setVolume(0)}
        />
      ) : value > 0 ? (
        <BsVolumeDownFill size={25} color="#FFF" onClick={() => setVolume(0)} />
      ) : (
        <BsFillVolumeMuteFill
          size={25}
          color="#FFF"
          onClick={() => setVolume(1)}
        />
      )} */}

      {/* Volume Slider */}
      <div className="relative w-32 h-2 mx-3 flex items-center">
        {hoverVolume && (
          <div
            className="absolute bottom-6 bg-black text-white text-xs px-2 py-1 rounded-lg opacity-80"
            style={{
              left: `${hoverPosition}%`,
              transform: "translateX(-50%)",
            }}>
            {hoverVolume}%
          </div>
        )}

        {/* Background Bar */}
        <div className="absolute w-full h-full bg-[#29282d] rounded-full"></div>

        {/* Progress Bar */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#ff5500] to-[#ff2200] rounded-full transition-all"
          style={{ width: `${(value / max) * 100}%` }}
        />

        {/* Input Range */}
        <input
          type="range"
          step="any"
          value={value}
          min={min}
          max={max}
          onChange={onChange}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverVolume(null)}
          className="absolute w-full h-2 opacity-0 cursor-pointer appearance-none"
        />
      </div>
    </div>
  );
};

export default VolumeBar;
