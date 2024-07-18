export default function Session() {
    return (
        <div className="flex flex-col w-full h-dvh items-center font-semibold text-gray-500">
            <div className="w-full leading-8 py-3 pr-6 pl-16 sm:pl-6 sm:hidden bg-indigo-600 font-semibold">
                <p className="text-white">Welcome</p>
            </div>
            <div className="text-center text-sm my-auto space-y-2">
                <p>Start a new session</p>
                <p>or</p>
                <p>Continue with the old session</p>
            </div>
        </div>
    );
}
