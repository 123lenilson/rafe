<?php

namespace App\Modules\POS\Domain;

/**
 * Pedido
 *
 * Representa o carrinho de compras antes da emissão do documento fiscal.
 * Pertence ao Domain do módulo POS.
 *
 * Localização: app/Modules/POS/Domain/Pedido.php
 *
 * Responsabilidades:
 *  - Agregar os ItemPedido do operador
 *  - Não permitir carrinho vazio
 *  - Adicionar item novo ou actualizar quantidade se produto já existe
 *  - Remover item pelo id_produto
 *  - Calcular total ilíquido, total IVA, total retenção e valor a pagar
 *
 * Regras:
 *  - Desconto é sempre 0 por enquanto
 *  - Imposto chega já resolvido como percentagem (o Service resolve o ID)
 *  - Validação de stock é feita pelo Service — o Domain não conhece stock
 *  - Retenção (6.5%) é informativa — não soma ao valor a pagar
 *  - valor a pagar = total ilíquido + total IVA
 */
class Pedido
{
    /** @var ItemPedido[] */
    private array $itens = [];

    /**
     * @param ItemPedido[] $itens
     * @param int|null $idPedido
     */
    public function __construct(array $itens, private ?int $idPedido = null)
    {
        if (empty($itens)) {
            throw new \DomainException('Pedido não pode ser criado sem itens');
        }

        foreach ($itens as $item) {
            $this->adicionarItem($item);
        }
    }

    // ─── Identidade ───────────────────────────────────────────────────────────

    public function idPedido(): ?int
    {
        return $this->idPedido;
    }

    public function definirIdPedido(int $id): void
    {
        $this->idPedido = $id;
    }

    // ─── Comandos ─────────────────────────────────────────────────────────────

    /**
     * Adiciona um item ao carrinho.
     * Se o produto já existe, actualiza a quantidade.
     */
    public function adicionarItem(ItemPedido $novoItem): void
    {
        foreach ($this->itens as $index => $itemExistente) {
            if ($itemExistente->idProduto() === $novoItem->idProduto()) {
                // Produto já existe — substitui pelo novo (com a nova quantidade)
                $this->itens[$index] = $novoItem;
                return;
            }
        }

        // Produto novo — adiciona ao carrinho
        $this->itens[] = $novoItem;
    }

    /**
     * Remove um item do carrinho pelo id_produto.
     * Corresponde ao comportamento de qty=0 no PedidoModel.
     */
    public function removerItem(int $idProduto): void
    {
        foreach ($this->itens as $index => $item) {
            if ($item->idProduto() === $idProduto) {
                array_splice($this->itens, $index, 1);
                return;
            }
        }

        throw new \DomainException('Produto não encontrado no carrinho');
    }

    // ─── Consultas ────────────────────────────────────────────────────────────

    /**
     * Número de itens distintos no carrinho.
     */
    public function totalItens(): int
    {
        return count($this->itens);
    }

    /**
     * Verifica se um produto está no carrinho pelo id_produto.
     */
    public function contemProduto(int $idProduto): bool
    {
        foreach ($this->itens as $item) {
            if ($item->idProduto() === $idProduto) {
                return true;
            }
        }
        return false;
    }

    /**
     * Devolve a quantidade actual de um produto no carrinho.
     */
    public function quantidadeDoProduto(int $idProduto): int
    {
        foreach ($this->itens as $item) {
            if ($item->idProduto() === $idProduto) {
                return $item->quantidade();
            }
        }

        throw new \DomainException('Produto não encontrado no carrinho');
    }

    /**
     * Devolve todos os itens do carrinho.
     *
     * @return ItemPedido[]
     */
    public function itens(): array
    {
        return $this->itens;
    }

    // ─── Cálculos ─────────────────────────────────────────────────────────────

    /**
     * Soma dos subtotais de todos os itens (sem imposto).
     * total ilíquido = Σ (qty × preco) por item
     */
    public function totalIliquido(): float
    {
        return array_reduce(
            $this->itens,
            fn(float $soma, ItemPedido $item) => $soma + $item->subtotalComDesconto(),
            0.0
        );
    }

    /**
     * Soma do IVA de todos os itens que NÃO têm retenção.
     */
    public function totalIva(): float
    {
        return array_reduce(
            $this->itens,
            function (float $soma, ItemPedido $item): float {
                if (!$item->temRetencao()) {
                    return $soma + $item->valorImposto();
                }
                return $soma;
            },
            0.0
        );
    }

    /**
     * Soma da retenção de todos os itens que TÊM retenção.
     * Valor informativo — não entra no valor a pagar.
     */
    public function totalRetencao(): float
    {
        return array_reduce(
            $this->itens,
            function (float $soma, ItemPedido $item): float {
                if ($item->temRetencao()) {
                    return $soma + $item->valorImposto();
                }
                return $soma;
            },
            0.0
        );
    }

    /**
     * Valor total que o cliente deve pagar.
     * valor a pagar = total ilíquido + total IVA
     * Retenção NÃO soma — é informativa na factura.
     */
    public function valorAPagar(): float
    {
        return $this->totalIliquido() + $this->totalIva();
    }
}