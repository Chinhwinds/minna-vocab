import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TestFlashcard from './pages/TestFlashcard'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TestFlashcard />
  </StrictMode>,
)
