<?php

namespace App\Modules\Stock\Adapters\Saida\Fakes;

use App\Modules\Stock\Domain\DadosProduto;
use App\Modules\Stock\Domain\Ports\Saida\BuscadorDeProdutoPort;
use App\Modules\Stock\Domain\Ports\Saida\StockRepositorioPort;
use App\Modules\Stock\Domain\Ports\Saida\VerificadorDeStockPort;
use DomainException;

class FakeStockRepositorio implements BuscadorDeProdutoPort, VerificadorDeStockPort, StockRepositorioPort
{
    private array $tabela_produto = [];
    private array $tabela_categoria = [];

    public function __construct()
    {
        $this->tabela_produto = FakeStockSeeder::tabela_produto();
        $this->tabela_categoria = FakeStockSeeder::tabela_categoria();
    }

    /**
     * Devolve os dados de um produto pelo seu ID.
     */
    public function buscarPorId(int $id): ?DadosProduto
    {
        foreach ($this->tabela_produto as $row) {
            if ($row['IDPRODUTO'] === $id) {
                // Determina a taxa de imposto com base no ID de impostos
                // 1 -> 14%, 2 -> 7%, 3 -> 6.5%
                $taxaImposto = match($row['impostos']) {
                    1 => 14.0,
                    2 => 7.0,
                    3 => 6.5,
                    default => 0.0,
                };

                return new DadosProduto(
                    $row['IDPRODUTO'],
                    $row['descricao'],
                    $row['venda'],
                    $row['ps'],
                    $taxaImposto
                );
            }
        }

        return null;
    }

    /**
     * Verifica se existe stock suficiente para a quantidade pedida.
     */
    public function temStockDisponivel(int $produtoId, int $quantidade): bool
    {
        foreach ($this->tabela_produto as $row) {
            if ($row['IDPRODUTO'] === $produtoId) {
                // Serviços não têm limite de stock
                if ($row['ps'] === 'S') {
                    return true;
                }
                return $row['qtd'] >= $quantidade;
            }
        }
        return false;
    }

    /**
     * Subtrai a quantidade indicada do stock do produto.
     */
    public function subtrair(int $produtoId, int $quantidade): void
    {
        foreach ($this->tabela_produto as $key => $row) {
            if ($row['IDPRODUTO'] === $produtoId) {
                // Serviços não gerem stock, mas não dão erro
                if ($row['ps'] === 'S') {
                    return;
                }

                if ($row['qtd'] < $quantidade) {
                    throw new DomainException('Stock insuficiente para a subtracção.');
                }

                $this->tabela_produto[$key]['qtd'] -= $quantidade;
                return;
            }
        }
        
        throw new DomainException("Produto com ID $produtoId não encontrado.");
    }

    // ─── Métodos auxiliares de teste (Não fazem parte dos Ports) ────────────────

    public function definirProdutoEStock(int $produtoId, DadosProduto $produto, int $stock): void
    {
        $impostoId = match((string)$produto->taxaImposto()) {
            '14' => 1,
            '7' => 2,
            '6.5' => 3,
            default => 0,
        };

        // Verifica se o produto já existe para atualizar
        foreach ($this->tabela_produto as $key => $row) {
            if ($row['IDPRODUTO'] === $produtoId) {
                $this->tabela_produto[$key]['descricao'] = $produto->nome();
                $this->tabela_produto[$key]['venda'] = $produto->preco();
                $this->tabela_produto[$key]['ps'] = $produto->tipo();
                $this->tabela_produto[$key]['impostos'] = $impostoId;
                $this->tabela_produto[$key]['qtd'] = $stock;
                return;
            }
        }

        // Se não existe, cria um novo
        $this->tabela_produto[] = [
            'IDPRODUTO' => $produtoId,
            'descricao' => $produto->nome(),
            'categoria' => 1,
            'ps'        => $produto->tipo(),
            'impostos'  => $impostoId,
            'per'       => round(($produto->taxaImposto() / 100) * $produto->preco(), 2),
            'qtd'       => $stock,
            'validade'  => null,
            'compra'    => 0,
            'venda'     => $produto->preco(),
            'barra'     => '0000',
            'obs'       => null,
            'empresa'   => 1,
            'usuario'   => 1,
        ];
    }

    public function stockActual(int $produtoId): int
    {
        foreach ($this->tabela_produto as $row) {
            if ($row['IDPRODUTO'] === $produtoId) {
                return (int)$row['qtd'];
            }
        }
        return 0;
    }
}
