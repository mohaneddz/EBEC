import Link from 'next/link';
import Navbar from '@/layout/Navbar'

export default function NotFound() {
    return (
        <div className="">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
                <h1 className="text-4xl text-slate-700 font-bold mb-4">404 - Page Not Found</h1>
                <p className="text-lg mb-6 text-slate-500">Oops! The page you are looking for does not exist.</p>
                <Link
                    href="/"
                    className="px-6 py-3 bg-primary-light text-white rounded-md hover:bg-primary-dark transition-colors duration-300"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}