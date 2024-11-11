// app/components/GlassButton.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const GlassButton = ({ title }: { title: string }) => {
    return (
        <Link href="/search">
            <button
                className="fixed top-5 right-5 p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 bg-opacity-50 backdrop-blur-lg text-white rounded-md shadow-lg z-50 hover:bg-blue-600 hover:bg-opacity-40 transition duration-300"
                title={title}
            >
                <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
            </button>
        </Link>
    );
};

export default GlassButton;
