// Incluir o caminho do arquivo proto
const PROTO_PATH = "./hotel.proto";

const grpc = require('grpc');

const protoLoader = require('@grpc/proto-loader');

// carregamento do arquivo proto e de definições
const packageDefinition = protoLoader.loadSync(
	PROTO_PATH,
	{keepCase: true,
	 longs: String,
	 enums: String,
	 defaults: true,
	 oneofs: true
	});

// carregamento do código do serviço
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition).quarto;

const hospede = new protoDescriptor.ServicoQuarto('127.0.0.1:50051',
									grpc.credentials.createInsecure());

const quarto = [
	{id: 0,
	nome: 'finalizado',
	preco: 0.0},
	{ id: 1,
	nome: "quarto simples",
	preco: 110.0},
	{ id: 2,
	nome: "quarto casal",
	preco: 260.0},
	{ id: 3,
	nome: "suite",
	preco: 400.0}
];

var readlineSync = require('readline-sync');

var call = null;

function finalizar() {
	client.ListarQuartos({}, function(err, response){
		if (err != null) {
			console.log("Ocorreu um erro ao acessar o  ListaQuartos");
			return;
		}

		console.log(" >>>>>>> Lista de Pedidos: " + JSON.stringify(response.quarto));

		client.FinalizaQuarto({}, function(err, response){
			if (err != null) {
				console.log("Ocorreu um erro ao acessar o  ListaQuartos");
				return;
			}

			console.log(response);
			console.log(" O preço da reserva é " + response.valor + ".");
		});

	});
}

// Chamadas assincronas uma chamada dentro da outra
function reserva() {
	input = readlineSync.prompt();

	console.log('(0 para finalizar) Quer adicionar algo a hospedagem? ');
	if (input === '0') {
		finalizar();
	} else if (input > quarto.length-1){
		console.log('(0 para finalizar) Entrada inválida. Tente novamente.');
		atendimento();
	} else {
		client.RegistrarReserva(lanche[input], function(err, response) {
			if (err != null) {
				console.log("Ocorreu um erro invocando o procedimento RegistrarReserva");
				return;
			}

			console.log("Hospedagem realizada com sucesso.");
			atendimento();
		});
	}
};

console.log("Menu: ", quarto);
console.log("Qual quarto deseja alugar? ");
atendimento();
