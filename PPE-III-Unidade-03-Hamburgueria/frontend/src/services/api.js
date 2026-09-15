export async function loadMenu() {
  const response = await fetch('/api/menu');
  if (!response.ok) throw new Error('Não foi possível carregar o cardápio');
  return response.json();
}
