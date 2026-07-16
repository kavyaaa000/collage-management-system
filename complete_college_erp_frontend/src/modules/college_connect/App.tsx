import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { useAuth } from './hooks/useAuth';
import { Loading } from './components/common/Loading';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleRoute } from './routes/RoleRoute';
import { AppLayout } from './components/Layout/AppLayout';

// Auth Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Main Pages
import { DashboardPage } from './pages/DashboardPage';

// Contest Pages
import { ContestsListPage } from './pages/ContestsListPage';
import { CreateContestPage } from './pages/CreateContestPage';
import { ContestDetailsPage } from './pages/ContestDetailsPage';
import { ApproveContestPage } from './pages/ApproveContestPage';
import { ContestParticipationPage } from './pages/ContestParticipationPage';
import { MCQTestPage } from './pages/MCQTestPage';
import { CodeChallengePage } from './pages/CodeChallengePage';

// Wallet & Leaderboard
import { WalletPage } from './pages/WalletPage';
import { LeaderboardPage } from './pages/LeaderboardPage';

// Store Pages
import { StorePage } from './pages/StorePage';
import { MyPurchasesPage } from './pages/MyPurchasesPage';
import { AdminStorePage } from './pages/AdminStorePage';

// Admin Pages
import { AdminDepartmentsPage } from './pages/AdminDepartmentsPage';

// 404
import { NotFoundPage } from './pages/NotFoundPage';

const PlatformModule: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route
          path="login"
          element={user ? <Navigate to="../dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="register"
          element={user ? <Navigate to="../dashboard" replace /> : <RegisterPage />}
        />

        {/* ================= PROTECTED ROUTES ================= */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>

            {/* Default */}
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* Dashboard */}
            <Route path="dashboard" element={<DashboardPage />} />

            {/* ================= CONTEST ROUTES ================= */}
            <Route path="contests" element={<ContestsListPage />} />
            <Route path="contests/create" element={<CreateContestPage />} />
            <Route path="contests/:id" element={<ContestDetailsPage />} />
            <Route
              path="contests/:contestId/participate"
              element={<ContestParticipationPage />}
            />
            <Route
              path="contests/:contestId/mcq"
              element={<MCQTestPage />}
            />
            <Route
              path="contests/:contestId/code/:problemId"
              element={<CodeChallengePage />}
            />

            {/* ================= WALLET & LEADERBOARD ================= */}
            <Route path="wallet" element={<WalletPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />

            {/* ================= STORE ================= */}
            <Route path="store" element={<StorePage />} />
            <Route path="store/purchases" element={<MyPurchasesPage />} />

            {/* ================= ADMIN / HOD ROUTES ================= */}
            <Route element={<RoleRoute roles={['HOD', 'ADMIN']} />}>
              <Route
                path="contests/:id/approve"
                element={<ApproveContestPage />}
              />
            </Route>

            <Route element={<RoleRoute roles={['ADMIN']} />}>
              <Route
                path="admin/departments"
                element={<AdminDepartmentsPage />}
              />
              <Route
                path="admin/store"
                element={<AdminStorePage />}
              />
            </Route>

          </Route>
        </Route>

        {/* ================= 404 ================= */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ThemeProvider>
  );
};

export default PlatformModule;
