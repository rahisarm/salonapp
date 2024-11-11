import './App.css'
import { BrowserRouter as Router } from 'react-router-dom'

import AppRoutes from './routes'
import { ThemeProvider } from './custom-components/theme-provider'
import { Toaster } from './components/ui/toaster'
import { ConfirmProvider } from './custom-components/Confirm'
import { SettingsProvider } from './contexts/SettingsContext'

function App() {
  return (
    <ThemeProvider>
      <Router basename='salonapp'>
        <SettingsProvider>
          <ConfirmProvider>
            <Toaster></Toaster>
            <AppRoutes></AppRoutes>
          </ConfirmProvider>
        </SettingsProvider>
        
        
      </Router>
    </ThemeProvider>    
  )
}

export default App
