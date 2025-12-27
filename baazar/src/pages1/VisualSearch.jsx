import { useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const VisualSearch = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResults({});
    setError("");
  };

  const handleSearch = async () => {
    if (!image) {
      setError("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);
      const res = await api.post("/visual-search", formData);
      setResults(res.data.results || {});
    } catch (err) {
      setError("Visual search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Search Products by Image
      </h2>

      {/* Upload Box */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 flex flex-col gap-4 w-full md:w-[420px]">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="text-sm text-gray-700"
        />

        {/* Image Preview */}
        {preview && (
          <div className="mt-2">
            <img
              src={preview}
              alt="preview"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )}

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={loading}
          className="mt-2 bg-blue-600 text-white py-2 px-5 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Searching..." : "Search by Image"}
        </button>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 font-medium">{error}</p>
        )}
      </div>

      {/* Results */}
      {Object.entries(results).map(([type, products]) => (
        <div key={type} className="mt-10">
          <h3 className="text-xl font-semibold text-gray-700 capitalize mb-4">
            Matching {type}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No products found
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VisualSearch;
