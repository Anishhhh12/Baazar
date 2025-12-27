import React, { useState } from "react";
import axios from "axios";

const SellerOnboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    pan: "",
    gstin: "",
    entityType: "",
    aadhaar: null,
    addressProof: null,
    bankAccount: "",
    ifsc: "",
    cheque: null,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Generate Seller ID locally (kept same)
  const generateSellerId = () => {
    const d = new Date();
    const rand = Math.floor(Math.random() * 9000) + 1000;
    return `BAZ-${d.getFullYear().toString().slice(2)}${String(
      d.getMonth() + 1
    ).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${rand}`;
  };

  // Submit data to backend
  const handleSubmit = async () => {
    const sellerId = generateSellerId();

    try {
      // Prepare formData for file upload
      const uploadData = new FormData();
      Object.keys(formData).forEach((key) => {
        uploadData.append(key, formData[key]);
      });
      uploadData.append("sellerId", sellerId);

      await axios.post(
        "http://localhost:5000/api/sellers/register",
        uploadData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(`🎉 Seller Registered Successfully!\nYour Seller ID: ${sellerId}`);
    } catch (error) {
      console.error("Onboarding failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  // Stepper Navigation
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Seller Onboarding Wizard
      </h1>

      {step === 1 && (
        <>
          <h2 className="text-lg font-semibold mb-2">1. Account Setup</h2>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />
          <button
            onClick={nextStep}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Next →
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-lg font-semibold mb-2">2. Business Details</h2>
          <input
            type="text"
            name="businessName"
            placeholder="Business/Shop Name"
            value={formData.businessName}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            type="text"
            name="pan"
            placeholder="PAN Number"
            value={formData.pan}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            type="text"
            name="gstin"
            placeholder="GSTIN (Optional)"
            value={formData.gstin}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />
          <select
            name="entityType"
            value={formData.entityType}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          >
            <option value="">Select Entity Type</option>
            <option value="proprietor">Proprietor</option>
            <option value="company">Company</option>
            <option value="llp">LLP</option>
          </select>
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              ← Back
            </button>
            <button
              onClick={nextStep}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Next →
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-lg font-semibold mb-2">3. Upload KYC Documents</h2>
          <label>Aadhaar</label>
          <input type="file" name="aadhaar" onChange={handleChange} className="mb-2" />
          <label>Address Proof</label>
          <input type="file" name="addressProof" onChange={handleChange} className="mb-2" />
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              ← Back
            </button>
            <button
              onClick={nextStep}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Next →
            </button>
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <h2 className="text-lg font-semibold mb-2">4. Bank Details</h2>
          <input
            type="text"
            name="bankAccount"
            placeholder="Bank Account Number"
            value={formData.bankAccount}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            type="text"
            name="ifsc"
            placeholder="IFSC Code"
            value={formData.ifsc}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          />
          <label>Upload Cancelled Cheque</label>
          <input type="file" name="cheque" onChange={handleChange} className="mb-2" />
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              ← Back
            </button>
            <button
              onClick={nextStep}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Next →
            </button>
          </div>
        </>
      )}

      {step === 5 && (
        <>
          <h2 className="text-lg font-semibold mb-2">5. Review & Submit</h2>
          <pre className="bg-gray-100 p-3 rounded mb-3 text-sm">
            {JSON.stringify(formData, null, 2)}
          </pre>
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              ✅ Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SellerOnboarding;
