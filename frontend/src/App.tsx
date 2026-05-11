import { BrowserRouter } from 'react-router-dom'
import { Providers } from '@/app/Providers'
import { Router } from '@/app/Router'

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Providers>
  )
}
