import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized</h1>
      <p className="mb-4">You are not allowed to access this page.</p>
      <Link to="/" className="bg-blue-700 text-white px-5 py-2 rounded">
        Go Home
      </Link>
    </div>
  );
};

export default Unauthorized;