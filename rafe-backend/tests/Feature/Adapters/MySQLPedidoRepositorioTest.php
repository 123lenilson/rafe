<?php

namespace Tests\Feature\Adapters;

use Tests\TestCase;
use App\Modules\POS\Adapters\Saida\MySQLPedidoRepositorio;
use App\Modules\POS\Domain\Pedido;
use App\Modules\POS\Domain\ItemPedido;
use App\Models\PedidoTabela;

class MySQLPedidoRepositorioTest extends TestCase
{
    // Removido RefreshDatabase pois não temos Migrations legadas no Laravel
    // Para rodar este teste, será necessário um DB_DATABASE de testes no WAMP.

    public function test_deve_retornar_nulo_se_pedido_nao_existir()
    {
        // Pula o teste caso a BD não esteja configurada para testes reais
        $this->markTestSkipped('Teste de integração requer base de dados MySQL de testes com tabelas legadas criadas.');

        $repositorio = new MySQLPedidoRepositorio();
        $pedido = $repositorio->buscarPorId(99999);
        
        $this->assertNull($pedido);
    }
}
