<?php

declare(strict_types=1);

namespace App\Modules\POS\Adapters\Saida\Fakes;

final class FakePOSSeeder
{
    /**
     * Simula a tabela de pedidos em aberto
     * Campos exigidos: idpedido, n_pedido, id_produto, descricao, qtd, preco, desconto,
     * imposto, dataa, hora, conta, mesa, empresa, usuario
     */
    public static function tabela_pedido(): array
    {
        return [
            ['idpedido' => 1, 'n_pedido' => 101, 'id_produto' => 10, 'descricao' => 'Computador Portátil', 'qtd' => 1, 'preco' => 350000.00, 'desconto' => 0.00, 'imposto' => 14.00, 'dataa' => '2026-04-30', 'hora' => '10:00:00', 'conta' => 'C1', 'mesa' => null, 'empresa' => 1, 'usuario' => 1],
            ['idpedido' => 2, 'n_pedido' => 101, 'id_produto' => 11, 'descricao' => 'Rato Sem Fios', 'qtd' => 2, 'preco' => 15000.00, 'desconto' => 0.00, 'imposto' => 14.00, 'dataa' => '2026-04-30', 'hora' => '10:00:00', 'conta' => 'C1', 'mesa' => null, 'empresa' => 1, 'usuario' => 1],
            ['idpedido' => 3, 'n_pedido' => 102, 'id_produto' => 12, 'descricao' => 'Teclado Mecânico', 'qtd' => 1, 'preco' => 45000.00, 'desconto' => 500.00, 'imposto' => 14.00, 'dataa' => '2026-04-30', 'hora' => '11:30:00', 'conta' => 'C2', 'mesa' => null, 'empresa' => 1, 'usuario' => 1],
            ['idpedido' => 4, 'n_pedido' => 103, 'id_produto' => 13, 'descricao' => 'Monitor 24"', 'qtd' => 2, 'preco' => 85000.00, 'desconto' => 0.00, 'imposto' => 14.00, 'dataa' => '2026-04-30', 'hora' => '12:15:00', 'conta' => 'C3', 'mesa' => null, 'empresa' => 1, 'usuario' => 1],
            ['idpedido' => 5, 'n_pedido' => 104, 'id_produto' => 14, 'descricao' => 'Cabo HDMI', 'qtd' => 5, 'preco' => 3500.00, 'desconto' => 0.00, 'imposto' => 14.00, 'dataa' => '2026-04-30', 'hora' => '13:00:00', 'conta' => 'C4', 'mesa' => null, 'empresa' => 1, 'usuario' => 1],
            ['idpedido' => 6, 'n_pedido' => 104, 'id_produto' => 15, 'descricao' => 'Fones Bluetooth', 'qtd' => 1, 'preco' => 25000.00, 'desconto' => 0.00, 'imposto' => 14.00, 'dataa' => '2026-04-30', 'hora' => '13:00:00', 'conta' => 'C4', 'mesa' => null, 'empresa' => 1, 'usuario' => 1],
            ['idpedido' => 7, 'n_pedido' => 105, 'id_produto' => 16, 'descricao' => 'Disco Externo 1TB', 'qtd' => 1, 'preco' => 55000.00, 'desconto' => 1000.00, 'imposto' => 14.00, 'dataa' => '2026-04-30', 'hora' => '14:20:00', 'conta' => 'C5', 'mesa' => null, 'empresa' => 1, 'usuario' => 1],
            ['idpedido' => 8, 'n_pedido' => 105, 'id_produto' => 17, 'descricao' => 'Pen Drive 64GB', 'qtd' => 3, 'preco' => 8000.00, 'desconto' => 0.00, 'imposto' => 14.00, 'dataa' => '2026-04-30', 'hora' => '14:20:00', 'conta' => 'C5', 'mesa' => null, 'empresa' => 1, 'usuario' => 1],
            ['idpedido' => 9, 'n_pedido' => 106, 'id_produto' => 18, 'descricao' => 'Cadeira Ergonomica', 'qtd' => 1, 'preco' => 120000.00, 'desconto' => 5000.00, 'imposto' => 14.00, 'dataa' => '2026-04-30', 'hora' => '15:45:00', 'conta' => 'C6', 'mesa' => null, 'empresa' => 1, 'usuario' => 1],
            ['idpedido' => 10, 'n_pedido' => 106, 'id_produto' => 19, 'descricao' => 'Mesa de Escritório', 'qtd' => 1, 'preco' => 85000.00, 'desconto' => 0.00, 'imposto' => 14.00, 'dataa' => '2026-04-30', 'hora' => '15:45:00', 'conta' => 'C6', 'mesa' => null, 'empresa' => 1, 'usuario' => 1],
        ];
    }

    /**
     * Simula a tabela de documentos fiscais (vendas/facturas)
     * Campos exigidos: idVenda, Produto_idProduto, Qtd, preconormal, iva, datavenda, hora,
     * N_fat, desconto, cliente, Usuario, Tipo_docum, iva_valor, caixa,
     * condicao, Justificacao, codigo_doc, Nome, assinatura, Hash,
     * referncia, n_cliente, Motivo, Descricao, Referencia_a, empresa
     */
    public static function tabela_venda(): array
    {
        return [
            ['idVenda' => 1, 'Produto_idProduto' => 10, 'Qtd' => 1, 'preconormal' => 350000.00, 'iva' => 14.00, 'datavenda' => '2026-04-20', 'hora' => '09:15:00', 'N_fat' => 'FT 2026/1', 'desconto' => 0.00, 'cliente' => 'João Silva', 'Usuario' => 1, 'Tipo_docum' => 'Fatura', 'iva_valor' => 49000.00, 'caixa' => 1, 'condicao' => 'Pronto Pagamento', 'Justificacao' => '', 'codigo_doc' => 'FT', 'Nome' => 'Computador Portátil', 'assinatura' => 'A1B2', 'Hash' => 'hash1', 'referncia' => 'REF1', 'n_cliente' => 1001, 'Motivo' => '', 'Descricao' => 'Computador Portátil', 'Referencia_a' => '', 'empresa' => 1],
            ['idVenda' => 2, 'Produto_idProduto' => 11, 'Qtd' => 2, 'preconormal' => 15000.00, 'iva' => 14.00, 'datavenda' => '2026-04-20', 'hora' => '09:15:00', 'N_fat' => 'FT 2026/1', 'desconto' => 0.00, 'cliente' => 'João Silva', 'Usuario' => 1, 'Tipo_docum' => 'Fatura', 'iva_valor' => 4200.00, 'caixa' => 1, 'condicao' => 'Pronto Pagamento', 'Justificacao' => '', 'codigo_doc' => 'FT', 'Nome' => 'Rato Sem Fios', 'assinatura' => 'A1B2', 'Hash' => 'hash1', 'referncia' => 'REF2', 'n_cliente' => 1001, 'Motivo' => '', 'Descricao' => 'Rato Sem Fios', 'Referencia_a' => '', 'empresa' => 1],
            ['idVenda' => 3, 'Produto_idProduto' => 12, 'Qtd' => 1, 'preconormal' => 45000.00, 'iva' => 14.00, 'datavenda' => '2026-04-21', 'hora' => '10:30:00', 'N_fat' => 'FP 2026/1', 'desconto' => 0.00, 'cliente' => 'Maria Oliveira', 'Usuario' => 1, 'Tipo_docum' => 'Fatura-Proforma', 'iva_valor' => 6300.00, 'caixa' => 1, 'condicao' => '30 Dias', 'Justificacao' => '', 'codigo_doc' => 'FP', 'Nome' => 'Teclado Mecânico', 'assinatura' => 'C3D4', 'Hash' => 'hash2', 'referncia' => 'REF3', 'n_cliente' => 1002, 'Motivo' => '', 'Descricao' => 'Teclado Mecânico', 'Referencia_a' => '', 'empresa' => 1],
            ['idVenda' => 4, 'Produto_idProduto' => 13, 'Qtd' => 2, 'preconormal' => 85000.00, 'iva' => 14.00, 'datavenda' => '2026-04-22', 'hora' => '11:45:00', 'N_fat' => 'FR 2026/1', 'desconto' => 0.00, 'cliente' => 'Empresa Lda', 'Usuario' => 1, 'Tipo_docum' => 'Fatura-Recibo', 'iva_valor' => 23800.00, 'caixa' => 1, 'condicao' => 'Pronto Pagamento', 'Justificacao' => '', 'codigo_doc' => 'FR', 'Nome' => 'Monitor 24"', 'assinatura' => 'E5F6', 'Hash' => 'hash3', 'referncia' => 'REF4', 'n_cliente' => 1003, 'Motivo' => '', 'Descricao' => 'Monitor 24"', 'Referencia_a' => '', 'empresa' => 1],
            ['idVenda' => 5, 'Produto_idProduto' => 14, 'Qtd' => 5, 'preconormal' => 3500.00, 'iva' => 14.00, 'datavenda' => '2026-04-23', 'hora' => '14:00:00', 'N_fat' => 'FT 2026/2', 'desconto' => 0.00, 'cliente' => 'Ana Costa', 'Usuario' => 1, 'Tipo_docum' => 'Fatura', 'iva_valor' => 2450.00, 'caixa' => 1, 'condicao' => 'Pronto Pagamento', 'Justificacao' => '', 'codigo_doc' => 'FT', 'Nome' => 'Cabo HDMI', 'assinatura' => 'G7H8', 'Hash' => 'hash4', 'referncia' => 'REF5', 'n_cliente' => 1004, 'Motivo' => '', 'Descricao' => 'Cabo HDMI', 'Referencia_a' => '', 'empresa' => 1],
            ['idVenda' => 6, 'Produto_idProduto' => 15, 'Qtd' => 1, 'preconormal' => 25000.00, 'iva' => 14.00, 'datavenda' => '2026-04-24', 'hora' => '15:20:00', 'N_fat' => 'RC 2026/1', 'desconto' => 0.00, 'cliente' => 'Pedro Santos', 'Usuario' => 1, 'Tipo_docum' => 'Recibo', 'iva_valor' => 0.00, 'caixa' => 1, 'condicao' => 'Pagamento Parcial', 'Justificacao' => '', 'codigo_doc' => 'RC', 'Nome' => 'Fones Bluetooth', 'assinatura' => 'I9J0', 'Hash' => 'hash5', 'referncia' => 'REF6', 'n_cliente' => 1005, 'Motivo' => '', 'Descricao' => 'Pagamento Fatura FT 2026/2', 'Referencia_a' => 'FT 2026/2', 'empresa' => 1],
            ['idVenda' => 7, 'Produto_idProduto' => 16, 'Qtd' => 1, 'preconormal' => 55000.00, 'iva' => 14.00, 'datavenda' => '2026-04-25', 'hora' => '16:40:00', 'N_fat' => 'FP 2026/2', 'desconto' => 1000.00, 'cliente' => 'Rui Neves', 'Usuario' => 1, 'Tipo_docum' => 'Fatura-Proforma', 'iva_valor' => 7560.00, 'caixa' => 1, 'condicao' => '30 Dias', 'Justificacao' => '', 'codigo_doc' => 'FP', 'Nome' => 'Disco Externo 1TB', 'assinatura' => 'K1L2', 'Hash' => 'hash6', 'referncia' => 'REF7', 'n_cliente' => 1006, 'Motivo' => '', 'Descricao' => 'Disco Externo 1TB', 'Referencia_a' => '', 'empresa' => 1],
            ['idVenda' => 8, 'Produto_idProduto' => 17, 'Qtd' => 3, 'preconormal' => 8000.00, 'iva' => 14.00, 'datavenda' => '2026-04-26', 'hora' => '08:50:00', 'N_fat' => 'FT 2026/3', 'desconto' => 0.00, 'cliente' => 'Susana Lima', 'Usuario' => 1, 'Tipo_docum' => 'Fatura', 'iva_valor' => 3360.00, 'caixa' => 1, 'condicao' => 'Pronto Pagamento', 'Justificacao' => '', 'codigo_doc' => 'FT', 'Nome' => 'Pen Drive 64GB', 'assinatura' => 'M3N4', 'Hash' => 'hash7', 'referncia' => 'REF8', 'n_cliente' => 1007, 'Motivo' => '', 'Descricao' => 'Pen Drive 64GB', 'Referencia_a' => '', 'empresa' => 1],
            ['idVenda' => 9, 'Produto_idProduto' => 18, 'Qtd' => 1, 'preconormal' => 120000.00, 'iva' => 14.00, 'datavenda' => '2026-04-27', 'hora' => '10:00:00', 'N_fat' => 'FR 2026/2', 'desconto' => 5000.00, 'cliente' => 'Tiago Mendes', 'Usuario' => 1, 'Tipo_docum' => 'Fatura-Recibo', 'iva_valor' => 16100.00, 'caixa' => 1, 'condicao' => 'Pronto Pagamento', 'Justificacao' => '', 'codigo_doc' => 'FR', 'Nome' => 'Cadeira Ergonomica', 'assinatura' => 'O5P6', 'Hash' => 'hash8', 'referncia' => 'REF9', 'n_cliente' => 1008, 'Motivo' => '', 'Descricao' => 'Cadeira Ergonomica', 'Referencia_a' => '', 'empresa' => 1],
            ['idVenda' => 10, 'Produto_idProduto' => 19, 'Qtd' => 1, 'preconormal' => 85000.00, 'iva' => 14.00, 'datavenda' => '2026-04-28', 'hora' => '11:10:00', 'N_fat' => 'FT 2026/4', 'desconto' => 0.00, 'cliente' => 'Vitor Borges', 'Usuario' => 1, 'Tipo_docum' => 'Fatura', 'iva_valor' => 11900.00, 'caixa' => 1, 'condicao' => 'Pronto Pagamento', 'Justificacao' => '', 'codigo_doc' => 'FT', 'Nome' => 'Mesa de Escritório', 'assinatura' => 'Q7R8', 'Hash' => 'hash9', 'referncia' => 'REF10', 'n_cliente' => 1009, 'Motivo' => '', 'Descricao' => 'Mesa de Escritório', 'Referencia_a' => '', 'empresa' => 1],
        ];
    }
}
