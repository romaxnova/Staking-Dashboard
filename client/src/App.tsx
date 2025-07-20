import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Kiln Dashboard</h1>
        <p>Loading minimal build for deployment test...</p>
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => fetch('/api/health').then(r => r.json()).then(console.log)}>
            Test API Connection
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
