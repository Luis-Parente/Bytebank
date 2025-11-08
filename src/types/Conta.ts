import {Transacao} from "./Transacao.js";
import {GrupoTransacao} from "./GrupoTransacao.js";
import {formatarData} from "../utils/formatters.js";
import {FormatoData} from "./FormatoData.js";
import {TipoTransacao} from "./TipoTransacao.js";
import {Armazenador} from "./Armazenador.js";
import {validaDebito, validaDeposito} from "./Decorator.js";

export class Conta {
    protected nome: string
    protected saldo: number = Armazenador.obter<number>("saldo") || 0;
    private transacoes: Transacao[] = Armazenador.obter<Transacao[]>(("transacoes"), (key: string, value: string) => {
        if (key === "data") {
            return new Date(value);
        }

        return value;
    }) || [];

    constructor(nome: string) {
        this.nome = nome;
    }

    getGrupoTransacao(): GrupoTransacao[] {
        const gruposTransacoes: GrupoTransacao[] = [];
        const listaTransacoes: Transacao[] = structuredClone(this.transacoes);

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
    }

    getSaldo(): number {
        return this.saldo;
    }

    getDataAcesso(): Date {
        return new Date();
    }

    getNome(): string {
        return this.nome;
    }

    @validaDeposito
    private depositar(valor: number): void {
        this.saldo += valor;
        Armazenador.salvar("saldo", JSON.stringify(this.saldo));
    }

    @validaDebito
    private debitar(valor: number): void {
        this.saldo -= valor;
        Armazenador.salvar("saldo", JSON.stringify(this.saldo));
    }

    registrarTransacao(novaTransacao: Transacao): void {

        if (novaTransacao.tipoTransacao === TipoTransacao.DEPOSITO) {
            this.depositar(novaTransacao.valor);
        } else if (novaTransacao.tipoTransacao === TipoTransacao.TRANSFERENCIA || novaTransacao.tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO) {
            this.debitar(novaTransacao.valor);
            novaTransacao.valor *= -1;
        } else {
            throw new Error("Tipo de transação inválido");
        }

        this.transacoes.push(novaTransacao);
        console.log(this.getGrupoTransacao());
        Armazenador.salvar("transacoes", JSON.stringify(this.transacoes));
    }
}

export class ContaPremium extends Conta {

    registrarTransacao(novaTransacao: Transacao): void  {
        if(novaTransacao.tipoTransacao === TipoTransacao.DEPOSITO) {
            console.log("ganhou bonus");
            novaTransacao.valor += 0.5;
        }
        super.registrarTransacao(novaTransacao);
    }
}

const conta = new Conta("Joana");
const contaPremium = new ContaPremium("Marcia");

export default conta;