import { useState } from 'react';

// Curated collection of calming nature images
const images = [
  {
    src: '/images/nature/mountain-lake.jpg',
    alt: 'Serene mountain lake surrounded by pine forests and snow-capped peaks'
  },
  {
    src: '/images/nature/sunlit-forest.jpg',
    alt: 'Sunlight streaming through a lush green forest canopy'
  },
  {
    src: '/images/nature/foggy-mountains.jpg',
    alt: 'Misty mountain ridges stretching into the distance'
  },
  {
    src: '/images/nature/forest-path.jpg',
    alt: 'A winding path through a verdant forest'
  },
  {
    src: '/images/nature/meadow-flowers.jpg',
    alt: 'Colorful wildflowers in a sunny meadow'
  },
  {
    src: '/images/nature/mountain-sunset.jpg',
    alt: 'Majestic mountain peaks bathed in golden sunset light'
  },
  {
    src: '/images/nature/forest-fog.jpg',
    alt: 'Mystical forest shrouded in morning fog'
  },
  {
    src: '/images/nature/alpine-lake.jpg',
    alt: 'Crystal clear alpine lake reflecting mountain peaks'
  }
];

export default function NatureGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Nature Gallery</h2>
      <div className="space-y-4">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-100">
          {/* Current Image */}
          <div className="relative h-full w-full">
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            />
          </div>

          {/* Navigation Buttons */}
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <button
              onClick={previousImage}
              className="rounded-full bg-black/30 p-2 text-white hover:bg-black/50 transition-colors backdrop-blur-sm"
              aria-label="Previous image"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="rounded-full bg-black/30 p-2 text-white hover:bg-black/50 transition-colors backdrop-blur-sm"
              aria-label="Next image"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Image Navigation Dots */}
        <div className="flex justify-center space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-blue-600 w-4' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 