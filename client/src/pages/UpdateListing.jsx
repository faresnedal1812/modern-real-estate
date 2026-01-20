import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateListing() {
  const navigate = useNavigate();
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    regularPrice: 50,
    discountPrice: 0,
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    offer: false,
    type: "rent",
  });
  console.log(formData);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };
    fetchListing();
  }, []);

  const handleImageSubmit = () => {
    setUploading(true);
    setImageUploadError(false);
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      // console.log(promises);

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setUploading(false);
          setImageUploadError(false);
        })
        .catch((err) => {
          setUploading(false);
          setImageUploadError(false);
        });
    } else {
      setUploading(false);
      setImageUploadError("You can only upload 6 images per listing");
      return;
    }
  };

  const storeImage = async (file) => {
    const maxSizeInBytes = 4 * 1024 * 1024; // 4MB limit
    if (file.size > maxSizeInBytes) {
      setImageUploadError("File size exceeds the allowed limit of 4MB.");
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Estate-images");
    data.append("cloud_name", "dcdoxdyeu");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dcdoxdyeu/image/upload",
        {
          method: "Post",
          body: data,
        }
      );
      const uploadedImageURL = await res.json();
      // console.log(uploadedImageURL);
      return uploadedImageURL.url;
    } catch (error) {
      setImageUploadError("Error uploading image:", error);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "text" ||
      e.target.type === "number" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setErrorSubmit(false);
    if (formData.regularPrice < formData.discountPrice) {
      return setErrorSubmit(
        "Regular Price must be greater than discount price"
      );
    }
    if (formData.imageUrls.length < 1) {
      return setErrorSubmit("You must upload 6 images per listing at least");
    }
    try {
      setLoadingSubmit(true);
      setErrorSubmit(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoadingSubmit(false);
      if (data.success === false) {
        setLoadingSubmit(false);
        setErrorSubmit(data.message);
        return;
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setErrorSubmit(error.message);
      setLoadingSubmit(false);
    }
  };

  return (
    <main className="my-7 max-w-4xl mx-auto">
      <h1 className="font-semibold text-3xl text-center my-7 text-gray-800">
        Update a Listing
      </h1>
      <form
        onSubmit={handleSubmitForm}
        className="p-3 flex flex-col sm:flex-row gap-6"
      >
        {/* Left hand div*/}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            id="name"
            className="border outline-none p-3 rounded-lg"
            minLength={10}
            maxLength={62}
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            id="description"
            className="border outline-none p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Adderss"
            id="address"
            className="border outline-none p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-6"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <label>Sell</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-6"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <label>Rent</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-6"
                onChange={handleChange}
                checked={formData.parking}
              />
              <label>Parking spot</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-6"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <label>Furnished</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-6"
                onChange={handleChange}
                checked={formData.offer}
              />
              <label>Offer</label>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <label>Beds</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <label>Baths</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min={50}
                max={10000000}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <label className="flex flex-col items-center">
                Regular Price
                {formData.type === "rent" && (
                  <span className="text-xs text-gray-600">($ / month)</span>
                )}
              </label>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min={0}
                  max={10000000}
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <label className="flex flex-col items-center">
                  Discount Price
                  {formData.type === "rent" && (
                    <span className="text-xs text-gray-600">($ / month)</span>
                  )}
                </label>
              </div>
            )}
          </div>
        </div>
        {/* Right hand div */}
        <div className="flex flex-col gap-4 flex-1">
          <div>
            <p className="font-semibold">
              Images:
              <span className="text-gray-600 font-normal ml-2">
                The first image will be the cover (max 6)
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              id="images"
              className="border border-gray-400 p-3 rounded-lg"
              accept="image/*"
              multiple
            />
            <button
              disabled={uploading}
              onClick={handleImageSubmit}
              type="button"
              className="border border-green-700 text-green-700 p-3 uppercase rounded-lg hover:bg-green-700 hover:text-white transition-all cursor-pointer hover:shadow-lg disabled:opacity-65 disabled:bg-green-700 disabled:text-white"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border p-3 rounded-lg mt-2"
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    type="button"
                    className="p-3 text-red-700 uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </p>
          <button
            disabled={loadingSubmit || uploading}
            className="bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-95 disabled:opacity-80"
          >
            {loadingSubmit ? "Updating..." : "Update Listing"}
          </button>
          {errorSubmit && <p className="text-red-700 text-sm">{errorSubmit}</p>}
        </div>
      </form>
    </main>
  );
}
