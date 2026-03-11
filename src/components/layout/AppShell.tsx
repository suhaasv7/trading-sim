import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { DashboardPage } from '@/pages/DashboardPage'
import { TradePage } from '@/pages/TradePage'
import { PortfolioPage } from '@/pages/PortfolioPage'
import { TransactionHistoryPage } from '@/pages/TransactionHistoryPage'
import { WatchlistPage } from '@/pages/WatchlistPage'

export function AppShell() {
  const [activePage, setActivePage] = useState('dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage onNavigate={setActivePage} />
      case 'trade': return <TradePage />
      case 'portfolio': return <PortfolioPage />
      case 'history': return <TransactionHistoryPage />
      case 'watchlist': return <WatchlistPage />
      default: return <DashboardPage onNavigate={setActivePage} />
    }
  }

  return (
    <div className="relative h-full flex">
      {/* Mesh Background */}
      <div className="mesh-bg">
        <div className="mesh-blob-3" />
      </div>

      {/* App */}
      <div className="relative z-10 flex h-full w-full">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  )
}
