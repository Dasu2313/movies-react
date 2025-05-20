import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { GenreContextProvider } from './components/GenreContext'
import { SessionContextProvider } from './components/SessionContext'
import { RateContextProvider } from './components/RateContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <SessionContextProvider>
      <GenreContextProvider>
        <RateContextProvider>
          <App />
        </RateContextProvider>
      </GenreContextProvider>
    </SessionContextProvider>
  </React.StrictMode>
)
