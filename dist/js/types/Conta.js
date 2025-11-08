var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { formatarData } from "../utils/formatters.js";
import { FormatoData } from "./FormatoData.js";
import { TipoTransacao } from "./TipoTransacao.js";
import { Armazenador } from "./Armazenador.js";
import { validaDebito, validaDeposito } from "./Decorator.js";
export class Conta {
    nome;
    saldo = Armazenador.obter("saldo") || 0;
    transacoes = Armazenador.obter(("transacoes"), (key, value) => {
        if (key === "data") {
            return new Date(value);
        }
        return value;
    }) || [];
    constructor(nome) {
        this.nome = nome;
    }
    getGrupoTransacao() {
        const gruposTransacoes = [];
        const listaTransacoes = structuredClone(this.transacoes);
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
    }
    getSaldo() {
        return this.saldo;
    }
    getDataAcesso() {
        return new Date();
    }
    getNome() {
        return this.nome;
    }
    depositar(valor) {
        this.saldo += valor;
        Armazenador.salvar("saldo", JSON.stringify(this.saldo));
    }
    debitar(valor) {
        this.saldo -= valor;
        Armazenador.salvar("saldo", JSON.stringify(this.saldo));
    }
    registrarTransacao(novaTransacao) {
        if (novaTransacao.tipoTransacao === TipoTransacao.DEPOSITO) {
            this.depositar(novaTransacao.valor);
        }
        else if (novaTransacao.tipoTransacao === TipoTransacao.TRANSFERENCIA || novaTransacao.tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO) {
            this.debitar(novaTransacao.valor);
            novaTransacao.valor *= -1;
        }
        else {
            throw new Error("Tipo de transação inválido");
        }
        this.transacoes.push(novaTransacao);
        console.log(this.getGrupoTransacao());
        Armazenador.salvar("transacoes", JSON.stringify(this.transacoes));
    }
}
__decorate([
    validaDeposito
], Conta.prototype, "depositar", null);
__decorate([
    validaDebito
], Conta.prototype, "debitar", null);
export class ContaPremium extends Conta {
    registrarTransacao(novaTransacao) {
        if (novaTransacao.tipoTransacao === TipoTransacao.DEPOSITO) {
            console.log("ganhou bonus");
            novaTransacao.valor += 0.5;
        }
        super.registrarTransacao(novaTransacao);
    }
}
const conta = new Conta("Joana");
const contaPremium = new ContaPremium("Marcia");
export default conta;
