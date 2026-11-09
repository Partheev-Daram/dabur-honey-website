import { Routes, Route } from 'react-router';
import AdminLayout from './components/AdminLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Recipes from './pages/Recipes.jsx';
import Products from './pages/Products.jsx';
import Campaigns from './pages/Campaigns.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

export default function AdminApp() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="recipes" element={<Recipes />} />
        <Route path="products" element={<Products />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
