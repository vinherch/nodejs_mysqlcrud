//Checks data types for image upload
module.exports = (fileType) => {
  const fileTypes = [
    "image/apng",
    "image/bmp",
    "image/jpg",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "image/x-icon",
  ];
  return fileTypes.includes(fileType);
};
