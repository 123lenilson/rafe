<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Modules\POS\Domain\Ports\Saida\TransacaoPort;
use App\Modules\POS\Adapters\Saida\MySQLTransacao;

use App\Modules\Stock\Domain\Ports\Saida\BuscadorDeProdutoPort;
use App\Modules\Stock\Domain\Ports\Saida\VerificadorDeStockPort;
use App\Modules\Stock\Domain\Ports\Saida\SubtrairStockPort;
use App\Modules\Stock\Domain\Ports\Saida\StockRepositorioPort;
use App\Modules\Stock\Adapters\Saida\MySQLStockRepositorio;

use App\Modules\Clientes\Domain\Ports\Saida\ClienteRepositorioPort;
use App\Modules\Clientes\Adapters\Saida\MySQLClienteRepositorio;

use App\Modules\POS\Domain\Ports\Saida\PedidoRepositorioPort;
use App\Modules\POS\Adapters\Saida\MySQLPedidoRepositorio;

use App\Modules\POS\Domain\Ports\Saida\DocumentoFiscalRepositorioPort;
use App\Modules\POS\Adapters\Saida\MySQLDocumentoFiscalRepositorio;

use App\Modules\Pagamentos\Domain\Ports\Saida\PagamentoRepositorioPort;
use App\Modules\Pagamentos\Adapters\Saida\MySQLPagamentoRepositorio;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind da Transação
        $this->app->bind(TransacaoPort::class, MySQLTransacao::class);

        // Bind do Stock
        $this->app->bind(BuscadorDeProdutoPort::class, MySQLStockRepositorio::class);
        $this->app->bind(VerificadorDeStockPort::class, MySQLStockRepositorio::class);
        $this->app->bind(SubtrairStockPort::class, MySQLStockRepositorio::class);
        $this->app->bind(StockRepositorioPort::class, MySQLStockRepositorio::class);

        // Bind dos Clientes
        $this->app->bind(ClienteRepositorioPort::class, MySQLClienteRepositorio::class);

        // Bind do POS
        $this->app->bind(PedidoRepositorioPort::class, MySQLPedidoRepositorio::class);
        $this->app->bind(DocumentoFiscalRepositorioPort::class, MySQLDocumentoFiscalRepositorio::class);

        // Bind de Pagamentos
        $this->app->bind(PagamentoRepositorioPort::class, MySQLPagamentoRepositorio::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
