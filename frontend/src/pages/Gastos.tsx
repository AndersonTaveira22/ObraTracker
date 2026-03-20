import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface Gasto {
  id: string;
  nome: string;
  descricao: string | null;
  valor: number;
  data: string;
  categoria: string;
}

export default function Gastos() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ nome: '', descricao: '', valor: 0, data: new Date().toISOString().split('T')[0], categoria: 'Material' });
  const [saving, setSaving] = useState(false);

  // Mocked userId for now
  const userId = 'user-1';

  const loadGastos = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3333/api'}/gastos/${userId}`)
      .then(res => res.json())
      .then(data => {
        setGastos(data || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setGastos([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadGastos();
  }, [userId]);

  const handleAdd = async () => {
    if (!formData.nome || !formData.valor) return alert('Preencha nome e valor');
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3333/api'}/gastos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, valor: Number(formData.valor), userId, data: new Date(formData.data).toISOString() })
      });
      if (res.ok) {
        setShowAdd(false);
        setFormData({ nome: '', descricao: '', valor: 0, data: new Date().toISOString().split('T')[0], categoria: 'Material' });
        loadGastos();
      }
    } catch(e) {
      console.error(e);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gastos</h2>
          <p className="text-gray-500 text-sm mt-1">Gerencie as despesas da obra.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center transition shadow-sm font-medium">
          <Plus size={18} className="mr-2" />
          Novo Gasto
        </button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Adicionar Gasto</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 transition" placeholder="Ex: Cimento, Tijolo..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                <input type="number" step="0.01" value={formData.valor || ''} onChange={e => setFormData({...formData, valor: parseFloat(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 transition" placeholder="0.00" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-blue-500 transition">
                    <option>Material</option>
                    <option>Ferramenta</option>
                    <option>Mão de Obra</option>
                    <option>Serviços</option>
                    <option>Outros</option>
                  </select>
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
                {saving ? 'Salvando...' : 'Salvar Gasto'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto min-w-full">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando...</div>
        ) : gastos.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="mb-4 text-lg">Nenhum gasto registrado ainda.</p>
            <button onClick={() => setShowAdd(true)} className="text-blue-600 font-medium hover:underline">Adicionar seu primeiro gasto</button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold border-b border-gray-100">
                <th className="p-4">Nome</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Data</th>
                <th className="p-4">Valor</th>
                <th className="p-4 w-24 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {gastos.map(gasto => (
                <tr key={gasto.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800">{gasto.nome}</td>
                  <td className="p-4 text-gray-500">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                      {gasto.categoria}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{new Date(gasto.data).toLocaleDateString()}</td>
                  <td className="p-4 font-semibold text-gray-800">R$ {gasto.valor.toFixed(2)}</td>
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
