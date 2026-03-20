import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface MaoDeObra {
  id: string;
  nome_profissional: string;
  tipo_servico: string;
  valor: number;
  data: string;
}

export default function MaoDeObra() {
  const [servicos, setServicos] = useState<MaoDeObra[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ nome_profissional: '', tipo_servico: '', valor: 0, data: new Date().toISOString().split('T')[0] });
  const [saving, setSaving] = useState(false);

  const userId = 'user-1';

  const loadData = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3333/api'}/maodeobra/${userId}`)
      .then(res => res.json())
      .then(data => {
        setServicos(data || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setServicos([]);
        setLoading(false);
      });
  };

  useEffect(() => { loadData(); }, [userId]);

  const handleAdd = async () => {
    if (!formData.tipo_servico || !formData.valor) return alert('Preencha os campos obrigatórios');
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3333/api'}/maodeobra`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, nome_profissional: 'Mão de Obra/Equipe', valor: Number(formData.valor), userId, data: new Date(formData.data).toISOString() })
      });
      if (res.ok) {
        setShowAdd(false);
        setFormData({ nome_profissional: '', tipo_servico: '', valor: 0, data: new Date().toISOString().split('T')[0] });
        loadData();
      }
    } catch(e) { console.error(e); }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mão de Obra</h2>
          <p className="text-gray-500 text-sm mt-1">Gastos com profissionais e serviços.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center transition shadow-sm font-medium">
          <Plus size={18} className="mr-2" />
          Novo Serviço
        </button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Adicionar Serviço / Mão de Obra</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Serviço</label>
                <input type="text" value={formData.tipo_servico} onChange={e => setFormData({...formData, tipo_servico: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 transition" placeholder="Ex: Alvenaria, Elétrica..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                  <input type="number" step="0.01" value={formData.valor || ''} onChange={e => setFormData({...formData, valor: parseFloat(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input type="date" value={formData.data} onChange={e => setFormData({...formData, data: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 transition" />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-3">
              <button disabled={saving} onClick={() => setShowAdd(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl transition font-medium">Cancelar</button>
              <button disabled={saving} onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition shadow-sm font-medium">
                {saving ? 'Registrando...' : 'Salvar Serviço'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto min-w-full">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando...</div>
        ) : servicos.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="mb-4 text-lg">Nenhum serviço registrado ainda.</p>
            <button onClick={() => setShowAdd(true)} className="text-blue-600 font-medium hover:underline">Registrar mão de obra</button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold border-b border-gray-100">
                <th className="p-4">Tipo de Serviço</th>
                <th className="p-4">Data</th>
                <th className="p-4">Valor</th>
                <th className="p-4 w-24 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {servicos.map(item => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                      {item.tipo_servico}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{new Date(item.data).toLocaleDateString()}</td>
                  <td className="p-4 font-semibold text-gray-800">R$ {item.valor.toFixed(2)}</td>
                  <td className="p-4 flex justify-center gap-3">
                    <button className="text-gray-400 hover:text-blue-600 transition" title="Editar"><Edit2 size={16} /></button>
                    <button className="text-gray-400 hover:text-red-600 transition" title="Excluir"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
