export const LoadingSpinner = () => {
    return (
        <div className="relative">
            <div className="absolute animate-spin w-10 h-10">
                <div className="w-full h-5 border-4 border-b-0 border-red-800 rounded-t-full" />
            </div>
            <div className="w-10 h-10 border-4 border-red-300 rounded-full" />
        </div>
    );
};