export interface Size {
  width: number,
  height: number,
}

export const getImageSize = async (src: string) => new Promise<Size | null>((resolve) => {
  const image = new Image();
  image.onload = () => {
    const { width, height } = image;
    resolve({ width, height });
  };
  image.onerror = () => {
    resolve(null);
  };
  image.src = src;
});
