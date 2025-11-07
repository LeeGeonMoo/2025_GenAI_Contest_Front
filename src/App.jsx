import './App.css';

function App() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-900 p-8 text-center text-white">
      <div className="max-w-md">
        <h1 className="mb-4 text-5xl font-bold text-sky-400">Hello, NotiSNU!</h1>

        <p className="mb-8 text-lg text-gray-300">
          If you see this text styled (sky-blue heading, white text, dark background), Tailwind CSS
          is working correctly.
        </p>

        <button
          type="button"
          className="focus:ring-opacity-75 rounded-lg bg-sky-600 px-6 py-3 text-base font-medium text-white shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-sky-500 focus:ring-2 focus:ring-sky-400 focus:outline-none"
        >
          Click Me
        </button>
      </div>
    </div>
  );
}

export default App;
