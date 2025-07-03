import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import PasswordGate from './components/PasswordGate.tsx'
createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="791605988034-8ni9htnr64n0qe2qaq8j5v2tb1jvaspn.apps.googleusercontent.com">
    <StrictMode>
      <PasswordGate>
        <App />
      </PasswordGate>
    </StrictMode>
  </GoogleOAuthProvider>,
)
