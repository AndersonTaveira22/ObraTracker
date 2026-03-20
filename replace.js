const fs = require('fs');
const files = [
  'frontend/src/pages/Planejamento.tsx',
  'frontend/src/pages/Materiais.tsx',
  'frontend/src/pages/MaoDeObra.tsx',
  'frontend/src/pages/Gastos.tsx',
  'frontend/src/pages/Ferramentas.tsx',
  'frontend/src/App.tsx'
];
const target = 'http://localhost:3333/api';
const replacement = "${import.meta.env.VITE_API_URL || 'http://localhost:3333/api'}";

for(let f of files) {
  let path = 'c:/Users/Anderson/Desktop/site obra/' + f;
  let content = fs.readFileSync(path, 'utf8');
  content = content.split(target).join(replacement);
  fs.writeFileSync(path, content);
}
console.log('URLs updated!');
