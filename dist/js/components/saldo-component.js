import { formatarMoeda, formatarData } from "../utils/formatters.js";
import { FormatoData } from "../types/FormatoData.js";
let saldo = 3000;
const elementoSaldo = document.querySelector(".saldo-valor .valor");
const elementoDataAcesso = document.querySelector(".block-saldo time");
mostrarSaldo();
if (elementoDataAcesso) {
    const dataAcesso = new Date();
    elementoDataAcesso.textContent = formatarData(dataAcesso, FormatoData.DIA_SEMANA_DIA_MES_ANO);
}
export function getSaldo() {
    return saldo;
}
export function atualizarSaldo(novoSaldo) {
    saldo = novoSaldo;
    mostrarSaldo();
}
export function mostrarSaldo() {
    if (elementoSaldo) {
        elementoSaldo.textContent = formatarMoeda(saldo);
    }
}
