import { useEffect, useRef, useState } from "react";

import { API_BASE_URL } from "../../api/userApi";

import "./styles/RecordForm.css";

const DEFAULT_RECORD_IMAGE = `${API_BASE_URL}/static/records/stock_default_image.jpg`;

const emptyFormData = {
  title: "",
  artist: "",
  genre: "",
  price: "",
  stock: "",
  release_year: "",
  description: "",
};

//initial form for add and edit (pre-populate data for edit)
function getInitialFormData(record) {
  if (!record) {
    return emptyFormData;
  }

  return {
    title: record.title || "",
    artist: record.artist || "",
    genre: record.genre || "",
    price: record.price ?? "",
    stock: record.stock ?? "",
    release_year: record.release_year ?? "",
    description: record.description || "",
  };
}

//Handle image url for Record form image preview
function getExistingImagePreview(record) {
  const imageUrl = record?.image_url;

  if (!imageUrl || typeof imageUrl !== "string") {
    return "";
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  const browserPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;

  return `${API_BASE_URL}${browserPath}`;
}

function RecordForm({
  mode = "add",
  initialRecord = null,
  onSubmit,
  onCancel,
  isSubmitting,
}) {

  // states to clear the file input after choosing/removing an image
  const fileInputRef = useRef(null);

  //Keep track of the temporary preview image to clean up later
  const blobPreviewRef = useRef("");

  const [formData, setFormData] = useState(getInitialFormData(initialRecord));

  const [imageFile, setImageFile] = useState(null);
  const [useDefaultImage, setUseDefaultImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    getExistingImagePreview(initialRecord)
  );

  const isEditMode = mode === "edit";

  //Reset form when switch between adding and editing a record
  useEffect(() => {
    if (blobPreviewRef.current) {
      URL.revokeObjectURL(blobPreviewRef.current);
      blobPreviewRef.current = "";
    }

    setFormData(getInitialFormData(initialRecord));
    setImageFile(null);
    setUseDefaultImage(false);
    setImagePreview(getExistingImagePreview(initialRecord));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [initialRecord, mode]);

  useEffect(() => {
    return () => {
      if (blobPreviewRef.current) {
        URL.revokeObjectURL(blobPreviewRef.current);
      }
    };
  }, []);

  //Update form data when user types in the input fields
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  // Show a preview of the selected image before it is uploaded.
  function handleImageChange(event) {
    const file = event.target.files[0];
    // If user cancels file picker, keep the current image.
    if (!file) {
      return;
    }

    // Remove the old preview URL before creating a new one
    if (blobPreviewRef.current) {
      URL.revokeObjectURL(blobPreviewRef.current);
      blobPreviewRef.current = "";
    }
    const nextBlobPreview = URL.createObjectURL(file);
    blobPreviewRef.current = nextBlobPreview;

    setImageFile(file);
    setUseDefaultImage(false);
    setImagePreview(nextBlobPreview);
  }

  // Remove the selected image and go back to the default image
  function handleUseDefaultImage() {
    if (blobPreviewRef.current) {
      URL.revokeObjectURL(blobPreviewRef.current);
      blobPreviewRef.current = "";
    }

    setImageFile(null);
    if (isEditMode) {
      setUseDefaultImage(true);
      setImagePreview(DEFAULT_RECORD_IMAGE);
    } else {
      setUseDefaultImage(false);
      setImagePreview("");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // Send the form data, selected image, and default image choice to the parent
  async function handleSubmit(event) {
    event.preventDefault();

    await onSubmit({
      ...formData,
      imageFile,
      useDefaultImage,
    });
  }

  return (
    <form className="record-form" onSubmit={handleSubmit}>
      <div className="record-form-layout">
        <div className="record-form-main">
          <label className="record-form-field">
            <span className="record-form-label">Title</span>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>

          <label className="record-form-field">
            <span className="record-form-label">Artist</span>
            <input
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              required
            />
          </label>

          <label className="record-form-field">
            <span className="record-form-label">Genre</span>
            <input
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
            />
          </label>

          <div className="record-form-row-two">
            <label className="record-form-field">
              <span className="record-form-label">Price</span>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </label>

            <label className="record-form-field">
              <span className="record-form-label">Stock Quantity</span>
              <input
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label className="record-form-field record-form-release-year">
            <span className="record-form-label">Release Year</span>
            <input
              name="release_year"
              type="number"
              min="1900"
              max="2100"
              value={formData.release_year}
              onChange={handleChange}
              required
            />
          </label>

          <label className="record-form-field">
            <span className="record-form-label">Description</span>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            />
          </label>
        </div>

        <aside className="record-form-image-panel" aria-label="Image panel">
          <p className="record-form-image-label">Image</p>

          <div className="image-preview-wrapper">
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Selected record cover preview"
                  className="image-preview"
                  onError={(event) => {
                    if (imagePreview.startsWith("blob:")) {
                      return;
                    }

                    event.currentTarget.onerror = null;
                    event.currentTarget.src = DEFAULT_RECORD_IMAGE;
                  }}
                />

                {(isEditMode || imageFile) && (
                  <button
                    type="button"
                    className="record-form-image-clear"
                    onClick={handleUseDefaultImage}
                    aria-label={
                      isEditMode
                        ? "Use stock default image"
                        : "Remove selected image"
                    }
                  >
                    ×
                  </button>
                )}
              </>
            ) : (
              <div className="image-preview image-preview-placeholder">No image selected</div>
            )}
          </div>

          <div className="record-form-image-actions">
            <input
              ref={fileInputRef}
              id="record-image-input"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="record-form-file-input"
            />

            <label htmlFor="record-image-input" className="record-form-file-label">
              Choose Image
            </label>

            <span className="record-form-file-hint">.JPG, .PNG up to 5MB</span>
          </div>
        </aside>
      </div>

      <div className="form-actions">
        <button type="button" className="secondary-button" onClick={onCancel}>
          Cancel
        </button>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditMode
              ? "Saving..."
              : "Adding..."
            : isEditMode
              ? "Save Changes"
              : "Add Record"}
        </button>
      </div>
    </form>
  );
}

export default RecordForm;