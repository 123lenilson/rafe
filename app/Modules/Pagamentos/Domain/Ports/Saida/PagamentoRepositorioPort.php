<?php

namespace App\Modules\Pagamentos\Domain\Ports\Saida;

/**
 * PagamentoRepositorioPort
 *
 * Port de saída do módulo Pagamentos.
 * Define o contrato para registo de pagamentos associados a documentos fiscais.
 *
 * Localização: app/Modules/Pagamentos/Domain/Ports/Saida/PagamentoRepositorioPort.php
 *
 * Métodos de pagamento aceites (convenção, não validado nesta camada):
 *  - 'numerario'     — Dinheiro em espécie
 *  - 'transferencia' — Transferência bancária
 *  - 'cartao'        — Cartão de débito/crédito
 *  - 'multicaixa'    — Multicaixa Express (Angola)
 *  - 'credito'       — Conta corrente / crédito ao cliente
 *
 * Implementações esperadas:
 *  - MySQLPagamentoRepo (Adapter Laravel — fase posterior)
 *  - FakePagamentoRepositorio (para testes — Fase 2)
 */
interface PagamentoRepositorioPort
{
    /**
     * Regista o pagamento de um documento fiscal.
     * Executado dentro da transacção do FinalizarVendaService.
     *
     * @param int    $documentoFiscalId ID do documento fiscal emitido
     * @param float  $valor             Valor total pago (em AOA)
     * @param string $metodo            Método de pagamento (ver convenções acima)
     * @throws \DomainException se o registo de pagamento falhar
     */
    public function registar(int $documentoFiscalId, float $valor, string $metodo): void;
}
