import { IconCaretLeftFilled, IconCaretRightFilled } from "@tabler/icons-react";
import { useState } from "react";

type SliderProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  slidesToShow?: number;
};

export default function Slider<T>({ items, renderItem, slidesToShow = 3 }: SliderProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    if (currentIndex + slidesToShow < items.length) {
      setCurrentIndex(currentIndex + slidesToShow);
    }
  };

  const prev = () => {
    if (currentIndex - slidesToShow >= 0) {
      setCurrentIndex(currentIndex - slidesToShow);
    }
  };

  const visibleItems = items.slice(currentIndex, currentIndex + slidesToShow);

  return (
    <div className="my-8 w-full flex justify-center items-center">

      {/* Previous Button */}
      <button onClick={prev} 
              disabled={currentIndex === 0}
              className="relativew left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-primary-600 hover:text-primary-800 font-bold py-2 px-4 rounded disabled:opacity-50 disabled:text-gray-400">
        <IconCaretLeftFilled
          size={16}
        >
        </IconCaretLeftFilled>
      </button>

      {/* Slider Container */}
      <div className="flex justify-center items-center flex-wrap gap-4 mx-16 max-h-[70vh] rounded-md">
        {visibleItems.map((item) => renderItem(item))}
      </div>

      {/* Next Button */}
      <button onClick={next} 
              disabled={currentIndex + slidesToShow >= items.length}
              className="relativew right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-primary-600 hover:text-primary-800 font-bold py-2 px-4 rounded disabled:opacity-50 disabled:text-gray-400">
        <IconCaretRightFilled
          size={16}
        >
        </IconCaretRightFilled>
      </button>

    </div>
  );
}