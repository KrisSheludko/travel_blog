import React, { useRef, useState, useCallback, useEffect } from 'react';
import './ImageCropper.scss';

const ImageCropper = ({ image, onCrop, onCancel }) => {
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const [isCropping, setIsCropping] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleCrop = async () => {
    if (!imageRef.current || !containerRef.current) return;

    setIsCropping(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      await new Promise((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
        }
      });

      canvas.width = 240;
      canvas.height = 240;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 240, 240);

      const minDimension = Math.min(img.naturalWidth, img.naturalHeight);
      const sourceX = (img.naturalWidth - minDimension) / 2;
      const sourceY = (img.naturalHeight - minDimension) / 2;

      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        minDimension,
        minDimension,
        0,
        0,
        240,
        240
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], 'avatar.jpg', {
            type: 'image/jpeg',
          });
          onCrop(croppedFile);
        }
        setIsCropping(false);
      }, 'image/jpeg', 0.9);

    } catch (error) {
      console.error('Error cropping image:', error);
      setIsCropping(false);
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="cropper-modal-overlay">
      <div className="cropper-modal">
        <div className="cropper-header">
          <h3>Обрезка фото</h3>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>

        <div className="cropper-preview">
          <div className="preview-container" ref={containerRef}>
            <img
              ref={imageRef}
              src={image}
              alt="Для обрезки"
              className="preview-image"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
              }}
              onMouseDown={handleMouseDown}
            />
            <div className="crop-guide"></div>
          </div>

          <div className="zoom-controls">
            <button type="button" onClick={handleZoomOut} className="zoom-button">
              -
            </button>
            <button type="button" onClick={handleZoomIn} className="zoom-button">
              +
            </button>
          </div>
        </div>

        <div className="cropper-controls">
          <button
            type="button"
            onClick={onCancel}
            className="submit-button secondary"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleCrop}
            className="submit-button"
            disabled={isCropping}
          >
            {isCropping ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;