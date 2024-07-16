export default function Toggle({ collapsed, setCollapsed }) {
    return (
        <div className="flex justify-end items-center px-4 py-1 mb-4">
            {collapsed ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    height="24px"
                    width="24px"
                    className={`${
                        collapsed ? "translate-x-16" : "translate-x-0"
                    } m-1 cursor-pointer fill-black transition-transform hover:opacity-80 relative sm:invisible`}
                    onClick={() => setCollapsed(!collapsed)}>
                    <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    height="24px"
                    width="24px"
                    className={`${
                        collapsed ? "translate-x-16" : "translate-x-0"
                    } m-1 cursor-pointer fill-black transition-transform hover:opacity-80 relative sm:invisible`}
                    onClick={() => setCollapsed(!collapsed)}>
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
            )}
        </div>
    );
}
