import { formatarMoeda } from "../utils/formatters.js";
const elementoSaldo = document.querySelector(".saldo-valor .valor");
let saldo = 3000;
mostrarSaldo();
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
