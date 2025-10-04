export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-light mb-6"></div>
            <h1 className="text-2xl text-slate-700 font-bold mb-2">Loading...</h1>
            <p className="text-lg text-slate-500">Please wait while we prepare your page.</p>
        </div>
    );
}