<?php

namespace App\Modules\POS\Domain;

/**
 * DocumentoFiscal
 *
 * Representa um documento fiscal emitido (Fatura, Fatura-Recibo, etc.).
 * Pertence ao Domain do módulo POS.
 *
 * Localização: app/Modules/POS/Domain/DocumentoFiscal.php
 *
 * Responsabilidades:
 *  - Agregar as LinhaVenda do documento emitido
 *  - Validar o tipo de documento
 *  - Não permitir documento sem linhas
 *  - Calcular total ilíquido, total IVA, total retenção e valor a pagar
 *
 * Regras:
 *  - É imutável após criação — representa o documento tal como foi emitido
 *  - total ilíquido = soma dos subtotaisComDesconto de todas as linhas
 *  - total IVA = soma do valorImposto das linhas que NÃO são retenção
 *  - total retenção = soma do valorImposto das linhas que SÃO retenção
 *  - valor a pagar = total ilíquido + total IVA
 *  - Retenção é informativa — não soma ao valor a pagar
 *  - Número e código do documento são gerados pelo Service — o Domain não conhece BD
 */
class DocumentoFiscal
{
    private const TIPOS_VALIDOS = [
        'Fatura',
        'Fatura-Recibo',
        'Factura-Proforma',
        'Orçamento',
    ];

    /** @var LinhaVenda[] */
    private array $linhas;

    /**
     * @param LinhaVenda[] $linhas
     */
    public function __construct(
        private readonly string $tipo,
        array $linhas,
        private ?int $idDocumento = null
    ) {
        $this->validarTipo();
        $this->validarLinhas($linhas);
        $this->linhas = $linhas;
    }

    public function idDocumento(): ?int
    {
        return $this->idDocumento;
    }

    public function definirIdDocumento(int $id): void
    {
        $this->idDocumento = $id;
    }

    // ─── Validação ────────────────────────────────────────────────────────────

    private function validarTipo(): void
    {
        if (!in_array($this->tipo, self::TIPOS_VALIDOS, strict: true)) {
            throw new \DomainException('Tipo de documento inválido');
        }
    }

    private function validarLinhas(array $linhas): void
    {
        if (empty($linhas)) {
            throw new \DomainException('Documento fiscal não pode ser criado sem linhas');
        }
    }

    // ─── Consultas ────────────────────────────────────────────────────────────

    public function tipo(): string
    {
        return $this->tipo;
    }

    /**
     * Devolve todas as linhas do documento.
     *
     * @return LinhaVenda[]
     */
    public function linhas(): array
    {
        return $this->linhas;
    }

    /**
     * Número de linhas distintas no documento.
     */
    public function totalLinhas(): int
    {
        return count($this->linhas);
    }

    // ─── Cálculos ─────────────────────────────────────────────────────────────

    /**
     * Soma dos subtotais com desconto de todas as linhas (sem imposto).
     * total ilíquido = Σ subtotalComDesconto por linha
     */
    public function totalIliquido(): float
    {
        return array_reduce(
            $this->linhas,
            fn(float $soma, LinhaVenda $linha) => $soma + $linha->subtotalComDesconto(),
            0.0
        );
    }

    /**
     * Soma do IVA de todas as linhas que NÃO têm retenção.
     */
    public function totalIva(): float
    {
        return array_reduce(
            $this->linhas,
            function (float $soma, LinhaVenda $linha): float {
                if (!$linha->temRetencao()) {
                    return $soma + $linha->valorImposto();
                }
                return $soma;
            },
            0.0
        );
    }

    /**
     * Soma da retenção de todas as linhas que TÊM retenção.
     * Valor informativo — não entra no valor a pagar.
     */
    public function totalRetencao(): float
    {
        return array_reduce(
            $this->linhas,
            function (float $soma, LinhaVenda $linha): float {
                if ($linha->temRetencao()) {
                    return $soma + $linha->valorImposto();
                }
                return $soma;
            },
            0.0
        );
    }

    /**
     * Valor total que o cliente deve pagar.
     * valor a pagar = total ilíquido + total IVA
     * Retenção NÃO soma — é informativa no documento.
     */
    public function valorAPagar(): float
    {
        return $this->totalIliquido() + $this->totalIva();
    }
}