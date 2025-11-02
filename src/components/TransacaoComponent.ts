import { TipoTransacao } from "../types/TipoTransacao.js";
import { Transacao } from "../types/Transacao.js";
import Conta from "../types/Conta.js";
import SaldoComponent from "./SaldoComponent.js";

const elementoFormulario = document.querySelector(".block-nova-transacao form") as HTMLFormElement;

elementoFormulario.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!elementoFormulario.checkValidity()) {
    alert("Por favor preencha todos os campos!");
    return;
  }

  const inputTipoTransacao = document.querySelector("#tipoTransacao") as HTMLSelectElement;
  const inputValor = document.querySelector("#valor") as HTMLInputElement;
  const inputData = document.querySelector("#data") as HTMLInputElement;

  let tipoTransacao: TipoTransacao = inputTipoTransacao.value as TipoTransacao;
  let valor: number = inputValor.valueAsNumber;
  let data: Date = new Date(inputData.value);

  const novaTransacao: Transacao = {
    tipoTransacao: tipoTransacao,
    valor: valor,
    data: data,
  };

  Conta.registrarTransacao(novaTransacao);
  SaldoComponent.atualizar();

  elementoFormulario.reset();
});