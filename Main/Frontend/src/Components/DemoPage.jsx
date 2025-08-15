import React from 'react';

function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-yellow-500 text-white text-center p-2">
        You are currently on a demo page.
      </div>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Demo Page</h1>
        <p className="text-gray-400">This is a demo page for unauthenticated users.</p>
      </main>
    </div>
  );
}

export default DemoPage;