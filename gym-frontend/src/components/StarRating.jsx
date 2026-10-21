import { useState } from "react";

export default function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer text-2xl ${
            (hover || value) >= star ? "text-yellow-500" : "text-gray-300"
          }`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
