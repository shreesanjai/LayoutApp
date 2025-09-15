import { X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface BackgroundPopoverProps {
  onBgImageChange: (bgImage: string | null) => void;
  canvasBgImage: string | null;
}

const BackgroundPopover = ({ onBgImageChange, canvasBgImage }: BackgroundPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [selectedBgLink, setSelectedBgLink] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Energy');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // https://rkaznxeczerlxbno.public.blob.vercel-storage.com/backgrounds/${category[index]}/bpxl_wp00{index}_{}}


  const categories = ["energy", "midnight", "sunset", "radiant", "iridescent", "spring"];

  const currentCategory = categories.find(cat => cat === activeCategory) || categories[0];

  const parseCanvasBgImage = (bgImageLink: string) => {

    const urlParts = bgImageLink.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const categoryName = urlParts[urlParts.length - 2];


    const match = fileName.match(/bpxl_wp00\d+_(\d+)\.webp$/);
    if (match) {
      const imageId = parseInt(match[1], 10);
      return {
        category: categoryName,
        imageId: imageId,
        selectedId: categoryName + imageId
      };
    }
    return null;
  };

  useEffect(() => {
    if (canvasBgImage) {
      const parsed = parseCanvasBgImage(canvasBgImage);
      if (parsed) {
        setActiveCategory(parsed.category);
        setSelectedBackground(parsed.selectedId);
        setSelectedBgLink(canvasBgImage);
      }
    } else {

      setSelectedBackground(null);
      setSelectedBgLink(null);
    }
  }, [canvasBgImage]);

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

    if (isOpen)
      document.addEventListener('mousedown', handleClickOutside);

    return () =>
      document.removeEventListener('mousedown', handleClickOutside);

  }, [isOpen]);

  return (
    <div className="relative inline-block">
      {/* Backgrounds Button */}
      
      {
        selectedBgLink && (<button
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setSelectedBackground(null)
            onBgImageChange(null)
            setSelectedBgLink(null)
          }}
          className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 text-white text-xs items-center justify-center flex"
          title="Remove Background"
        >
          <X size={12} strokeWidth={3} />
        </button>)
      }


      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
      >
        {selectedBgLink ? (
          <div className='relative group flex items-center'>
            <img src={selectedBgLink} alt="Bg" className='w-4 h-4' />
          </div>
        ) : (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>)}

      </button>

      {/* Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-900">Select Background</h3>
            <button
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
              onClick={() => {
                setSelectedBackground(null)
                onBgImageChange(null)
                setSelectedBgLink(null)
              }}>
              Remove
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-200">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeCategory === category
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Background Grid */}
          <div className="p-4">
            <div className="grid grid-cols-4 gap-3 overflow-y-scroll h-64 ">

              {Array.from({ length: 30 }, (_, id) => {

                const imgId = String(id + 1).padStart(2, '0')
                const categoryId = categories.indexOf(currentCategory) + 1
                const imgLink = `https://rkaznxeczerlxbno.public.blob.vercel-storage.com/backgrounds/${currentCategory}/bpxl_wp00${categoryId}_${imgId}.webp`

                return (
                  <div key={id} className="relative group">
                    <button
                      onClick={() => {
                        setSelectedBackground(String(currentCategory + (id + 1)))
                        onBgImageChange(imgLink)
                        setSelectedBgLink(imgLink)
                      }}
                      className={`w-full h-16 rounded-lg overflow-clip border-2 transition-all ${selectedBackground === String(currentCategory + (id + 1))
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}

                    >
                      <img src={imgLink} alt="" />
                      {selectedBackground === String(currentCategory + (id + 1)) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            Select
                          </div>
                        </div>
                      )}
                    </button>
                    <div className="text-center text-xs text-gray-500 mt-1">
                      {(id + 1)}
                    </div>
                  </div>)
              }).map(item => item)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundPopover;