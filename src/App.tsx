import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { PortfolioProvider } from '@/contexts/PortfolioContext'
import { AppShell } from '@/components/layout/AppShell'
import { LoginPage } from '@/pages/LoginPage'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-surface">
        <div className="text-text-muted text-sm">Loading...</div>
      </div>
    )
  }

  if (!user) return <LoginPage />
  return (
    <PortfolioProvider>
      <AppShell />
    </PortfolioProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
