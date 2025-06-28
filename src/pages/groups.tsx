export default function Groups() {
  return (
    <div style={{ padding: 32 }}>
      <h1 className="text-3xl font-bold mb-6">Groups</h1>
      <p className="text-gray-600 mb-8">This is the Groups page. Scroll down to test the scroll-to-top functionality.</p>
      
      {/* Generate some dummy content to enable scrolling */}
      {Array.from({ length: 20 }, (_, index) => (
        <div key={index} className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Group {index + 1}</h2>
          <p className="text-gray-600 mb-4">
            This is a sample group description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Technology</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Innovation</span>
          </div>
        </div>
      ))}
      
      <div className="text-center py-8">
        <p className="text-gray-500">You've reached the bottom! Use the scroll-to-top button to go back up.</p>
      </div>
    </div>
  );
} 