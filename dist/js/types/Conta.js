import { TipoTransacao } from "./TipoTransacao.js";
let saldo = 3000;
function depositar(valor) {
    if (valor <= 0) {
        throw new Error("Valor deve ser maior que zero");
    }
    saldo += valor;
}
function debitar(valor) {
    if (valor <= 0) {
        throw new Error("Valor deve ser maior que zero");
    }
    else if (valor > saldo) {
        throw new Error("Valor maior que o saldo presente na conta");
    }
    saldo -= valor;
}
const Conta = {
    getSaldo() {
        return saldo;
    },
    getDataAcesso() {
        return new Date();
    },
    registrarTransacao(novaTransacao) {
        if (novaTransacao.tipoTransacao === TipoTransacao.DEPOSITO) {
            depositar(novaTransacao.valor);
        }
        else if (novaTransacao.tipoTransacao === TipoTransacao.TRANSFERENCIA || novaTransacao.tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO) {
            debitar(novaTransacao.valor);
        }
        else {
            throw new Error("Tipo de transação inválido");
        }
        console.log(novaTransacao);
    }
};
export default Conta;
