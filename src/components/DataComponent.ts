import { formatarData } from "../utils/formatters.js";
import { FormatoData } from "../types/FormatoData.js";

const elementoDataAcesso = document.querySelector(".block-saldo time") as HTMLElement;

if(elementoDataAcesso) {
        const dataAcesso: Date = new Date();
        elementoDataAcesso.textContent = formatarData(dataAcesso, FormatoData.DIA_SEMANA_DIA_MES_ANO);
}