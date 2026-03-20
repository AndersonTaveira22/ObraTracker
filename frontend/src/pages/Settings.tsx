import { useState, useEffect } from 'react';
import { Sun, Download, Save, Building } from 'lucide-react';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [nomeObra, setNomeObra] = useState("Obra Principal - Fase 1");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Configurações salvas com sucesso!');
    }, 800);
  };

  const handleExport = () => {
    alert('Simulação: Gerando relatório PDF completo de todas as categorias da sua obra...');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center transition-colors dark:bg-slate-800 dark:border-slate-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Configurações</h2>
          <p className="text-gray-500 text-sm mt-1 dark:text-gray-400">Gerencie as preferências e gere relatórios do sistema.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Aparência */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 transition-colors dark:bg-slate-800 dark:border-slate-700">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 flex items-center border-b border-gray-50 pb-3 dark:border-slate-700">
            <Sun className="mr-2 text-blue-500" size={20} />
            Personalização
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Modo Escuro (Dark Mode)</p>
              <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">Alterne para cores escuras.</p>
            </div>
            <button 
              onClick={toggleDarkMode}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-slate-600'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Dados da Obra */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 transition-colors dark:bg-slate-800 dark:border-slate-700">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 flex items-center border-b border-gray-50 pb-3 dark:border-slate-700">
            <Building className="mr-2 text-blue-500" size={20} />
            Dados do Projeto
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Nome do Projeto/Obra</label>
            <input 
              type="text" 
              value={nomeObra} 
              onChange={e => setNomeObra(e.target.value)} 
              className="w-full bg-gray-50 dark:bg-slate-700 dark:text-white dark:border-slate-600 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 transition" 
            />
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition shadow-sm font-medium flex justify-center items-center"
          >
            <Save size={18} className="mr-2" />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>

        {/* Exportação */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 md:col-span-2 transition-colors dark:bg-slate-800 dark:border-slate-700">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 flex items-center border-b border-gray-50 pb-3 dark:border-slate-700">
            <Download className="mr-2 text-blue-500" size={20} />
            Exportação de Dados
          </h3>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Relatório Completo</p>
              <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">Baixe um consolidado em PDF de todos os seus gastos organizados.</p>
            </div>
            <button 
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl transition shadow-sm font-medium flex items-center justify-center whitespace-nowrap"
            >
              <Download size={18} className="mr-2" />
              Gerar Relatório PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
