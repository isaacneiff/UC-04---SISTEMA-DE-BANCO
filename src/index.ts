/**
 * Crie um programa que simule as operações de uma conta corrente,
 * onde o cliente deve poder fazer o seguinte:
 * - Consultar saldo,
 * - Fazer um depósito,
 * - Fazer um saque
 * - Imprimir um extrato.
 * Utilize estruturas de dados em memória
 * para armazenar as informações da conta e
 * das operações feitas pela conta.
 */

import { randomUUID } from "node:crypto";
import Scanner from "@codeea/scanner";

type Conta = {
  nomeCliente: string;
  numero: number;
  agencia: number;
  saldo: number;
};

type Transacao = {
  id: string;
  valor: number;
  numeroConta: number;
  agencia: number;
  tipo: TipoTransacao;
  operacao: TipoOperacao;
};

type TipoTransacao = "C" | "D";

type TipoOperacao = "SAQ" | "DEP" | "TRANSF" | "PIX";

// Inicializo as minhas variáveis globais
let scanner: Scanner;
const contas: Conta[] = [];
const transacoes: Transacao[] = [];

async function main() {
  // TODO - Validar pelo menos 3 vezes quando estiver incorretos os dados
  const agencia = parseInt(
    await scanner.question("Informe o número da agência: ")
  );
  const numeroConta = parseInt(
    await scanner.question("Informe o número da conta: ")
  );
  let conta = localizarConta(agencia, numeroConta);
  let operacao = 0;

  // Clausula Guarda
  if (!conta) {
    console.log("Conta não encontrada!");
    return;
  }

  let continuarOperacoes = true;
  do {
    imprimeMenu();
    operacao = parseInt(await scanner.question("Informe a operação: "));

    // OPERACOES
    // 1 - SALDO
    // 2 - DEPOSITO
    // 3 - SAQUE
    // 4 - EXTRATO

    switch (operacao) {
      case 0:
        console.log("Obrigado por utilizar nossos serviços!\nVolte Sempre!");
        continuarOperacoes = false;
        break;
      case 1:
        const saldo = calcularSaldo(agencia, numeroConta);
        console.log(`${conta.nomeCliente}, o saldo da sua conta é de ${saldo}`);
        break;
      case 2:
        const valorDepositado = await scanner.questionFloat("Informe o valor")
        efetuarDeposito(agencia, numeroConta, valorDepositado)
        break

      default:
        console.log("Operação inválida");
        break;
    }
  } while (continuarOperacoes);
}

function imprimeMenu() {
  const menu = `
    1 - CONSULTAR SALDO
    2 - DEPÓSITAR
    3 - SACAR
    4 - EXTRATO
    0 - SAIR
  `;
  console.log(menu);
}

function inicializarBanco() {
  const conta: Conta = {
    nomeCliente: "Cezar Augusto Mezzalira",
    numero: 1234,
    agencia: 1,
    saldo: 100,
  };
  contas.push(conta);
  const transacao: Transacao = {
    id: randomUUID(),
    valor: 100,
    numeroConta: conta.numero,
    agencia: conta.agencia,
    tipo: "C",
    operacao: "DEP",
  };
  transacoes.push(transacao);
}

function localizarConta(agencia: number, numeroConta: number) {
  for (let conta of contas) {
    if (conta.agencia === agencia && conta.numero === numeroConta) {
      return conta;
    }
  }
}

function calcularSaldo(agencia: number, numeroConta: number) {
  // filtrar apenas as transacoes da conta
  let transacoesConta: Transacao[] = [];
  // for (let transacao of transacoes) {
  //   if (
  //     transacao.agencia === agencia &&
  //     transacao.numeroConta === numeroConta
  //   ) {
  //     transacoesConta.push(transacao);
  //   }
  // }

  transacoesConta = transacoes.filter(
    (transacao) =>
      transacao.agencia === agencia && transacao.numeroConta === numeroConta
  );

  if (transacoesConta.length === 0) {
    return 0;
  }

  // calcular os valores baseados no tipo de transacao
  let saldo = 0;

  for (const transacao of transacoesConta) {
    // C - CRÉDITO (SOMA NO TOTAL)
    // D - DÉBITO (SUBTRAI DO TOTAL)
    if (transacao.tipo === "C") {
      saldo += transacao.valor;
    } else {
      // SEMPRE SERÁ D
      saldo -= transacao.valor;
    }
  }
  return saldo;
}

function efetuarDeposito (agencia: number, numeroConta: number, valorDepositado: number){
  //buscar a conta e atualizar o saldo
  for (let conta of contas){
    if (conta.agencia === agencia && conta.numero === numeroConta){
      conta.saldo += valorDepositado
      break
    }
  }
  //cria a transação de entrada
  const transacao: Transacao = {
    id: randomUUID(),
    valor: valorDepositado,
    numeroConta: numeroConta,
    agencia: agencia,
    tipo: "C",
    operacao: "DEP"
  }

  transacoes.push(transacao)
  //

}

// Executa o programa
(async () => {
  scanner = new Scanner();
  inicializarBanco();
  await main();
  scanner.close();
})();
