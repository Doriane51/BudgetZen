import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budget from './pages/Budget'
import Savings from './pages/Savings'
import Reports from './pages/Reports'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index        element={<Dashboard />}    />
          <Route path="transactions" element={<Transactions />} />
          <Route path="budget"       element={<Budget />}      />
          <Route path="epargne"      element={<Savings />}     />
          <Route path="rapports"     element={<Reports />}     />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}