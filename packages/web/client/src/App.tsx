import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ClientPage from './pages/ClientPage';
import ProjectPage from './pages/ProjectPage';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />

        {/* Protected routes */}
        <Route
          path="/clients"
          element={
            <PrivateRoute>
              <ClientPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <ProjectPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}
