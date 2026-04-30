import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LandingPage from './LandingPage.jsx'
import CookieBanner from './CookieBanner.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LandingPage />
    <CookieBanner />
  </StrictMode>,
)
