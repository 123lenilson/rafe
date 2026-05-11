<?php

declare(strict_types=1);

namespace App\Modules\POS\Adapters\Saida;

use App\Modules\POS\Domain\Ports\Saida\DocumentoFiscalRepositorioPort;
use App\Modules\POS\Domain\DocumentoFiscal;
use App\Modules\POS\Domain\LinhaVenda;
use App\Models\Venda;

class MySQLDocumentoFiscalRepositorio implements DocumentoFiscalRepositorioPort
{
    public function salvar(DocumentoFiscal $documento): int
    {
        $proximoNumero = $this->proximoNumeroDocumento();
        $prefix = str_contains(strtolower($documento->tipo()), 'recibo') ? 'FR' : 'FT';
        $codigoDoc = $prefix . ' ' . date('Y') . '/' . $proximoNumero;

        $idPrimeiraInsercao = null;

        foreach ($documento->linhas() as $linha) {
            $venda = Venda::create([
                'Produto_idProduto' => $linha->idProduto(),
                'Qtd' => $linha->quantidade(),
                'preconormal' => $linha->preco(),
                'iva' => $linha->imposto(),
                'datavenda' => date('Y-m-d'),
                'hora' => date('H:i:s'),
                'N_fat' => $proximoNumero,
                'codigo_doc' => $codigoDoc,
                'desconto' => $linha->desconto(),
                'cliente' => 36, // ID do "Consumidor Final" na tabela cliente
                'Tipo_docum' => $documento->tipo(),
                'iva_valor' => $linha->valorImposto(),
                'caixa' => 1,
                'condicao' => 'Pronto Pagamento',
                'Nome' => $linha->descricao(),
                'Descricao' => $linha->descricao(),
                'empresa' => 1,
                'Usuario' => 1
            ]);
            
            if (!$idPrimeiraInsercao) {
                $idPrimeiraInsercao = $venda->idVenda;
            }
        }

        $documento->definirIdDocumento($idPrimeiraInsercao);
        return $idPrimeiraInsercao;
    }

    public function proximoNumeroDocumento(): int
    {
        $max = Venda::max('idVenda');
        return $max ? $max + 1 : 1;
    }

    public function buscarPorId(int $id): ?DocumentoFiscal
    {
        $vendaRef = Venda::find($id);
        if (!$vendaRef) {
            return null;
        }

        $linhas = Venda::where('N_fat', $vendaRef->N_fat)->get();

        $linhasVenda = $linhas->map(fn($v) => new LinhaVenda(
            (int) $v->Produto_idProduto,
            (string) $v->Descricao,
            (int) $v->Qtd,
            (float) $v->preconormal,
            (float) $v->desconto,
            (float) $v->iva
        ))->all();

        return new DocumentoFiscal(
            $vendaRef->Tipo_docum,
            $linhasVenda,
            $id
        );
    }
}
