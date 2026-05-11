# language: pt

Funcionalidade: Finalizar venda e emitir documento fiscal
  Para concluir o atendimento ao cliente
  Como operador de caixa
  Eu quero poder finalizar um pedido aberto, registar o pagamento e emitir a fatura

  Cenário: Sucesso ao finalizar uma venda
    Dado que tenho o pedido aberto "1" com o produto "10" na quantidade "2"
    E o método de pagamento será "numerario" entregando o valor exato
    Quando eu finalizo a venda do pedido "1" para emissão de "Fatura-Recibo"
    Então o pedido "1" é convertido no Documento Fiscal "1"
    E o pagamento é registado
    E o stock do produto "10" é reduzido
    E o pedido aberto "1" deixa de existir na lista de espera
 
  Cenário: Falha ao tentar finalizar um pedido sem itens
    Dado que tenho um pedido aberto "2" sem qualquer item adicionado
    Quando eu tento finalizar a venda do pedido "2"
    Então o sistema rejeita a operação com o erro "Pedido não pode estar vazio"

  Cenário: Falha por stock insuficiente no momento do checkout
    Dado que tenho o pedido aberto "3" com o produto "15" na quantidade "2"
    Mas entretanto o stock do produto "15" desceu para "1"
    Quando eu tento finalizar a venda do pedido "3"
    Então o sistema rejeita a operação com o erro "Stock insuficiente no momento do checkout"

  Cenário: Falha na atomicidade por erro de pagamento (Rollback)
    Dado que tenho o pedido aberto "4" com produtos válidos em stock
    Mas o TPA rejeita o pagamento por cartão
    Quando eu tento finalizar a venda do pedido "4"
    Então o sistema rejeita a operação com o erro "Falha no registo de pagamento"
    E o pedido "4" continua na lista de espera intacto
    E o stock dos produtos não é reduzido
