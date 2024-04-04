import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
// import { AuthContext } from './utils/context/AuthContext';
import { AuthProvider } from './utils/AuthProvider';
import { Home } from './pages/Home';
import { AuthenticatedRoute } from './components/AuthenticatedRoute';
import { Layout } from './pages/Layout';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Authenticated routes */}
          <Route element={<AuthenticatedRoute children={<Layout />} />}>
            <Route index element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
