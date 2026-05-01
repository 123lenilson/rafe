<?php

declare(strict_types=1);

namespace App\Modules\POS\Services;

use App\Modules\POS\Domain\Ports\Saida\PedidoRepositorioPort;
use App\Modules\POS\Domain\Ports\Saida\DocumentoFiscalRepositorioPort;
use App\Modules\POS\Domain\Ports\Saida\TransacaoPort;
use App\Modules\Stock\Domain\Ports\Saida\StockRepositorioPort;
use App\Modules\Pagamentos\Domain\Ports\Saida\PagamentoRepositorioPort;

/**
 * FinalizarVendaService
 * 
 * Orquestra o encerramento de um Pedido, garantindo atomicidade:
 * Abate stock, regista pagamento e emite o DocumentoFiscal.
 */
class FinalizarVendaService
{
    public function __construct(
        private PedidoRepositorioPort $pedidoRepo,
        private DocumentoFiscalRepositorioPort $documentoRepo,
        private StockRepositorioPort $stockRepo,
        private PagamentoRepositorioPort $pagamentoRepo,
        private TransacaoPort $transacao
    ) {}

    /**
     * Finaliza a venda e devolve o ID do DocumentoFiscal gerado.
     *
     * @param int $idPedido ID do pedido em espera
     * @param string $tipoDocumento 'Fatura', 'Fatura-Recibo', etc.
     * @param string $metodoPagamento 'numerario', 'cartao', etc.
     * @param float $valorEntregue Valor que o cliente entregou
     * @return int ID do documento gerado
     */
    public function finalizar(int $idPedido, string $tipoDocumento, string $metodoPagamento, float $valorEntregue): int
    {
        $pedido = $this->pedidoRepo->buscarPorId($idPedido);
        if ($pedido === null) {
            throw new \DomainException('Pedido não pode estar vazio');
        }

        // Criar LinhasVenda a partir dos ItemPedido do Pedido
        $linhasVenda = [];
        foreach ($pedido->itens() as $item) {
            $linhasVenda[] = new \App\Modules\POS\Domain\LinhaVenda(
                $item->idProduto(),
                $item->descricao(),
                $item->quantidade(),
                $item->preco(),
                $item->desconto(),
                $item->imposto()
            );
        }

        $documento = new \App\Modules\POS\Domain\DocumentoFiscal($tipoDocumento, $linhasVenda);

        // Executar a transacção atómica
        return $this->transacao->executar(function () use ($pedido, $documento, $metodoPagamento, $valorEntregue) {
            
            // Abater stock (isto lança excepção se não houver stock suficiente)
            foreach ($pedido->itens() as $item) {
                // Se a nossa Base de Dados levantasse erro aqui, fariamos catch para relançar
                // com a mensagem "Stock insuficiente no momento do checkout" se aplicável.
                // Mas o FakeStockRepositorio vai lançar \DomainException('Quantidade insuficiente em stock').
                // Para cumprir o requisito exacto de BDD:
                try {
                    $this->stockRepo->subtrair($item->idProduto(), $item->quantidade());
                } catch (\DomainException $e) {
                    throw new \DomainException('Stock insuficiente no momento do checkout');
                }
            }

            // Guardar documento
            $idDocumento = $this->documentoRepo->salvar($documento);

            // Registar pagamento (Isto pode lançar \DomainException('Falha simulada no registo de pagamento.'))
            $this->pagamentoRepo->registar($idDocumento, $valorEntregue, $metodoPagamento);

            // Eliminar o pedido agora que foi convertido
            $this->pedidoRepo->eliminar($pedido->idPedido());

            return $idDocumento;
        });
    }
}
