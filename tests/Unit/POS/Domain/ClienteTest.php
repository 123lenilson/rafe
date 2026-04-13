<?php

namespace Tests\Unit\POS\Domain;

use App\Modules\POS\Domain\Cliente;
use Tests\TestCase;

class ClienteTest extends TestCase
{
    // ══════════════════════════════════════════
    // CAMINHO FELIZ
    // ══════════════════════════════════════════

    public function test_cria_cliente_com_nome_apenas(): void
    {
        $cliente = new Cliente(nome: 'Empresa XPTO');

        $this->assertEquals('Empresa XPTO', $cliente->nome());
        $this->assertNull($cliente->email());
        $this->assertNull($cliente->nif());
        $this->assertNull($cliente->telefone());
        $this->assertNull($cliente->morada());
    }

    public function test_cria_cliente_com_todos_os_campos(): void
    {
        $cliente = new Cliente(
            nome: 'Empresa XPTO',
            nif: '5417093892',
            email: 'geral@xpto.ao',
            telefone: '923000000',
            morada: 'Luanda, Angola'
        );

        $this->assertEquals('Empresa XPTO', $cliente->nome());
        $this->assertEquals('5417093892', $cliente->nif());
        $this->assertEquals('geral@xpto.ao', $cliente->email());
        $this->assertEquals('923000000', $cliente->telefone());
        $this->assertEquals('Luanda, Angola', $cliente->morada());
    }

    public function test_cria_consumidor_final(): void
    {
        $cliente = new Cliente(nome: 'Consumidor Final');
        $this->assertTrue($cliente->isConsumidorFinal());
    }

    public function test_cliente_normal_nao_e_consumidor_final(): void
    {
        $cliente = new Cliente(nome: 'Empresa XPTO');
        $this->assertFalse($cliente->isConsumidorFinal());
    }

    public function test_nome_e_limpo_automaticamente(): void
    {
        $cliente = new Cliente(nome: '  Empresa XPTO  ');
        $this->assertEquals('Empresa XPTO', $cliente->nome());
    }

    public function test_aceita_email_valido(): void
    {
        $cliente = new Cliente(nome: 'Empresa XPTO', email: 'geral@xpto.ao');
        $this->assertEquals('geral@xpto.ao', $cliente->email());
    }

    public function test_aceita_email_nulo(): void
    {
        $cliente = new Cliente(nome: 'Empresa XPTO', email: null);
        $this->assertNull($cliente->email());
    }

    public function test_aceita_nif_numerico_valido(): void
    {
        $cliente = new Cliente(nome: 'Empresa XPTO', nif: '5417093892');
        $this->assertEquals('5417093892', $cliente->nif());
    }

    public function test_aceita_nif_nulo(): void
    {
        $cliente = new Cliente(nome: 'Empresa XPTO', nif: null);
        $this->assertNull($cliente->nif());
    }

    // ══════════════════════════════════════════
    // REGRAS DE NEGÓCIO
    // ══════════════════════════════════════════

    public function test_nao_permite_nome_vazio(): void
    {
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Nome do cliente é obrigatório');

        new Cliente(nome: '');
    }

    public function test_nao_permite_nome_apenas_espacos(): void
    {
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Nome do cliente é obrigatório');

        new Cliente(nome: '   ');
    }

    public function test_nao_permite_email_invalido(): void
    {
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('Email inválido');

        new Cliente(nome: 'Empresa XPTO', email: 'isto-nao-e-email');
    }

    public function test_nao_permite_nif_com_letras(): void
    {
        $this->expectException(\DomainException::class);
        $this->expectExceptionMessage('NIF inválido');

        new Cliente(nome: 'Empresa XPTO', nif: '54ABC93892');
    }
}