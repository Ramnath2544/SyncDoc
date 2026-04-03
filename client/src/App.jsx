import { Button } from "flowbite-react";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-gray-800">
        <span className="px-2 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg text-white">
          Sync
        </span>
        Doc
      </h1>
      <p className="text-gray-500">Real-time collaborative workspace</p>
      <Button color="blue">Flowbite is working! 🚀</Button>
    </div>
  );
}