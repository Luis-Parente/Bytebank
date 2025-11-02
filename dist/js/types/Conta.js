import { TipoTransacao } from "./TipoTransacao.js";
import { formatarData } from "../utils/formatters.js";
import { FormatoData } from "./FormatoData.js";
let saldo = JSON.parse(localStorage.getItem("saldo")) || 0;
const transacoes = JSON.parse(localStorage.getItem("transacoes"), (key, value) => {
    if (key === "data") {
        return new Date(value);
    }
    return value;
}) || [];
function depositar(valor) {
    if (valor <= 0) {
        throw new Error("Valor deve ser maior que zero");
    }
    saldo += valor;
    localStorage.setItem("saldo", JSON.stringify(saldo));
}
function debitar(valor) {
    if (valor <= 0) {
        throw new Error("Valor deve ser maior que zero");
    }
    else if (valor > saldo) {
        throw new Error("Valor maior que o saldo presente na conta");
    }
    saldo -= valor;
    localStorage.setItem("saldo", JSON.stringify(saldo));
}
const Conta = {
    getSaldo() {
        return saldo;
    },
    getDataAcesso() {
        return new Date();
    },
    getGrupoTransacao() {
        const gruposTransacoes = [];
        const listaTransacoes = structuredClone(transacoes);
        const transacoesOrdenadas = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime());
        let labelAtualGrupoTransacao = "";
        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao = formatarData(transacao.data, FormatoData.MES_ANO);
            if (labelAtualGrupoTransacao !== labelGrupoTransacao) {
                labelAtualGrupoTransacao = labelGrupoTransacao;
                gruposTransacoes.push({
                    label: labelGrupoTransacao,
                    transacoes: []
                });
            }
            gruposTransacoes.at(-1).transacoes.push(transacao);
        }
        return gruposTransacoes;
    },
    registrarTransacao(novaTransacao) {
        if (novaTransacao.tipoTransacao === TipoTransacao.DEPOSITO) {
            depositar(novaTransacao.valor);
        }
        else if (novaTransacao.tipoTransacao === TipoTransacao.TRANSFERENCIA || novaTransacao.tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO) {
            debitar(novaTransacao.valor);
            novaTransacao.valor *= -1;
        }
        else {
            throw new Error("Tipo de transação inválido");
        }
        transacoes.push(novaTransacao);
        console.log(this.getGrupoTransacao());
        localStorage.setItem("transacoes", JSON.stringify(transacoes));
    }
};
export default Conta;
