import { ChevronDown, Image, X } from 'lucide-react';
import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';

interface BackgroundPopoverProps {
  onBgImageChange: (bgImage: string | null) => void;
  canvasBgImage: string | null;
}

interface BackgroundImageProps {
  imgLink: string;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

interface AccordionSectionProps {
  category: string;
  categoryIndex: number;
  isOpen: boolean;
  onToggle: () => void;
  selectedBackground: string | null;
  onBgImageChange: (bgImage: string | null) => void;
  setSelectedBackground: (bg: string | null) => void;
  setSelectedBgLink: (link: string | null) => void;
}

const BackgroundImage = memo(({ imgLink, isSelected, onClick, index }: BackgroundImageProps) => {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${isSelected
          ? 'border-blue-500 ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-500'
          }`}
      >
        <img
          src={imgLink}
          alt=""
          width={64}
          height={64}
          className='object-cover w-16 h-16 transition-transform duration-200 hover:scale-105'
          loading='lazy'
          decoding='async'
        />
        {isSelected && (
          <div className="w-16 h-16 absolute inset-0 flex items-end pb-2 justify-center transition-opacity duration-200">
            <div className="bg-black bg-opacity-50 text-white text-[10px] px-2 py-0 rounded">
              Selected
            </div>
          </div>
        )}
      </button>
      <div className="w-16 text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
        {index}
      </div>
    </div>
  );
});

const AccordionSection = memo(({ category, categoryIndex, isOpen, onToggle, selectedBackground, onBgImageChange, setSelectedBackground, setSelectedBgLink }: AccordionSectionProps) => {
  const images = useMemo(() => {
    return Array.from({ length: 10 }, (_, id) => {
      const imgId = String(id + 1).padStart(2, '0');
      const categoryId = categoryIndex + 1;
      const reducedImgLink = `https://fmk90doytst8hxsi.public.blob.vercel-storage.com/${category}/thumbnail/pic-0${categoryId}_0${imgId}.webp`;
      const imgLink = `https://fmk90doytst8hxsi.public.blob.vercel-storage.com/${category}/pic-0${categoryId}_0${imgId}.webp`;

      const backgroundId = category + (id + 1);

      return {
        id,
        imgLink,
        reducedImgLink,
        backgroundId,
      };
    });
  }, [category, categoryIndex]);

  const handleImageClick = useCallback((imgLink: string, backgroundId: string) => {
    setSelectedBackground(backgroundId);
    onBgImageChange(imgLink);
    setSelectedBgLink(imgLink);
  }, [setSelectedBackground, onBgImageChange, setSelectedBgLink]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-lg transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500">
      <button
        onClick={onToggle}
        className={`w-full flex justify-between items-center py-4 px-5 font-medium text-left text-sm transition-all duration-300 ease-in-out group ${isOpen
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 border-b border-blue-100 dark:border-blue-800/50"
          : "text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600"
          }`}
      >
        <div className="flex items-center space-x-3">
          <span className="font-medium transition-colors duration-200">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
        </div>
        <div
          className={`p-1 rounded-full transition-all duration-300 ease-in-out ${isOpen
            ? "bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-400"
            : "text-gray-400 dark:text-gray-500 group-hover:bg-gray-100 dark:group-hover:bg-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400"
            }`}
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : "rotate-0"
              }`}
          />
        </div>
      </button>

      {/* Fixed: Use max-height instead of conditional rendering for smooth transitions */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <div className="px-5 pb-5 pt-2 text-sm text-gray-700 dark:text-gray-300 bg-gradient-to-b from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50">
          <div className="p-4">
            <div className="grid grid-cols-3 gap-3 overflow-y-auto hide-scrollbar max-h-64 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {images.map((image) => (
                <BackgroundImage
                  key={image.backgroundId}
                  imgLink={image.reducedImgLink}
                  isSelected={selectedBackground === image.backgroundId}
                  onClick={() => handleImageClick(image.imgLink, image.backgroundId)}
                  index={image.id + 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const BackgroundPopover = ({ onBgImageChange, canvasBgImage }: BackgroundPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [selectedBgLink, setSelectedBgLink] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => ["radiant", "pastel", "sunset", "midnight", "calm", "energy"], []);

  const parseCanvasBgImage = useCallback((bgImageLink: string) => {
    const urlParts = bgImageLink.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const categoryName = urlParts[urlParts.length - 2];

    const match = fileName.match(/pic-0\d+_(\d+)\.webp$/);
    if (match) {
      const imageId = parseInt(match[1], 10);
      return {
        category: categoryName,
        imageId: imageId,
        selectedId: categoryName + imageId
      };
    }
    return null;
  }, []);

  useEffect(() => {
    if (canvasBgImage) {
      const parsed = parseCanvasBgImage(canvasBgImage);
      if (parsed) {
        setSelectedBackground(parsed.selectedId);
        setSelectedBgLink(canvasBgImage);
      }
    } else {
      setSelectedBackground(null);
      setSelectedBgLink(null);
    }
  }, [canvasBgImage, parseCanvasBgImage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex(prevIndex => prevIndex === index ? null : index);
  }, []);

  const handleRemoveBackground = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedBackground(null);
    onBgImageChange(null);
    setSelectedBgLink(null);
  }, [onBgImageChange]);

  const handleTogglePopover = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  }, []);

  return (
    <div className="relative">
      {selectedBgLink && (
        <button
          onClick={handleRemoveBackground}
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm z-10"
          title="Remove Background"
        >
          <X size={8} strokeWidth={3} />
        </button>
      )}

      {/* Main Button */}
      <button
        ref={buttonRef}
        onClick={handleTogglePopover}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isOpen
          ? 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-900/70 ring-2 ring-blue-300 dark:ring-blue-700'
          : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-700'
          }`}
      >
        {selectedBgLink ? (
          <div className='relative group flex items-center'>
            <img
              src={selectedBgLink}
              alt="Background"
              className='w-4 h-4 rounded transition-transform duration-200 group-hover:scale-110'
            />
          </div>
        ) : (
          <Image className='h-4 w-4 dark:text-gray-100 transition-colors duration-200' />
        )}
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className={`fixed top-0 right-0 h-full w-[360px] overflow-hidden dark:bg-gray-900 bg-white rounded-lg shadow-xl border dark:text-white border-gray-200 dark:border-gray-700 z-50 animate-in slide-in-from-right duration-300`}
          style={{animation: 'slideInRight 0.3s ease-out'}}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-gray-200">Select Background</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 group"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-200" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-3 p-4">
              {categories.map((category, index) => (
                <AccordionSection
                  key={category}
                  category={category}
                  categoryIndex={index}
                  isOpen={openIndex === index}
                  onToggle={() => handleToggle(index)}
                  selectedBackground={selectedBackground}
                  onBgImageChange={onBgImageChange}
                  setSelectedBackground={setSelectedBackground}
                  setSelectedBgLink={setSelectedBgLink}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundPopover;