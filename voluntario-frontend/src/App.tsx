import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AccountTypePage } from './pages/auth/register/AccountTypePage';
import { LoginPage } from './pages/auth/LoginPage';
// import { AuthContext } from './utils/context/AuthContext';
import { AuthProvider } from './utils/AuthProvider';
import { Home } from './pages/Home';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './pages/Layout';
import { Dashboard } from './pages/Dashboard';
import { RegisterVolunteerPage } from './pages/auth/register/RegisterVolunteerPage';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<AccountTypePage />} />
          <Route
            path="/register/volunteer"
            element={<RegisterVolunteerPage />}
          />
          <Route
            path="/register/organization"
            element={<h1>Organization</h1>}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Layout />}>
            <Route index element={<Home />} />
          </Route>

          {/* Authenticated routes */}
          <Route element={<ProtectedRoute children={<Layout />} />}>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
