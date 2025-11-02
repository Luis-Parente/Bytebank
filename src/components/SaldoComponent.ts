import { formatarMoeda, formatarData } from "../utils/formatters.js"

const elementoSaldo = document.querySelector(".saldo-valor .valor") as HTMLElement;

let saldo: number = 3000;

mostrarSaldo();

export function getSaldo(): number {
        return saldo
}

export function atualizarSaldo(novoSaldo: number) {
        saldo = novoSaldo;
        mostrarSaldo();
}

export function mostrarSaldo() {
        if(elementoSaldo) {
                elementoSaldo.textContent = formatarMoeda(saldo);
        }
}