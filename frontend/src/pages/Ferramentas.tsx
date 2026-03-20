import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface Ferramenta {
  id: string;
  nome: string;
  custo: number;
  createdAt: string;
}

export default function Ferramentas() {
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ nome: '', custo: 0 });
  const [saving, setSaving] = useState(false);

  const userId = 'user-1';

  const loadData = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3333/api'}/ferramentas/${userId}`)
      .then(res => res.json())
      .then(data => {
        setFerramentas(data || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setFerramentas([]);
        setLoading(false);
      });
  };

  useEffect(() => { loadData(); }, [userId]);

  const handleAdd = async () => {
    if (!formData.nome || !formData.custo) return alert('Preencha os campos obrigatórios');
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3333/api'}/ferramentas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, custo: Number(formData.custo), userId })
      });
      if (res.ok) {
        setShowAdd(false);
        setFormData({ nome: '', custo: 0 });
        loadData();
      }
    } catch(e) { console.error(e); }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Ferramentas</h2>
          <p className="text-gray-500 text-sm mt-1">Gerenciamento de ferramentas da obra.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center transition shadow-sm font-medium">
          <Plus size={18} className="mr-2" />
          Nova Ferramenta
        </button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Adicionar Ferramenta</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Ferramenta</label>
                <input type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 transition" placeholder="Ex: Betoneira" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custo / Valor (R$)</label>
                <input type="number" step="0.01" value={formData.custo || ''} onChange={e => setFormData({...formData, custo: parseFloat(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 transition" />
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-3">
              <button disabled={saving} onClick={() => setShowAdd(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl transition font-medium">Cancelar</button>
              <button disabled={saving} onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition shadow-sm font-medium">
                {saving ? 'Registrando...' : 'Salvar Ferramenta'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto min-w-full">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando...</div>
        ) : ferramentas.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="mb-4 text-lg">Nenhuma ferramenta cadastrada.</p>
            <button onClick={() => setShowAdd(true)} className="text-blue-600 font-medium hover:underline">Adicionar ferramenta</button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold border-b border-gray-100">
                <th className="p-4">Nome da Ferramenta</th>
                <th className="p-4">Custo / Valor</th>
                <th className="p-4 w-24 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {ferramentas.map(item => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800">{item.nome}</td>
                  <td className="p-4 font-semibold text-gray-800">R$ {item.custo.toFixed(2)}</td>
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
