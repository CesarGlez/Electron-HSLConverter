import { BrowserRouter as Router } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    console.log("window.hlsEvents", window.hlsEvents);

  }, [])
  
  return (
    <Router>
      <AppRouter />
    </Router>
  )
}

export default App
