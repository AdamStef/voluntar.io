import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RegisterPage } from './pages/register/RegisterPage';
import { LoginPage } from './pages/LoginPage';
// import { AuthContext } from './utils/context/AuthContext';
import { AuthProvider } from './utils/AuthProvider';
import { Home } from './pages/Home';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './pages/Layout';
import { Dashboard } from './pages/Dashboard';
import { RegisterVolunteerPage } from './pages/register/RegisterVolunteerPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/register/volunteer"
            element={<RegisterVolunteerPage />}
          />
          <Route
            path="/register/organization"
            element={<h1>Organization</h1>}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Home />} />

          {/* Authenticated routes */}
          <Route element={<ProtectedRoute children={<Layout />} />}>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
