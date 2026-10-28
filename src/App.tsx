import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Toast } from './components/Toast'
import ComingSoon from './pages/ComingSoon'
import Home from './pages/Home'
import Opportunities from './pages/Opportunities'
import { StoreProvider } from './store'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/projects" element={<ComingSoon title="Projects" />} />
          <Route path="/activities" element={<ComingSoon title="Activities" />} />
          <Route path="/leaderboard" element={<ComingSoon title="Leaderboard" />} />
          <Route path="/settings" element={<ComingSoon title="Settings" />} />
          <Route path="*" element={<ComingSoon title="Page not found" />} />
        </Routes>
        <Toast />
      </BrowserRouter>
    </StoreProvider>
  )
}
