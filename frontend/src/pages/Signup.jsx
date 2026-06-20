import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const validateForm = () => {
        const newErrors = {};
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        if (!trimmedName) {
            newErrors.name = "Name is required.";
        } else if (trimmedName.length < 2) {
            newErrors.name = "Name must contain at least 2 characters.";
        } else if (trimmedName.length > 80) {
            newErrors.name = "Name cannot exceed 80 characters.";
        }

        if (!trimmedEmail) {
            newErrors.email = "Email is required.";
        } else if (trimmedEmail.length > 254) {
            newErrors.email = "Email is too long.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            newErrors.email = "Enter a valid email address.";
        }

        if (!password || !password.trim()) {
            newErrors.password = "Password is required.";
        } else if (password.length < 8) {
            newErrors.password =
                "Password must contain at least 8 characters.";
        } else if (password.length > 128) {
            newErrors.password =
                "Password cannot exceed 128 characters.";
        } 
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        if (!validateForm() || isSubmitting) {
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await api.post("/auth/register", {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
            });

            console.log(response.data);
            alert("Registration Successful! Please Login");
            navigate("/login");
            setName("");
            setEmail("");
            setPassword("");
            setErrors({});
        } catch (error) {
            console.error(error);

            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Registration failed. Please try again.";

            setServerError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const clearFieldError = (field) => {
        setErrors((currentErrors) => ({
            ...currentErrors,
            [field]: "",
        }));
        setServerError("");
    };

    return (
        <div className="flex justify-center px-4 py-16">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <h1 className="mb-2 text-center text-3xl font-bold text-green-600">
                    Sign Up
                </h1>

                <p className="mb-6 text-center text-gray-500">
                    Create your MealMitra account
                </p>

                {serverError && (
                    <div
                        role="alert"
                        className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                    >
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <label
                        htmlFor="name"
                        className="mb-1 block text-sm font-medium"
                    >
                        Name
                    </label>

                    <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            clearFieldError("name");
                        }}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={
                            errors.name ? "name-error" : undefined
                        }
                        className="
                          mb-1
                          w-full
                          rounded-lg
                          border
                          border-gray-300
                          p-3
                          focus:outline-none
                          focus:ring-2
                          focus:ring-green-500
                          focus:border-green-500
                          "
                    />

                    <p
                        id="name-error"
                        className="mb-3 min-h-[20px] text-sm text-red-600"
                    >
                        {errors.name}
                    </p>

                    <label
                        htmlFor="email"
                        className="mb-1 block text-sm font-medium"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            clearFieldError("email");
                        }}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                            errors.email ? "email-error" : undefined
                        }
                        className="
                            mb-1
                            w-full
                            rounded-lg
                            border
                            border-gray-300
                            p-3
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-500
                            focus:border-green-500
                            "
                    />

                    <p
                        id="email-error"
                        className="mb-3 min-h-[20px] text-sm text-red-600"
                    >
                        {errors.email}
                    </p>

                    <label
                        htmlFor="password"
                        className="mb-1 block text-sm font-medium"
                    >
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            clearFieldError("password");
                        }}
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={
                            errors.password ? "password-error" : undefined
                        }
                        className="
                              mb-1
                              w-full
                              rounded-lg
                              border
                              border-gray-300
                              p-3
                              focus:outline-none
                              focus:ring-2
                              focus:ring-green-500
                              focus:border-green-500
                              "
                    />

                    <p
                        id="password-error"
                        className="mb-5 min-h-[20px] text-sm text-red-600"
                    >
                        {errors.password}
                    </p>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-green-600 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Creating account..." : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Signup;