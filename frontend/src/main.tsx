import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log("Starting React App...");

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error("Root element not found");

  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log("React App Rendered Successfully");
} catch (error) {
  console.error("Failed to render React App:", error);
  document.body.innerHTML = `<div style="color:red; padding: 20px;"><h1>CRITICAL ERROR</h1><pre>${error}</pre></div>`;
}
