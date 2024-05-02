import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { AuthProvider } from './utils/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './pages/Layout';
import { Dashboard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';
import { EventsListPage } from './pages/volunteer/EventsListPage';
import { EventDetailsPage } from './pages/volunteer/EventDetailsPage';
import { HomePage } from './pages/HomePage';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AccountType } from './components/AccountType';
import RegisterVolunteerForm from './components/forms/RegisterVolunteerForm';
import { RegisterOrganizationForm } from './components/forms/RegisterOrganizationForm';
import { LandingPage } from './pages/LandingPage';
import Leaderboard from './pages/Leaderboard';

const queryClient = new QueryClient();

function AppWithProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AppWithProviders>
      <Routes>
        <Route path="/register" element={<RegisterPage />}>
          <Route index element={<AccountType />} />
          <Route path="volunteer" element={<RegisterVolunteerForm />} />
          <Route path="organization" element={<RegisterOrganizationForm />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route index element={<LandingPage />} />
        </Route>

        <Route path="/leaderboard" element={<Leaderboard />} />

        {/* Authenticated routes */}
        <Route element={<ProtectedRoute children={<Layout />} />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/events" element={<EventsListPage />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppWithProviders>
  );
}

export default App;
