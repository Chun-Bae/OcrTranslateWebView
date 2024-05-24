export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <img
          src="/images/bird.jpg"
          alt="Centered Image"
          className="max-w-sm rounded-lg shadow-md mb-5"
        />
        <div className="grid grid-cols-1 gap-4">
          <div className="text-left">
            <h2 className="font-bold">Original Text</h2>
            <p>This is the original text.</p>
          </div>
          <div className="text-left">
            <h2 className="font-bold">English Text</h2>
            <p>This is another translated text.</p>
          </div>
          <div className="text-left">
            <h2 className="font-bold">Japanese Text</h2>
            <p>This is another translated text.</p>
          </div>
          <div className="text-left">
            <h2 className="font-bold">Chinese(Treditional) Text</h2>
            <p>This is another translated text.</p>
          </div>
          <div className="text-left">
            <h2 className="font-bold">Chinese(Simplified) Text</h2>
            <p>This is another translated text.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
