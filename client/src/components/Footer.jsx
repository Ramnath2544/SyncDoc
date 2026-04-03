import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";

export default function FooterComponent() {
  return (
    <Footer container className="border-t-8 border-teal-500 mt-auto">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center py-4">
        <Link to="/" className="font-bold dark:text-white text-xl mb-4 md:mb-0">
          <span className="px-2 py-1 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-lg text-white">
            Sync
          </span>
          Doc
        </Link>
        <p className="text-gray-500 text-sm text-center">
          &copy; {new Date().getFullYear()} SyncDoc. Built for real-time collaboration.
        </p>
      </div>
    </Footer>
  );
}