"use client";
import Link from 'next/link';

export default function ErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <h1 className="text-4xl text-red-600 font-bold mb-4">Something went wrong</h1>
            <p className="text-lg mb-6 text-slate-500">An unexpected error occurred. Please try again later.</p>
            <Link
                href="/"
                className="px-6 py-3 bg-primary-light text-white rounded-md hover:bg-primary-dark transition-colors duration-300"
            >
                Return Home
            </Link>
        </div>
    );
}