import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, CheckCircle } from 'lucide-react';

interface Planejamento {
  id: string;
  nome: string;
  categoria: string;
  quantidade: number;
  valor_estimado: number;
  status: string;
  createdAt: string;
}

export default function Planejamentos() {
  const [planejamentos, setPlanejamentos] = useState<Planejamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ nome: '', categoria: 'Material', quantidade: 1, valor_estimado: 0 });
  const [saving, setSaving] = useState(false);

  const userId = 'user-1';

  const loadData = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3333/api'}/planejamento/${userId}`)
      .then(res => res.json())
      .then(data => {
        setPlanejamentos(data || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setPlanejamentos([]);
        setLoading(false);
      });
  };

  useEffect(() => { loadData(); }, [userId]);

  const markAsComprado = async (id: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3333/api'}/planejamento/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'comprado' })
      });
      if (res.ok) {
        setPlanejamentos(prev => prev.map(p => p.id === id ? { ...p, status: 'comprado' } : p));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async () => {
    if (!formData.nome || !formData.quantidade || !formData.valor_estimado) return alert('Preencha os campos obrigatórios');
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3333/api'}/planejamento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, quantidade: Number(formData.quantidade), valor_estimado: Number(formData.valor_estimado), userId })
      });
      if (res.ok) {
        setShowAdd(false);
        setFormData({ nome: '', categoria: 'Material', quantidade: 1, valor_estimado: 0 });
        loadData();
      }
    } catch(e) { console.error(e); }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Planejamento Futuro</h2>
          <p className="text-gray-500 text-sm mt-1">Liste e preveja compras futuras para a obra.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center transition shadow-sm font-medium">
          <Plus size={18} className="mr-2" />
          Novo Item Plan.
        </button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Planejar Novo Item</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Item</label>
                <input type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 transition" placeholder="Ex: Telhas" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 transition">
                  <option>Material</option>
                  <option>Ferramenta</option>
                  <option>Serviços</option>
                  <option>Mão de Obra</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                  <input type="number" step="0.01" value={formData.quantidade || ''} onChange={e => setFormData({...formData, quantidade: parseFloat(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimativa (R$)</label>
                  <input type="number" step="0.01" value={formData.valor_estimado || ''} onChange={e => setFormData({...formData, valor_estimado: parseFloat(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 transition" placeholder="Ex: 50.00" />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-3">
              <button disabled={saving} onClick={() => setShowAdd(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl transition font-medium">Cancelar</button>
              <button disabled={saving} onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition shadow-sm font-medium">
                {saving ? 'Registrando...' : 'Salvar Planejamento'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto min-w-full">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando...</div>
        ) : planejamentos.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="mb-4 text-lg">Nenhum item de planejamento registrado.</p>
            <button onClick={() => setShowAdd(true)} className="text-blue-600 font-medium hover:underline">Adicionar item para cotar</button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold border-b border-gray-100">
                <th className="p-4">Item Plan.</th>
                <th className="p-4">Qtd.</th>
                <th className="p-4">Estimativa</th>
                <th className="p-4">Status</th>
                <th className="p-4 w-32 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {planejamentos.map(item => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800">{item.nome} <span className="text-xs text-gray-400 ml-2 block sm:inline">{item.categoria}</span></td>
                  <td className="p-4 text-gray-500">{item.quantidade}</td>
                  <td className="p-4 font-semibold text-gray-800">R$ {item.valor_estimado.toFixed(2)}</td>
                  <td className="p-4">
                    {item.status === 'comprado' ? (
                      <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center w-max">
                        <CheckCircle size={12} className="mr-1"/> Comprado
                      </span>
                    ) : (
                      <span className="bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full text-xs font-semibold">
                        Pendente
                      </span>
                    )}
                  </td>
                  <td className="p-4 flex justify-center gap-3">
                    {item.status !== 'comprado' && (
                      <button onClick={() => markAsComprado(item.id)} className="text-green-500 hover:text-green-700 transition" title="Marcar como Comprado">
                        <CheckCircle size={16} />
                      </button>
                    )}
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
