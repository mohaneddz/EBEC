"use client";

import React, { useState } from "react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { motion } from "motion/react";
import supabase from '@/config/supabaseClient';

const Login = () => {
    const [isSignup, setSignup] = useState(false);

    const handleSignUpClick = () => setSignup(true);
    const handleSignInClick = () => setSignup(false);

    async function signUpNewUser(email, password) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // emailRedirectTo: 'https://example.com/welcome',
            },
        })
    }

    async function signInWithEmail(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
    }

    async function resetPassword(email) {
        await supabase.auth.resetPasswordForEmail(email, {
            // redirectTo: 'http://example.com/account/update-password',
        })

    }


    return (
        <div className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-primary-dark">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`container relative bg-white rounded-lg overflow-hidden shadow-lg w-[100%] md:w-[60rem] h-[35rem] sm:h-[40rem] transition-transform duration-700 ${isSignup ? "right-panel-active" : ""}`}
            >
                {/* Login Form */}
                <motion.div
                    className="w-[50%] top-0 absolute z-20"
                    initial={{ x: "100%" }}
                    animate={{ x: isSignup ? "100%" : "0%", opacity: isSignup ? 0 : 1, zIndex: isSignup ? 0 : 10 }}
                    transition={{
                        x: { duration: 0.5, ease: "easeInOut" },
                        opacity: { duration: 0.0001, ease: "easeInOut", delay: 0.25 },
                        zIndex: { duration: 0.0001, ease: "easeInOut", delay: 0.25 },
                    }}
                >
                    <form className="px-4 md:px-8 py-8 flex flex-col items-center gap-4 h-full bg-white">
                        <h1 className="text-3xl sm:text-5xl font-bold text-center m-8 text-secondary-500">Login</h1>
                        <Input
                            type="email"
                            placeholder="Email"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 placeholder:text-gray-400"
                            visible={isSignup ? "none" : ""}
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 placeholder:text-gray-400"
                            visible={isSignup ? "none" : ""}
                        />
                        <Button
                            text="Login"
                            color1="#FFC208"
                            color2="#FDA916"
                            visible={isSignup ? "none" : ""}
                        />
                    </form>
                </motion.div>

                {/* Sign Up Form */}
                <motion.div
                    className={`w-[50%] top-0 absolute ${isSignup ? "z-10" : ""}`}
                    initial={{ x: "0%", opacity: 0 }}
                    animate={{ x: isSignup ? "100%" : "0%", opacity: isSignup ? 1 : 0 }}
                    transition={{
                        x: { duration: 0.5, ease: "easeInOut" },
                        opacity: { duration: 0.0001, ease: "easeInOut", delay: 0.25 },
                        zIndex: { duration: 0.0001, ease: "easeInOut", delay: 0.25 },
                    }}
                >
                    <form className="px-4 md:px-8 py-8 flex flex-col items-center justify-around h-full gap-4 bg-white">
                        <h1 className="text-3xl sm:text-5xl m-8 font-bold text-center text-nowrap text-secondary-500">Sign Up</h1>
                        <div className="flex gap-4 flex-wrap sm:flex-nowrap">
                            <Input
                                type="text"
                                placeholder="First Name"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 placeholder:text-gray-400"
                                visible={isSignup ? "" : "none"}
                                />
                            <Input
                                type="text"
                                placeholder="Last Name"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 placeholder:text-gray-400"
                                visible={isSignup ? "" : "none"}
                                />
                        </div>
                        <Input
                            type="email"
                            placeholder="Email"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 placeholder:text-gray-400"
                            visible={isSignup ? "" : "none"}
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 placeholder:text-gray-400"
                            visible={isSignup ? "" : "none"}
                        />
                        <Button
                            text="Register"
                            color1="#FFC208"
                            color2="#FDA916"
                            visible={isSignup ? "" : "none"}
                        />
                    </form>
                </motion.div>

                {/* Overlay Container */}
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
                                text="Login"
                                onClick={isSignup ? handleSignInClick : handleSignUpClick}
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
                                text="Sign Up"
                                onClick={isSignup ? handleSignInClick : handleSignUpClick}
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
