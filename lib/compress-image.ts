export const MAX_INPUT_BYTES = 10 * 1024 * 1024;
export const TARGET_MAX_BYTES = 250 * 1024;
export const MAX_EDGE_PX = 1000;
export const JPEG_QUALITY = 0.7;

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this photo."));
    };

    image.src = url;
  });
}

function canvasToJpegBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
  });
}

function drawScaledImage(
  image: HTMLImageElement,
  maxEdge: number,
): HTMLCanvasElement {
  const longEdge = Math.max(image.width, image.height);
  const scale = longEdge > maxEdge ? maxEdge / longEdge : 1;
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not prepare photo for upload.");
  }

  context.drawImage(image, 0, 0, width, height);
  return canvas;
}

export async function compressImageForUpload(file: File): Promise<Blob> {
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error("Photo must be 10 MB or smaller.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose a photo file.");
  }

  const image = await loadImageFromFile(file);
  const canvas = drawScaledImage(image, MAX_EDGE_PX);

  let quality = JPEG_QUALITY;
  let blob = await canvasToJpegBlob(canvas, quality);

  if (!blob) {
    throw new Error("Could not compress this photo.");
  }

  while (blob.size > TARGET_MAX_BYTES && quality > 0.45) {
    quality -= 0.08;
    const nextBlob = await canvasToJpegBlob(canvas, quality);
    if (!nextBlob) {
      break;
    }
    blob = nextBlob;
  }

  if (blob.size > TARGET_MAX_BYTES) {
    throw new Error("Photo is too large after compression. Try a smaller image.");
  }

  return blob;
}
