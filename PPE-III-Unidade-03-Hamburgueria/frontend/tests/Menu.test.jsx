import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import Menu from '../src/components/Menu.jsx';
import App from '../src/App.jsx';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Componente Menu', () => {
  test('renderiza a aplicação principal', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, json: async () => [] });
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Hamburgueria' })).toBeInTheDocument();
  });

  test('exibe carregamento e depois renderiza os produtos', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, json: async () => [{ id: 1, name: 'X-Burger', price: 24.9 }] });
    render(<Menu />);
    expect(screen.getByText('Carregando cardápio...')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'X-Burger' })).toBeInTheDocument();
  });

  test('adiciona produto ao carrinho após clique', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, json: async () => [{ id: 1, name: 'X-Burger', price: 24.9 }] });
    const user = userEvent.setup();
    render(<Menu />);
    await user.click(await screen.findByRole('button', { name: 'Adicionar X-Burger' }));
    expect(screen.getByText('Itens no carrinho: 1')).toBeInTheDocument();
  });

  test('permite adicionar mais de um produto', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, json: async () => [{ id: 1, name: 'X-Bacon', price: 29.9 }] });
    const user = userEvent.setup();
    render(<Menu />);
    const button = await screen.findByRole('button', { name: 'Adicionar X-Bacon' });
    await user.click(button);
    await user.click(button);
    expect(screen.getByText('Itens no carrinho: 2')).toBeInTheDocument();
  });

  test('apresenta mensagem quando não existem produtos', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, json: async () => [] });
    render(<Menu />);
    expect(await screen.findByText('Nenhum produto disponível.')).toBeInTheDocument();
  });

  test('apresenta erro quando a API retorna falha', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false });
    render(<Menu />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível carregar o cardápio');
  });

  test('apresenta erro quando fetch lança exceção', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Erro de conexão'));
    render(<Menu />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Erro de conexão');
  });
});
