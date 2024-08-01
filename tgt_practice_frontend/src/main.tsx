import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { ModalProvider } from './contexts/ModalContext.tsx';
import { UnitSystemProvider } from './contexts/UnitSystemContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UnitSystemProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </UnitSystemProvider>
  </React.StrictMode>,
)