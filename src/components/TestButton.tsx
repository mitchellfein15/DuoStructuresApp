"use client";

import { useState } from "react";

export default function TestButton() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log("Test button clicked!");
    setCount(count + 1);
  };

  return (
    <div className="p-4">
      <button
        onClick={handleClick}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Test Button (Clicked {count} times)
      </button>
    </div>
  );
} 