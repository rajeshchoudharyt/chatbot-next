export default function Message({ message, role }) {
    return (
        <>
            {role === "user" ? (
                <div className="min-h-fit">
                    <p
                        className="px-2 leading-6 w-fit text-sm max-w-[85%] max-h-52 h-fit min-h-fit rounded-md overflow-y-auto 
                            bg-indigo-600 text-white ml-auto">
                        {message}
                    </p>
                </div>
            ) : (
                <div className="min-h-fit">
                    <p
                        className="px-2 leading-6 w-fit text-sm max-w-[85%] max-h-52 h-fit min-h-fit rounded-md overflow-y-auto
                            bg-white text-black">
                        {message}
                    </p>
                </div>
            )}
        </>
    );
}
