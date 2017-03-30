module.exports = function(app){

  app.get('/pagamentos', function(req, res){
    console.log('Recebida requisição de teste.');
    res.send('OK.');
  });

  app.put('/pagamentos/pagamento/:id', function(req, res){

    var pagamento = {};
    var id = req.params.id;

    pagamento.id = id;
    pagamento.status = 'CONFIRMADO';

    var connection = app.database.connectionFactory();
    var pagamentoDao = app.database.pagamentoDao(connection);

    pagamentoDao.atualiza(pagamento, function(erro){
        if(erro){
          res.status(500).send(erro);
          return;
        }
        res.send(pagamento);
    });

  });

  app.post('/pagamentos/pagamento', function(req, res){

    req.assert("forma_de_pagamento", "Forma de pagamento eh obrigatorio").notEmpty();
    req.assert("valor", "Valor deve ser decimal, obrigatorio").notEmpty().isFloat();

    var erros = req.validationErros();

    if(erros){
      console.log('Erros de validação encontrados');
      res.status(400).send(erros);

      return;
    }

    var pagamento = req.body;

    pagamento.status = 'CRIADO';
    pagamento.data = new Date;

    var connection = app.database.connectionFactory();
    var pagamentoDao = app.database.pagamentoDao(connection);

    pagamentoDao.salva(pagamento, function(erro, resultado){
      if(erro){
        console.log('Erro ao inserir no banco: ' + erro);
        res.status(500).send(erro);
      } else {
        console.log('Pagamento criado');
        res.location('/pagamentos/pagamento/' + resultado.insertId);

        res.status(201).json(pagamento);
      }

    });

  });

  app.delete('/pagamentos/pagamento/:id', function(req, res){

    var pagamento = {};
    var id = req.params.id;

    pagamento.id = id;
    pagamento.status = 'CANCELADO';

    var connection = app.database.connectionFactory();
    var pagamentoDao = app.database.pagamentoDao(connection);

    pagamentoDao.atualiza(pagamento, function(erro){
      if(erro){
        res.status(500).send(erro);
        return;
      }
      console.log('Pagamento cancelado');
      res.location('/pagamentos/pagamento/' + resultado.insertId);

      res.status(204).json(pagamento);
    })

  })

};
