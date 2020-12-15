// definição do caminho do arquivo proto
const PROTO_PATH = "./restaurant.proto";

const grpc = require('grpc');

const protoLoader = require('@grpc/proto-loader');

// carregamento do arquivo proto e geração das definições
const packageDefinition = protoLoader.loadSync(
	PROTO_PATH,
	{keepCase: true,
	 longs: String,
	 enums: String,
	 defaults: true,
	 oneofs: true
	});

// carregamento do código do serviço
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition).lanche;

const lanche = [
	{id: 0,
	nome: 'finalizado',
	preco: 0.0},
	{ id: 1,
	nome: "hamburguer",
	preco: 15.0},
	{ id: 2,
	nome: "pizza",
	preco: 25.0},
	{ id: 3,
	nome: "refri",
	preco: 5.0}
];

// "banco de dados" de carros
const pedido = [];

function listarLanches(call, callback) {
	callback(null, {
		lanches: pedido
	});
};

function registrarPedido(call, callback) {
	const lanche = {
		id: call.request.id,
		nome: call.request.nome,
		preco: call.request.preco,
	};

	pedido.push(lanche);

	callback(null, {});
};

function finalizaPedido(call, callback) {
	total = 0;

	pedido.forEach(function(d) {
		total += d.preco;
	});

	callback(null, {valor: total});
};

// instancia objeto do servidor
const server = new grpc.Server();

// adiciona as implementações das funções ao serviço exportado de carro
server.addService(protoDescriptor.ServicoLanche.service,
				  {
					  RegistrarPedido: registrarPedido,
					  ListarLanches: listarLanches,
					  FinalizaPedido: finalizaPedido
				  });

// associa o serviço a todos os endereços e a porta 50051 (sem segurança)
server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());

// inicia o serviço
server.start();
