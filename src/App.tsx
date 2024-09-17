import { useState } from 'react'
import './App.css'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import AppRoutes from './routes'
import { ThemeProvider } from './custom-components/theme-provider'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppRoutes></AppRoutes>
      </Router>
    </ThemeProvider>    
  )
}

export default App
