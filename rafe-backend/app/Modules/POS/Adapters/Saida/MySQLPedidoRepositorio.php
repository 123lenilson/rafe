<?php

declare(strict_types=1);

namespace App\Modules\POS\Adapters\Saida;

use App\Modules\POS\Domain\Ports\Saida\PedidoRepositorioPort;
use App\Modules\POS\Domain\Pedido;
use App\Modules\POS\Domain\ItemPedido;
use App\Models\PedidoTabela;

class MySQLPedidoRepositorio implements PedidoRepositorioPort
{
    public function buscarPorId(int $id): ?Pedido
    {
        $linhas = PedidoTabela::where('n_pedido', $id)->get();
        if ($linhas->isEmpty()) return null;

        $itens = [];
        foreach ($linhas as $linha) {
            $itens[] = new ItemPedido(
                (int) $linha->id_produto,
                (string) $linha->descricao,
                (int) $linha->qtd,
                (float) $linha->preco,
                (float) $linha->desconto,
                (float) $linha->imposto
            );
        }

        return new Pedido($itens, $id);
    }

    public function salvar(Pedido $pedido): int
    {
        $n_pedido = $pedido->idPedido();

        if ($n_pedido) {
            PedidoTabela::where('n_pedido', $n_pedido)->delete();
        }

        foreach ($pedido->itens() as $item) {
            PedidoTabela::create([
                'n_pedido' => $n_pedido,
                'id_produto' => $item->idProduto(),
                'descricao' => $item->descricao(),
                'qtd' => $item->quantidade(),
                'preco' => $item->preco(),
                'desconto' => $item->desconto(),
                'imposto' => $item->imposto(),
                'dataa' => date('Y-m-d'),
                'hora' => date('H:i:s'),
                'empresa' => 1,
                'usuario' => 1
            ]);
        }

        return $n_pedido;
    }

    public function eliminar(int $idPedido): void
    {
        PedidoTabela::where('n_pedido', $idPedido)->delete();
    }

    public function proximoNumeroPedido(): int
    {
        $max = PedidoTabela::max('n_pedido');
        return $max ? $max + 1 : 1;
    }
}
