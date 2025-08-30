"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/global/Input";
import { Button } from "@/components/global/Button";
import { motion } from "motion/react";
import Toast from "@/components/global/Toast";
import supabase from '@/config/supabaseClient';

const Login = () => {

    const [isSignup, setSignup] = useState(false);
    const [toast, setToast] = useState(null); // Toast should be null initially, not false
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSignUpClick = () => setSignup(true);
    const handleSignInClick = () => setSignup(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            // if (error) console.log(error);
            if (user) {
                window.location.href = '/'; // Redirect to home page
            }
        };
        
        checkAuthStatus();
    }, []);


    const signUpNewUser = async (email, password, name) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: 'http://localhost:3000/',
                    data: {
                        display_name: name,
                        department: "Unassigned", // Default value, update later
                        role: "Member", // Default role
                        image: null, // No image by default
                        status: "Active", // Default status
                        join_date: new Date().toISOString(), // Set join date to now
                    },
                },
            });

            if (error) {
                throw error; // Re-throw the Supabase error
            }

            return data;
        } catch (err) {
            throw err;
        }
    };

    const signInWithEmail = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error; // Re-throw the Supabase error
            }

        } catch (err) {
            // console.error("Signin error:", err);
            setError(err.message); //Set local error
            throw err;
        }
    };

    // const resetPassword = async (email) => {
    //     try {
    //         const { error } = await supabase.auth.resetPasswordForEmail(email, {
    //             redirectTo: 'http://localhost:3000/update-password', // Corrected redirectTo and added protocol
    //         });

    //         if (error) {
    //             throw error;
    //         }

    //         setToast({ "message": "Check your email for the password reset link", "type": "success" }); //Show toast message
    //     }
    //     catch (err) {
    //         // console.error("Reset password error", err);
    //         setToast({ "message": err.message, "type": "error" });
    //     }

    //     setTimeout(() => {
    //         setToast(null);
    //     }, 1500);
    // };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!email || !password || !name) {
            setToast({ message: "Please fill in all fields", type: "error" });
            setLoading(false);
            return; // Important: Exit the function if validation fails
        }

        try {
            await signUpNewUser(email, password, name);
            setToast({ message: "Account created successfully! Check your email to verify.", type: "success" }); // More accurate message
        } catch (err) {
            setToast({ message: err.message, type: "error" });
        } finally {
            setLoading(false);
            setTimeout(() => {
                setToast(null);
            }, 1500); //Keep toast for longer
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!email || !password) {
            setToast({ message: "Please fill in all fields", type: "error" });
            setLoading(false);
            return; // Exit if validation fails
        }

        try {
            await signInWithEmail(email, password);
            setToast({ message: "Login Successful!", type: "success" });

            // You might want to redirect the user to another page after successful login
            window.location.href = '/';  // Example redirect
        } catch (err) {
            // console.error("Login error:", err.message);
            setToast({ message: "Invalid login credentials.", type: "error" });
        } finally {
            setLoading(false);
            setTimeout(() => {
                setToast(null);
            }, 1500);
        }
    };

    return (
        <div className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-primary-dark">
            {/* TOP Holder */}
            {
                toast && <Toast message={toast.message} variant={toast.type} />
            }
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`Holder relative bg-white rounded-lg overflow-hidden shadow-lg w-screen sm:w-[45rem] lg:w-[65rem] md:h-[35rem] h-screen sm:h-[40rem] transition-transform duration-700 ${isSignup ? "right-panel-active" : ""}`}
            >
                {/* Login Form */}
                <motion.div className="w-[50%] z-20 flex flex-col justify-center items-center h-full">
                    <motion.div
                        className="relative"
                        initial={{ x: "100%" }}
                        animate={{ x: isSignup ? "100%" : "0%", opacity: isSignup ? 0 : 1, zIndex: isSignup ? 0 : 10 }}
                        transition={{
                            x: { duration: 0.5, ease: "easeInOut" },
                            opacity: { duration: 0.0001, ease: "easeInOut", delay: 0.25 },
                            zIndex: { duration: 0.0001, ease: "easeInOut", delay: 0.25 },
                        }}
                    >
                        <form className="px-4 md:px-8 flex flex-col items-center gap-4 h-full bg-white">
                            <h1 className="text-3xl sm:text-5xl font-bold text-center mb-8 text-secondary-500">Login</h1>
                            <Input
                                type="email"
                                placeholder="Email"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 placeholder:text-gray-400"
                                visible={isSignup ? "none" : ""}
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 placeholder:text-gray-400"
                                visible={isSignup ? "none" : ""}
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                            <Button
                                text="Login"
                                color1="#1B3764"
                                color2="#0E2A4D"
                                visible={isSignup ? "none" : ""}
                                className={'lg:px-12 px-8'}
                                onClick={handleLogin}
                            />
                        </form>
                    </motion.div>
                </motion.div>

                {/* Sign Up Form */}
                <motion.div
                    className={`w-[50%] top-0 h-full absolute ${isSignup ? "z-10" : ""}`}
                    initial={{ x: "0%", opacity: 0 }}
                    animate={{ x: isSignup ? "100%" : "0%", opacity: isSignup ? 1 : 0 }}
                    transition={{
                        x: { duration: 0.5, ease: "easeInOut" },
                        opacity: { duration: 0.0001, ease: "easeInOut", delay: 0.25 },
                        zIndex: { duration: 0.0001, ease: "easeInOut", delay: 0.25 },
                    }}
                >
                    <motion.div className=" z-20 flex flex-col justify-center items-center h-full">
                        <form className="px-4 md:px-8 flex flex-col items-center justify-center h-min gap-4 bg-white">

                            <h1 className="text-3xl sm:text-5xl m-8 font-bold text-center text-nowrap text-secondary-500">Sign Up</h1>
                            <div className="flex gap-4 flex-wrap sm:flex-nowrap">
                                <Input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 placeholder:text-gray-400"
                                    visible={isSignup ? "" : "none"}
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                />
                            </div>
                            <Input
                                type="email"
                                placeholder="Email"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 placeholder:text-gray-400"
                                visible={isSignup ? "" : "none"}
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 placeholder:text-gray-400"
                                visible={isSignup ? "" : "none"}
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                            <Button
                                text={loading ? "Loading..." : "Sign up"}
                                color1="#1B3764"
                                color2="#0E2A4D"
                                className={'lg:px-12 px-8'}
                                visible={isSignup ? "" : "none"}
                                onClick={handleSignUp}
                            />
                        </form>
                    </motion.div>
                </motion.div>

                {/* Overlay Holder */}
                <motion.div
                    className="w-[50%] absolute inset-0 z-50 overflow-hidden left-[50%]"
                    initial={{ x: "50%" }}
                    animate={{ x: isSignup ? "-100%" : "0%" }}
                    transition={{ duration: 0.5 }}>

                    <motion.div
                        className="z-40 bg-fixed -left-[100%] absolute w-[200%] h-full bg-gradient-to-br from-secondary-400 to-secondary-600 text-white flex flex-col items-center justify-center p-8"
                        initial={{ x: "0%" }}
                        animate={{ x: isSignup ? "50%" : "0%" }}
                        transition={{ duration: 0.5 }}>

                        <motion.div
                            className="z-30 absolute w-[50%] left-0 h-full text-black flex flex-col items-center justify-center p-8"
                            initial={{ x: "0%" }}
                            animate={{ x: isSignup ? "0%" : "-20%" }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-xl sm:text-5xl font-bold text-white mt-8">Welcome</h1>
                            <p className="text-center mb-8 mt-2 text-white">Join our community today!</p>
                            <Button
                                text={loading ? "Loading..." : "Login"}
                                onClick={isSignup ? handleSignInClick : handleSignUpClick}
                                className={'lg:px-12 px-8'}
                            />
                        </motion.div>

                        <motion.div
                            className="overlay-right z-30 absolute w-[50%] right-0 h-full text-black flex flex-col items-center justify-center p-8"
                            initial={{ x: "0%" }}
                            animate={{ x: isSignup ? "20%" : "0%" }}
                            transition={{ duration: 0.5 }}>
                            <h1 className="text-xl text-nowrap sm:text-4xl md:text-5xl font-bold md text-white mt-8">Welcome Back</h1>
                            <p className="text-center mb-8 mt-2 text-white">Great to have you again!</p>
                            <Button
                                text={"Sign Up"}
                                onClick={isSignup ? handleSignInClick : handleSignUpClick}
                                className={'lg:px-12 px-8'}
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;