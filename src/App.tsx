import { useState } from 'react'
import './App.css'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import AppRoutes from './routes'
import { ThemeProvider } from './custom-components/theme-provider'
import { Toaster } from './components/ui/toaster'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Toaster></Toaster>
        <AppRoutes></AppRoutes>
      </Router>
    </ThemeProvider>    
  )
}

export default App
