<?php

namespace App\Modules\Clientes\Adapters\Saida\Fakes;

class FakeClientesSeeder
{
    public static function tabela_cliente(): array
    {
        return [
            ['idcliente' => 1,  'nome' => 'João Manuel Silva', 'nif' => '540123456', 'email' => 'joao.silva@mail.ao',    'telefone' => '923000111', 'morada' => 'Maianga', 'endereco' => 'Rua Direita', 'empresa' => 1, 'usuario' => 1],
            ['idcliente' => 2,  'nome' => 'Ana Paula Santos', 'nif' => '540987654', 'email' => 'ana.p@santos.co.ao',    'telefone' => '912555444', 'morada' => 'Talatona', 'endereco' => 'Condomínio Girassol', 'empresa' => 1, 'usuario' => 1],
            ['idcliente' => 3,  'nome' => 'Teresa Oliveira',  'nif' => '510222333', 'email' => 'teresa.ol@gmail.com',  'telefone' => '931777888', 'morada' => 'Viana', 'endereco' => 'Projecto Sequele', 'empresa' => 1, 'usuario' => 1],
            ['idcliente' => 4,  'nome' => 'Ricardo Jorge',    'nif' => '541555666', 'email' => 'ricardo.j@empresa.ao', 'telefone' => '944000999', 'morada' => 'Benfica', 'endereco' => 'Zona Verde', 'empresa' => 1, 'usuario' => 1],
            ['idcliente' => 5,  'nome' => 'Maria da Luz',     'nif' => '520444111', 'email' => 'mluz.luz@outlook.com', 'telefone' => '925111222', 'morada' => 'Cassequel', 'endereco' => 'Bairro Operário', 'empresa' => 1, 'usuario' => 1],
            ['idcliente' => 6,  'nome' => 'Carlos Amado',     'nif' => '540333777', 'email' => 'carlos.am@net.ao',     'telefone' => '917666333', 'morada' => 'Sambizanga', 'endereco' => 'Rua da Fé', 'empresa' => 1, 'usuario' => 1],
            ['idcliente' => 7,  'nome' => 'Beatriz Costa',    'nif' => '540000123', 'email' => 'bea.costa@vendas.ao',  'telefone' => '938222555', 'morada' => 'Kilamba', 'endereco' => 'Edifício X20', 'empresa' => 1, 'usuario' => 1],
            ['idcliente' => 8,  'nome' => 'Daniel Ferreira',  'nif' => '541888999', 'email' => 'dani.fer@prime.ao',    'telefone' => '949333444', 'morada' => 'Cazenga', 'endereco' => 'Rua do Comércio', 'empresa' => 1, 'usuario' => 1],
            ['idcliente' => 9,  'nome' => 'Helena Matos',     'nif' => '510777222', 'email' => 'hmatos@suporte.ao',    'telefone' => '922444777', 'morada' => 'Alvalade', 'endereco' => 'Av. Comandante Gika', 'empresa' => 1, 'usuario' => 1],
            ['idcliente' => 10, 'nome' => 'Samuel André',     'nif' => '540666555', 'email' => 'samuel.andre@work.ao', 'telefone' => '911888111', 'morada' => 'Mutamba', 'endereco' => 'Largo do Kinaxixi', 'empresa' => 1, 'usuario' => 1],
            ['idcliente' => 11, 'nome' => 'Fátima Ventura',   'nif' => '520111999', 'email' => 'fventura@loja.ao',     'telefone' => '932999000', 'morada' => 'Golf 2', 'endereco' => 'Rua da Unidade', 'empresa' => 1, 'usuario' => 1],
            ['idcliente' => 12, 'nome' => 'Inácio Gouveia',   'nif' => '541333444', 'email' => 'inacio.g@gestao.com',  'telefone' => '944777222', 'morada' => 'Prenda', 'endereco' => 'Bloco B4', 'empresa' => 1, 'usuario' => 1],
            ['idcliente' => 13, 'nome' => 'Marta Afonso',     'nif' => '540222000', 'email' => 'marta.af@vendas.ao',   'telefone' => '926000333', 'morada' => 'Patrice Lumumba', 'endereco' => 'Rua 1', 'empresa' => 1, 'usuario' => 1],
            ['idcliente' => 14, 'nome' => 'Nelson Paim',      'nif' => '540777888', 'email' => 'nelson.paim@log.ao',   'telefone' => '919111444', 'morada' => 'Cacuaco', 'endereco' => 'Vila Sede', 'empresa' => 1, 'usuario' => 1],
            ['idcliente' => 15, 'nome' => 'Rosa Domingos',    'nif' => '510555333', 'email' => 'rosa.dom@casa.ao',     'telefone' => '935888222', 'morada' => 'Rocha Pinto', 'endereco' => 'Sector 5', 'empresa' => 1, 'usuario' => 1],
        ];
    }
}
