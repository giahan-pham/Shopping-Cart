import { API_BASE_URL } from "../../api/userApi";

import "./styles/RecordImage.css";

const DEFAULT_RECORD_IMAGE = `${API_BASE_URL}/static/records/stock_default_image.jpg`;

//Handle image url for Record display in shopping page and admin page
function getImageSrc(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") {
    return DEFAULT_RECORD_IMAGE;
  }
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  const browserPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  return `${API_BASE_URL}${browserPath}`;
}

function RecordImage({ imageUrl, alt, className }) {
  return (
    <img
      src={getImageSrc(imageUrl)}
      alt={alt}
      className={className}
      onError={(event) => {
        event.currentTarget.onerror = null; //Prevent loop if default image also fails
        event.currentTarget.src = DEFAULT_RECORD_IMAGE;
      }}
    />
  );
}

export default RecordImage;