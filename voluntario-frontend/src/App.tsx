import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { AuthProvider } from './utils/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './pages/Layout';
import { Dashboard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';
import { OrganizerHomePage } from './pages/organizer/OrganizerHomePage.tsx';
import { EventsListPage } from './pages/volunteer/EventsListPage';
import { EventDetailsPage } from './pages/volunteer/EventDetailsPage';
import { HomePage } from './pages/HomePage';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AccountType } from './components/AccountType';
import RegisterVolunteerForm from './components/forms/RegisterVolunteerForm';
import { LandingPage } from './pages/LandingPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { Provider } from 'react-redux';
import { store } from './utils/context/store';
import { AddEventPage } from '@/pages/organizer/AddEventPage.tsx';
import { ComplaintsPage } from '@/pages/admin/ComplaintsPage.tsx';
import RegisterOrganizationForm from './components/forms/RegisterOrganizationForm.tsx';
import { AddComplainPage } from '@/pages/organizer/AddComplainPage.tsx';
import { ShopManagementPage } from './pages/admin/ShopManagementPage.tsx';

const queryClient = new QueryClient();

function AppWithProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <AuthProvider>{children}</AuthProvider>
        </Provider>
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

        {/* Authenticated routes */}
        <Route element={<ProtectedRoute children={<Layout />} />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/events" element={<EventsListPage />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/organizer" element={<OrganizerHomePage />} />
          <Route path="/addevent" element={<AddEventPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/addcomplain" element={<AddComplainPage />} />
          <Route path="/shop" element={<ShopManagementPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppWithProviders>
  );
}

export default App;
