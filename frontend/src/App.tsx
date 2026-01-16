import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Inventory from './pages/Inventory';
import ImportGoods from './pages/ImportGoods';
import ExportGoods from './pages/ExportGoods';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inventory />} />
          <Route path="import" element={<ImportGoods />} />
          <Route path="export" element={<ExportGoods />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
