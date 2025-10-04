export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 text-center">
        Weatherwise
      </h1>

      <p className="text-center text-gray-700 mb-6">
        Welcome to your weather dashboard!
      </p>

      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded">
        Get Weather
      </button>
    </div>
  );
}
