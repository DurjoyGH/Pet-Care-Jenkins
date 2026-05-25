import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Phone, PawPrint, Palette, Weight, X } from "lucide-react";

export default function PetCard({ pet }) {
  const images = pet.images || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  const goPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative bg-gray-100">
        <button
          type="button"
          onClick={() => setShowGallery(true)}
          className="block w-full"
          aria-label="Open pet gallery"
        >
          <img
            src={images[activeIndex]}
            alt={`${pet.name} ${activeIndex + 1}`}
            className="w-full h-80 object-cover object-top"
          />
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-sm"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-sm"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2 leading-none">
          <span className="inline-flex items-center gap-1.5 leading-none">
            <PawPrint size={14} /> {pet.petType}
          </span>
          <span>•</span>
          <span className="font-medium text-gray-700">{pet.category}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-1">{pet.name}</h3>
        <p className="text-gray-500 text-sm mb-3">{pet.description}</p>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-4">
          <span className="inline-flex items-center gap-1.5 leading-none">
            <Palette size={14} /> {pet.color}
          </span>
          <span className="inline-flex items-center gap-1.5 leading-none">
            <Weight size={14} /> {pet.weight} kg
          </span>
        </div>

        <div className="text-sm text-gray-500 space-y-1">
          <div className="inline-flex items-center gap-1.5 leading-none">
            <MapPin size={14} /> {pet.district}
          </div>
          <div className="text-gray-400 text-xs">{pet.address}</div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">{pet.ownerName}</p>
            <p className="text-xs text-gray-500">Owner</p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-primary font-semibold leading-none">
            <Phone size={16} /> {pet.phone}
          </div>
        </div>
      </div>

      {showGallery && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="font-semibold text-gray-800">{pet.name} photos</p>
              <button
                type="button"
                onClick={() => setShowGallery(false)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Close gallery"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative bg-gray-100">
              <img
                src={images[activeIndex]}
                alt={`${pet.name} ${activeIndex + 1}`}
                className="w-full max-h-[60vh] object-contain"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-sm"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-sm"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 p-4">
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`border rounded-lg overflow-hidden ${
                    index === activeIndex ? "border-primary" : "border-gray-100"
                  }`}
                >
                  <img src={src} alt={`${pet.name} ${index + 1}`} className="w-full h-16 object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
