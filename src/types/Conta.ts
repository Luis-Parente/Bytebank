import { Transacao } from "./Transacao.js"; 
import { TipoTransacao } from "./TipoTransacao.js";
import { GrupoTransacao } from "./GrupoTransacao.js";
import { formatarData } from "../utils/formatters.js";
import { FormatoData } from "./FormatoData.js";

let saldo: number = JSON.parse(localStorage.getItem("saldo")) || 0;
const transacoes: Transacao[] = JSON.parse(localStorage.getItem("transacoes"), (key: string, value: string) => {
    if (key === "data") {
        return new Date(value);
    }

    return value;
}) || [];

function depositar(valor: number): void {
    if (valor <= 0) {
        throw new Error("Valor deve ser maior que zero")
    }
    saldo += valor;

    localStorage.setItem("saldo", JSON.stringify(saldo));
}

function debitar(valor: number): void {
    if (valor <= 0) {
        throw new Error("Valor deve ser maior que zero")
    }
    else if (valor > saldo) {
        throw new Error("Valor maior que o saldo presente na conta");
    }
    saldo -= valor;

    localStorage.setItem("saldo", JSON.stringify(saldo));
}

const Conta = {
    getSaldo(): number {
        return saldo;
    },

    getDataAcesso(): Date {
        return new Date();
    },

    getGrupoTransacao(): GrupoTransacao[] {
        const gruposTransacoes: GrupoTransacao[] = [];
        const listaTransacoes: Transacao[] = structuredClone(transacoes);

        const transacoesOrdenadas: Transacao[] = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime());

        let labelAtualGrupoTransacao = "";

        for (let transacao of transacoesOrdenadas){
            let labelGrupoTransacao: string = formatarData(transacao.data, FormatoData.MES_ANO);

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

    registrarTransacao(novaTransacao: Transacao): void {

        if (novaTransacao.tipoTransacao === TipoTransacao.DEPOSITO) {
            depositar(novaTransacao.valor);
        } else if (novaTransacao.tipoTransacao === TipoTransacao.TRANSFERENCIA || novaTransacao.tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO) {
            debitar(novaTransacao.valor);
        } else {
            throw new Error("Tipo de transação inválido");
        }

        transacoes.push(novaTransacao);
        console.log(this.getGrupoTransacao());
        localStorage.setItem("transacoes", JSON.stringify(transacoes));
    }
}

export default Conta;