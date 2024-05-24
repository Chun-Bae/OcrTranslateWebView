import { useEffect, useState } from "react";

export const useWheelSelection = (items) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleWheel = (event) => {
    if (event.deltaY < 0) {
      // Scroll up
      setSelectedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : items.length - 1
      );
    } else {
      // Scroll down
      setSelectedIndex((prevIndex) =>
        prevIndex < items.length - 1 ? prevIndex + 1 : 0
      );
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", handleWheel);
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [items]);

  return [selectedIndex, setSelectedIndex];
};
