<?php

declare(strict_types=1);

namespace App\Modules\POS\Adapters\Saida\Fakes;

use App\Modules\POS\Domain\Pedido;
use App\Modules\POS\Domain\Ports\Saida\PedidoRepositorioPort;

class FakePedidoRepositorio implements PedidoRepositorioPort
{
    private array $tabela_pedido = [];

    public function __construct()
    {
        $this->tabela_pedido = FakePOSSeeder::tabela_pedido();
    }

    public function proximoNumeroPedido(): int
    {
        return 1;
    }

    public function salvar(Pedido $pedido): int
    {
        $id = $pedido->idPedido() ?? random_int(1000, 9999);
        $pedido->definirIdPedido($id);
        
        // Remove linhas antigas deste pedido
        $this->tabela_pedido = array_filter(
            $this->tabela_pedido,
            fn($linha) => $linha['n_pedido'] !== $id
        );

        // Insere as novas linhas
        foreach ($pedido->itens() as $item) {
            $this->tabela_pedido[] = [
                'idpedido' => count($this->tabela_pedido) + 1,
                'n_pedido' => $id,
                'id_produto' => $item->idProduto(),
                'descricao' => $item->descricao(),
                'qtd' => $item->quantidade(),
                'preco' => $item->preco(),
                'desconto' => $item->desconto(),
                'imposto' => $item->imposto(),
                'dataa' => date('Y-m-d'),
                'hora' => date('H:i:s'),
                'conta' => null,
                'mesa' => null,
                'empresa' => 1,
                'usuario' => 1,
            ];
        }

        return $id;
    }

    public function buscarPorId(int $id): ?Pedido
    {
        $linhas = array_filter(
            $this->tabela_pedido,
            fn($linha) => $linha['n_pedido'] === $id
        );

        if (empty($linhas)) {
            return null;
        }

        $itens = [];
        foreach ($linhas as $linha) {
            $itens[] = new \App\Modules\POS\Domain\ItemPedido(
                (int)$linha['id_produto'],
                $linha['descricao'],
                (int)$linha['qtd'],
                (float)$linha['preco'],
                (float)$linha['desconto'],
                (float)$linha['imposto']
            );
        }

        return new Pedido($itens, $id);
    }

    public function eliminar(int $id): void
    {
        // Remove da tabela_pedido onde n_pedido = $id
        $this->tabela_pedido = array_filter(
            $this->tabela_pedido,
            fn($linha) => $linha['n_pedido'] !== $id
        );
    }

    /**
     * Métodos auxiliares de teste (fora do Port)
     */
    public function definirPedido(array $linha): void
    {
        $this->tabela_pedido[] = $linha;
    }

    public function pedidoActual(int $idpedido): ?array
    {
        foreach ($this->tabela_pedido as $linha) {
            if ($linha['idpedido'] === $idpedido) {
                return $linha;
            }
        }
        return null;
    }
}
