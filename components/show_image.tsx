import { useState } from 'react';

interface ImageModalProps {
  imgSrc: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ imgSrc }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <button onClick={handleOpen} className="py-2 px-4 bg-blue-500 text-white rounded">Open Image</button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>

          <div className="relative bg-white p-4 rounded shadow-lg">
            <img src={imgSrc} alt="Modal" className="w-full h-full object-cover" />

            <a href={imgSrc} download className="absolute top-2 right-2 bg-green-500 text-white rounded p-2">Download</a>

            <button onClick={handleClose} className="absolute top-2 left-2 bg-red-500 text-white rounded p-2">Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageModal;