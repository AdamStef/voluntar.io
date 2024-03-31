import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Layout } from "./pages/Layout"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          {/* Add nested routes here */}
          <Route index element={<div>Home</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
