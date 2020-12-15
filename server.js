// definir o proto
const PROTO_PATH = "./hotel.proto";

const grpc = require('grpc');

const protoLoader = require('@grpc/proto-loader');

// carregar proto e definições
const packageDefinition = protoLoader.loadSync(
	PROTO_PATH,
	{keepCase: true,
	 longs: String,
	 enums: String,
	 defaults: true,
	 oneofs: true
	});

// carregar do código do serviço
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition).quarto;

const quarto = [
	{id: 0,
	nome: 'concluido',
	preco: 0.0},
	{ id: 1,
	nome: "Quarto Simples",
	preco: 110.0},
	{ id: 2,
	nome: "Quarto Casal",
	preco: 260.0},
	{ id: 3,
	nome: "suite",
	preco: 400.0}
];


const reserva = [];

function listarQuartos(call, callback) {
	callback(null, {
		quarto: reserva
	});
};

function registrarReserva(call, callback) {
	const quarto = {
		id: call.request.id,
		nome: call.request.nome,
		preco: call.request.preco,
	};

	reserva.push(quartos);

	callback(null, {});
};

function finalizaReserva(call, callback) {
	total = 0;

	reserva.forEach(function(d) {
		total += d.preco;
	});

	callback(null, {valor: total});
};

// Ibjeto do servidor
const server = new grpc.Server();

// Implementar as funções ao serviço exportador
server.addService(protoDescriptor.ServicoQuarto.service,
				  {
					  RegistrarReserva: registrarReserva,
					  ListarQuartos: listarQuartos,
					  FinalizaReserva: finalizaReserva
				  });

// Serviço e endereços na porta 50051 (without security)
server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());

// Que comecem os trabalhos
server.start();
