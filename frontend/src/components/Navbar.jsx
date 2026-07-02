import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/mealmitra-logo.png";
import { useTheme } from "../context/useTheme";

function SunIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
        >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M4.93 4.93l1.41 1.41" />
            <path d="M17.66 17.66l1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="M4.93 19.07l1.41-1.41" />
            <path d="M17.66 6.34l1.41-1.41" />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
        </svg>
    );
}

function MenuIcon({ open }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
            strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            {open ? (
                <>
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                </>
            ) : (
                <>
                    <path d="M4 7h16" />
                    <path d="M4 12h16" />
                    <path d="M4 17h16" />
                </>
            )}
        </svg>
    );
}

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === "admin";
    const { dark, toggle } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        console.log(
            "%cMEALMITRA SYNC TEST\n%cTiffin synchronization: 100%%\nA.T. Field not detected. All systems nominal.",
            "color:#173f3b;font-weight:bold;font-family:monospace;font-size:13px;",
            "color:#6b9080;font-family:monospace;font-size:12px;"
        );
    }, []);

const setMenuOpenRef = useRef(setMenuOpen);
useEffect(() => {
    setMenuOpenRef.current(false);
}, [location.pathname]);

    // Lock body scroll while mobile menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setMenuOpen(false);
        navigate("/login");
    };

    const linkClass = "transition hover:text-[#173f3b] dark:hover:text-emerald-300";

    const guestLinks = (
        <>
            <Link to="/" onClick={() => setMenuOpen(false)} className={linkClass}>Home</Link>
            <Link to="/plans" onClick={() => setMenuOpen(false)} className={linkClass}>Plans</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)} className={linkClass}>About</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)} className={linkClass}>Contact</Link>
        </>
    );

    const themeButton = (
        <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-900/15 text-slate-500 transition hover:bg-emerald-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
        >
            {dark ? <SunIcon /> : <MoonIcon />}
        </button>
    );

    const logoutButton = (
        <button
            onClick={logout}
            className="rounded-xl border border-emerald-900/15 px-4 py-2 font-semibold text-[#173f3b] transition hover:bg-emerald-50 dark:border-white/10 dark:text-emerald-300 dark:hover:bg-white/10"
        >
            Logout
        </button>
    );

    return (
        <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-white/95 backdrop-blur dark:bg-[#0f1a18]/95 dark:border-white/10">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">

                <Link
                    to={isAdmin ? "/admin" : "/"}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5"
                >
                    <img src={logo} alt="MealMitra" className="h-9 w-9" />
                    <div>
                        <h1 className="text-lg font-semibold leading-tight tracking-tight text-[#173f3b] dark:text-emerald-300">
                            MealMitra
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {isAdmin ? "Admin Panel" : "Healthy Tiffin Subscription"}
                        </p>
                    </div>
                </Link>

                {/* Desktop nav */}
                <div className="hidden items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
                    {isAdmin ? (
                        <>
                            <Link to="/admin" className={linkClass}>Dashboard</Link>
                            {themeButton}
                            {logoutButton}
                        </>
                    ) : (
                        <>
                            {guestLinks}
                            {user ? (
                                <>
                                    <Link to="/dashboard" className={linkClass}>Dashboard</Link>
                                    {themeButton}
                                    {logoutButton}
                                </>
                            ) : (
                                <>
                                    {themeButton}
                                    <Link to="/login" className={linkClass}>Login</Link>
                                    <Link
                                        to="/signup"
                                        className="rounded-xl bg-[#173f3b] px-5 py-2.5 font-semibold text-white transition hover:bg-[#0f2d2a]"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </div>

                {/* Mobile: theme toggle + hamburger */}
                <div className="flex items-center gap-2 md:hidden">
                    {themeButton}
                    <button
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-900/15 text-[#173f3b] transition hover:bg-emerald-50 dark:border-white/10 dark:text-emerald-300 dark:hover:bg-white/10"
                    >
                        <MenuIcon open={menuOpen} />
                    </button>
                </div>
            </nav>

            {/* Mobile drawer */}
            {menuOpen && (
                <div className="border-t border-emerald-900/10 bg-white px-5 py-4 dark:border-white/10 dark:bg-[#0f1a18] md:hidden">
                    <div className="flex flex-col gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                        {isAdmin ? (
                            <>
                                <Link to="/admin" onClick={() => setMenuOpen(false)} className={linkClass}>Dashboard</Link>
                                {logoutButton}
                            </>
                        ) : (
                            <>
                                {guestLinks}
                                {user ? (
                                    <>
                                        <Link to="/dashboard" onClick={() => setMenuOpen(false)} className={linkClass}>Dashboard</Link>
                                        {logoutButton}
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setMenuOpen(false)} className={linkClass}>Login</Link>
                                        <Link
                                            to="/signup"
                                            onClick={() => setMenuOpen(false)}
                                            className="rounded-xl bg-[#173f3b] px-5 py-2.5 text-center font-semibold text-white transition hover:bg-[#0f2d2a]"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;