import './App.css'
import { BrowserRouter as Router } from 'react-router-dom'

import AppRoutes from './routes'
import { ThemeProvider } from './custom-components/theme-provider'
import { Toaster } from './components/ui/toaster'
import { ConfirmProvider } from './custom-components/Confirm'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ConfirmProvider>
          <Toaster></Toaster>
          <AppRoutes></AppRoutes>
        </ConfirmProvider>
        
      </Router>
    </ThemeProvider>    
  )
}

export default App
