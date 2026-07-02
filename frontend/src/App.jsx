import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home           from "./pages/Home";
import Login          from "./pages/Login";
import Signup         from "./pages/Signup";
import About          from "./pages/About";
import Contact        from "./pages/Contact";
import Navbar         from "./components/Navbar";
import Footer         from "./components/Footer";
import Plans          from "./pages/Plans";
import Dashboard      from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute     from "./components/AdminRoute";
import CheckoutPage   from "./pages/CheckoutPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword  from "./pages/ResetPassword";
import NotFound       from "./pages/NotFound";

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                    <Routes>
                        <Route path="/"                        element={<Home />} />
                        <Route path="/login"                   element={<Login />} />
                        <Route path="/signup"                  element={<Signup />} />
                        <Route path="/forgot-password"         element={<ForgotPassword />} />
                        <Route path="/reset-password/:token"   element={<ResetPassword />} />
                        <Route path="/about"                   element={<About />} />
                        <Route path="/contact"                 element={<Contact />} />
                        <Route path="/plans"                   element={<Plans />} />
                        <Route path="/checkout/:orderId"       element={<CheckoutPage />} />
                        <Route path="/payment-success/:orderId" element={<PaymentSuccess />} />
                        <Route path="/dashboard" element={
                            <ProtectedRoute><Dashboard /></ProtectedRoute>
                        } />
                        <Route path="/admin" element={
                            <AdminRoute><AdminDashboard /></AdminRoute>
                        } />
                        {/* Catch-all 404 */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;