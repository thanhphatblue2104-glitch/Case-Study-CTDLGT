import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Inventory from './pages/Inventory';
import ImportGoods from './pages/ImportGoods';
import ExportGoods from './pages/ExportGoods';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Inventory />} />
          <Route path="import" element={<ImportGoods />} />
          <Route path="export" element={<ExportGoods />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
