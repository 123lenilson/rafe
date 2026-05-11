<?php

namespace App\Modules\Clientes\Adapters\Saida\Fakes;

use App\Modules\Clientes\Domain\DadosCliente;
use App\Modules\Clientes\Domain\Ports\Saida\ClienteRepositorioPort;

class FakeClienteRepositorio implements ClienteRepositorioPort
{
    private array $tabela_cliente = [];

    public function __construct()
    {
        $this->tabela_cliente = FakeClientesSeeder::tabela_cliente();
    }

    /**
     * Devolve os dados de um cliente pelo seu ID.
     */
    public function buscarPorId(int $id): ?DadosCliente
    {
        foreach ($this->tabela_cliente as $row) {
            if ($row['idcliente'] === $id) {
                return new DadosCliente(
                    $row['idcliente'],
                    $row['nome'],
                    $row['nif'] ?? ''
                );
            }
        }

        return null;
    }

    // ─── Métodos auxiliares de teste (Não fazem parte dos Ports) ────────────────

    public function definirCliente(int $id, DadosCliente $cliente): void
    {
        // Verifica se o cliente já existe para atualizar
        foreach ($this->tabela_cliente as $key => $row) {
            if ($row['idcliente'] === $id) {
                $this->tabela_cliente[$key]['nome'] = $cliente->nome();
                $this->tabela_cliente[$key]['nif'] = $cliente->nif();
                return;
            }
        }

        // Se não existe, cria um novo com os campos obrigatórios vazios
        $this->tabela_cliente[] = [
            'idcliente' => $id,
            'nome'      => $cliente->nome(),
            'nif'       => $cliente->nif(),
            'email'     => '',
            'telefone'  => '',
            'morada'    => '',
            'endereco'  => '',
            'empresa'   => 1,
            'usuario'   => 1,
        ];
    }

    public function clienteActual(int $id): ?DadosCliente
    {
        return $this->buscarPorId($id);
    }
}
