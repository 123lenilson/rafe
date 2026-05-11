# language: pt

Funcionalidade: Gerir um pedido no POS
  Para conseguir registar os produtos que o cliente quer comprar
  Como operador de caixa
  Eu quero poder abrir um pedido, adicionar itens e validá-los

  Cenário: Iniciar um pedido para um cliente existente com sucesso
    Dado que o cliente com ID "100" existe no sistema
    Quando eu inicio um novo pedido para o cliente "100"
    Então um novo pedido é aberto com sucesso
    E fica associado ao cliente "100"

  Cenário: Iniciar um pedido para um consumidor final
    Dado que não é especificado nenhum cliente
    Quando eu inicio um novo pedido
    Então um novo pedido é aberto com sucesso
    E é registado como Consumidor Final

  Cenário: Tentar iniciar um pedido com um cliente inexistente
    Dado que o cliente com ID "999" não existe no sistema
    Quando eu tento iniciar um novo pedido para o cliente "999"
    Então o sistema rejeita a operação com o erro "Cliente não encontrado"

  Cenário: Adicionar um item válido ao pedido
    Dado que tenho um pedido aberto
    E o produto com ID "10" existe e tem "50" unidades em stock
    Quando eu adiciono "2" unidades do produto "10" ao pedido
    Então o pedido passa a conter o produto "10" com a quantidade "2"

  Cenário: Tentar adicionar um produto sem stock
    Dado que tenho um pedido aberto
    E o produto com ID "15" existe mas tem apenas "1" unidade em stock
    Quando eu tento adicionar "2" unidades do produto "15" ao pedido
    Então o sistema rejeita a operação com o erro "Stock insuficiente"

  Cenário: Tentar adicionar um produto que não existe no sistema
    Dado que tenho um pedido aberto
    E o produto com ID "99" não existe no sistema
    Quando eu tento adicionar "1" unidade do produto "99" ao pedido
    Então o sistema rejeita a operação com o erro "Produto não encontrado"

  Cenário: Iniciar um pedido delega a geração do n_pedido ao repositório
    Dado que o repositório está pronto para receber um novo pedido
    E o repositório vai gerar o n_pedido "1"
    Quando eu inicio um novo pedido
    Então o n_pedido retornado deve ser "1"
    E o n_pedido não deve ser um número aleatório

  Cenário: Item adicionado ao pedido tem desconto zero
    Dado que tenho um pedido aberto com n_pedido "1"
    E o produto com ID "10" existe e tem "50" unidades em stock
    Quando eu adiciono "2" unidades do produto "10" ao pedido
    Então o item no pedido deve ter desconto de exactamente "0.0"
