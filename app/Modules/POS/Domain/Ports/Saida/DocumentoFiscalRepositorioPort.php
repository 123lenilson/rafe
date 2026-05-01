<?php

declare(strict_types=1);

namespace App\Modules\POS\Domain\Ports\Saida;

use App\Modules\POS\Domain\DocumentoFiscal;

/**
 * Interface DocumentoFiscalRepositorioPort
 *
 * Contrato de saída para persistência da entidade DocumentoFiscal.
 */
interface DocumentoFiscalRepositorioPort
{
    /**
     * Salva o documento fiscal e devolve o seu ID gerado (n_fat).
     */
    public function salvar(DocumentoFiscal $documento): int;

    public function buscarPorId(int $id): ?DocumentoFiscal;

    /**
     * Obtém o próximo número de documento fiscal disponível.
     */
    public function proximoNumeroDocumento(): int;
}
