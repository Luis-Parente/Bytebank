const elementoFormulario = document.querySelector(".block-nova-transacao form") as HTMLFormElement;

elementoFormulario.addEventListener("submit", function(event) {
    event.preventDefault();

    if(!elementoFormulario.checkValidity()){
        alert("Por favor preencha todos os campos!");
        return
    }

    const inputTipoTransacao = document.querySelector("#tipoTransacao") as HTMLSelectElement;
    const inputValor = document.querySelector("#valor") as HTMLInputElement;
    const inputData = document.querySelector("#data") as HTMLInputElement;

    let tipoTransacao: TipoTransacao = inputTipoTransacao.value as TipoTransacao;
    let valor: number = inputValor.valueAsNumber;
    let data: Date = new Date(inputData.value);

    if (tipoTransacao === TipoTransacao.DEPOSITO) {
        saldo += valor;
    } else if (tipoTransacao === TipoTransacao.TRANSFERENCIA || tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO) {
        saldo -= valor;
    } else {
        alert("Tipo de transação inválido");
        return
    }

    elementoSaldo.textContent = formatarMoeda(saldo);

    const novaTransacao: Transacao = {
        tipoTransacao: tipoTransacao,
        valor: valor,
        data: data,
    }

    console.log(novaTransacao);

    elementoFormulario.reset();
});
