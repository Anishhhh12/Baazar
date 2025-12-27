import { Link } from "react-router-dom";

const Seller = () => {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Seller Portal</h1>
      <p className="text-gray-600 mb-6">
        Start selling your products and grow with MyBaazar 🚀
      </p>
      <div className="flex justify-center gap-4">
        <Link
          to="/seller/onboarding"
          className="bg-yellow-500 px-4 py-2 rounded text-white hover:bg-yellow-600"
        >
          Start Selling
        </Link>
        <Link
          to="/seller/dashboard"
          className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Seller;
