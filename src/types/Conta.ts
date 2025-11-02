import { Transacao } from "./Transacao.js"; 
import { TipoTransacao } from "./TipoTransacao.js";

let saldo: number = 3000;

function depositar(valor: number): void {
    if (valor <= 0) {
        throw new Error("Valor deve ser maior que zero")
    }
    saldo += valor;
}

function debitar(valor: number): void {
    if (valor <= 0) {
        throw new Error("Valor deve ser maior que zero")
    }
    else if (valor > saldo) {
        throw new Error("Valor maior que o saldo presente na conta");
    }
    saldo -= valor;
}

const Conta = {
    getSaldo(): number {
        return saldo;
    },

    getDataAcesso(): Date {
        return new Date();
    },

    registrarTransacao(novaTransacao: Transacao): void {

        if (novaTransacao.tipoTransacao === TipoTransacao.DEPOSITO) {
            depositar(novaTransacao.valor);
        } else if (novaTransacao.tipoTransacao === TipoTransacao.TRANSFERENCIA || novaTransacao.tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO) {
            debitar(novaTransacao.valor);
        } else {
            throw new Error("Tipo de transação inválido");
        }

        console.log(novaTransacao);
    }
}

export default Conta;