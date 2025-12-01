export const compressImageForStorage = (file: File, maxSize = 200): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');

        let width = img.width;
        let height = img.height;

        let targetSize = maxSize;

        if (width > 2000 || height > 2000) {
          targetSize = 150;
        } else if (width > 1000 || height > 1000) {
          targetSize = 180;
        }

        if (width > height) {
          if (width > targetSize) {
            height = Math.round((height * targetSize) / width);
            width = targetSize;
          }
        } else {
          if (height > targetSize) {
            width = Math.round((width * targetSize) / height);
            height = targetSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        if (file.type === 'image/png') {
          ctx.clearRect(0, 0, width, height);
        } else {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.8;
        if (targetSize <= 150) {
          quality = 0.85;
        }

        const base64 = canvas.toDataURL(
          file.type === 'image/png' ? 'image/png' : 'image/jpeg',
          quality
        );

        resolve(base64);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};