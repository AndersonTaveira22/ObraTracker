import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Wallet, Hammer, Users, Settings, ClipboardList, TrendingUp, Menu, X } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Gastos from "./pages/Gastos";
import Materiais from "./pages/Materiais";
import Ferramentas from "./pages/Ferramentas";
import MaoDeObra from "./pages/MaoDeObra";
import Planejamento from "./pages/Planejamento";
import SettingsPage from "./pages/Settings";

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex bg-gray-50 min-h-screen text-gray-900 font-sans relative overflow-hidden">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col justify-between transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div>
          <div className="h-16 flex items-center px-6 border-b border-gray-100 justify-between">
            <h1 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="w-8 h-8 bg-blue-600 rounded-lg mr-3 shadow-md border border-blue-500 hidden md:block"></span>
              ObraTracker
            </h1>
            <button className="md:hidden text-gray-500 hover:text-gray-800 focus:outline-none" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <nav className="mt-6 px-4 space-y-2 overflow-y-auto">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center p-3 rounded-xl transition font-medium ${location.pathname === '/' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'hover:bg-gray-100 text-gray-600'}`}>
              <LayoutDashboard size={20} className="mr-3" />
              <span>Dashboard</span>
            </Link>
            <Link to="/gastos" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center p-3 rounded-xl transition font-medium ${location.pathname === '/gastos' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'hover:bg-gray-100 text-gray-600'}`}>
              <Wallet size={20} className="mr-3" />
              <span>Gastos</span>
            </Link>
            <Link to="/materiais" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center p-3 rounded-xl transition font-medium ${location.pathname === '/materiais' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'hover:bg-gray-100 text-gray-600'}`}>
              <Hammer size={20} className="mr-3" />
              <span>Materiais</span>
            </Link>
            <Link to="/trabalhadores" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center p-3 rounded-xl transition font-medium ${location.pathname === '/trabalhadores' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'hover:bg-gray-100 text-gray-600'}`}>
              <Users size={20} className="mr-3" />
              <span>Mão de Obra</span>
            </Link>
            <Link to="/ferramentas" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center p-3 rounded-xl transition font-medium ${location.pathname === '/ferramentas' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'hover:bg-gray-100 text-gray-600'}`}>
              <Settings size={20} className="mr-3" />
              <span>Ferramentas</span>
            </Link>
            <Link to="/planejamento" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center p-3 rounded-xl transition font-medium ${location.pathname === '/planejamento' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'hover:bg-gray-100 text-gray-600'}`}>
              <ClipboardList size={20} className="mr-3" />
              <span>Planejamento</span>
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-100">
          <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center p-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition">
            <Settings size={20} className="mr-3" />
            <span className="font-medium">Configurações</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-8">
          <button 
            className="md:hidden mr-4 text-gray-500 hover:text-gray-800 focus:outline-none p-2 rounded-lg hover:bg-gray-50"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          <h2 className="text-xl font-semibold truncate">Visão Geral</h2>
        </header>
        <div className="p-4 md:p-8 overflow-x-hidden overflow-y-auto flex-1 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

function Dashboard() {
  const [data, setData] = useState<any>(null);
  const userId = 'user-1';

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3333/api'}/dashboard/${userId}`)
      .then(res => res.json())
      .then(d => setData(d))
      .catch(e => console.error(e));
  }, []);

  if (!data) return <div className="p-8 text-gray-500">Carregando painel...</div>;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  return (
    <div className="space-y-6">
      {/* Top Banner with Total */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden flex justify-between items-center">
        <div>
          <h3 className="text-gray-500 text-lg font-medium">Total Gasto na Obra</h3>
          <p className="text-4xl font-bold mt-2 text-gray-800">R$ {data.totalGasto?.toFixed(2) || '0.00'}</p>
        </div>
        <TrendingUp className="text-blue-100" size={96} opacity={0.6} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Animated Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96 flex flex-col items-center">
          <h3 className="text-gray-800 font-bold mb-2 text-lg self-start">Distribuição dos Gastos</h3>
          <div className="flex-1 w-full relative">
            {data.chartData && data.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={data.chartData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={80} 
                    outerRadius={120} 
                    paddingAngle={8} 
                    dataKey="value"
                    animationDuration={1500}
                    animationBegin={200}
                    animationEasing="ease-out"
                  >
                    {data.chartData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Adicione gastos para ver o gráfico animado.
              </div>
            )}
          </div>
        </div>

        {/* Recent activities */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96 flex flex-col">
          <h3 className="text-gray-800 font-bold mb-4 text-lg">Últimos Lançamentos</h3>
          <div className="flex-1 overflow-auto pr-2">
            {data.gastosRecentes && data.gastosRecentes.length > 0 ? (
              <ul className="space-y-3">
                {data.gastosRecentes.map((g: any) => (
                  <li key={g.id} className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl transition border border-gray-100">
                    <div>
                      <p className="font-semibold text-gray-800">{g.nome}</p>
                      <p className="text-sm text-gray-400 mt-1">{new Date(g.data).toLocaleDateString()} &middot; {g.categoria}</p>
                    </div>
                    <p className="font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">R$ {g.valor.toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Nenhum lançamento recente.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gastos" element={<Gastos />} />
          <Route path="/materiais" element={<Materiais />} />
          <Route path="/trabalhadores" element={<MaoDeObra />} />
          <Route path="/planejamento" element={<Planejamento />} />
          <Route path="/ferramentas" element={<Ferramentas />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
