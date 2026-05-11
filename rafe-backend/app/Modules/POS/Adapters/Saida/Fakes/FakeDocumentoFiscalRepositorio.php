<?php

declare(strict_types=1);

namespace App\Modules\POS\Adapters\Saida\Fakes;

use App\Modules\POS\Domain\DocumentoFiscal;
use App\Modules\POS\Domain\Ports\Saida\DocumentoFiscalRepositorioPort;

class FakeDocumentoFiscalRepositorio implements DocumentoFiscalRepositorioPort
{
    private array $tabela_venda = [];

    public function __construct()
    {
        $this->tabela_venda = FakePOSSeeder::tabela_venda();
    }

    public function proximoNumeroDocumento(): int
    {
        return count($this->tabela_venda) > 0 
            ? max(array_column($this->tabela_venda, 'idVenda')) + 1 
            : 1;
    }

    public function salvar(DocumentoFiscal $documento): int
    {
        $id = $documento->idDocumento() ?? $this->proximoNumeroDocumento();
        $documento->definirIdDocumento($id);

        foreach ($documento->linhas() as $linha) {
            $this->tabela_venda[] = [
                'idVenda' => count($this->tabela_venda) + 1,
                'Produto_idProduto' => $linha->idProduto(),
                'Qtd' => $linha->quantidade(),
                'preconormal' => $linha->preco(),
                'iva' => $linha->imposto(),
                'datavenda' => date('Y-m-d'),
                'hora' => date('H:i:s'),
                'N_fat' => $id,
                'desconto' => $linha->desconto(),
                'cliente' => 100, // Fake estático
                'Usuario' => 1,
                'Tipo_docum' => $documento->tipo(),
                'iva_valor' => $linha->valorImposto(),
                'caixa' => 'Caixa 1',
                'condicao' => 'Pronto Pagamento',
                'Justificacao' => null,
                'codigo_doc' => 'FR ' . date('Y') . '/' . $id,
                'Nome' => $linha->descricao(),
                'assinatura' => 'hash_fake',
                'Hash' => 'hash_fake',
                'referncia' => '',
                'n_cliente' => '',
                'Motivo' => '',
                'Descricao' => '',
                'Referencia_a' => '',
                'empresa' => 1,
            ];
        }

        return $id;
    }

    public function buscarPorId(int $id): ?DocumentoFiscal
    {
        // Simplificado: retorna nulo pois não é lido no processo de venda
        return null;
    }

    /**
     * Métodos auxiliares de teste (fora do Port)
     */
    public function vendaActual(int $idVenda): ?array
    {
        foreach ($this->tabela_venda as $linha) {
            if ($linha['idVenda'] === $idVenda) {
                return $linha;
            }
        }
        return null;
    }

    public function totalDocumentos(): int
    {
        return count($this->tabela_venda);
    }
}
