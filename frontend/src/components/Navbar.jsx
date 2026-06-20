import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
};
  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">

      <div>
        <h1 className="text-3xl font-bold text-green-600">
          MealMitra
        </h1>

        <p className="text-xs text-gray-500">
          Healthy Tiffin Subscription
        </p>
      </div>

      <div className="flex gap-6 text-gray-700">

        <Link to="/" className="hover:text-green-600">
          Home
        </Link>

        <Link to="/plans" className="hover:text-green-600">
          Plans
        </Link>

        <Link to="/about" className="hover:text-green-600">
          About
        </Link>

        <Link to="/contact" className="hover:text-green-600">
          Contact
        </Link>

        {user ? (
          <>
        {user.role === "admin" ? (
            <Link
                to="/admin"
                className="hover:text-green-600"
            >
                Admin
            </Link>
                   ) : (
            <Link
                to="/dashboard"
                className="hover:text-green-600"
            >
                Dashboard
            </Link>
        )}

        <button
            onClick={logout}
            className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition">
            Logout
        </button>
    </>
) : (
    <>
        <Link
            to="/login"
            className="hover:text-green-600"
        >
            Login
        </Link>

        <Link
            to="/signup"
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
            Sign Up
        </Link>
    </>
)}

      </div>

    </nav>
  );
}

export default Navbar;