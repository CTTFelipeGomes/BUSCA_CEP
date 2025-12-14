const inputValor = document.querySelector("#valor");
const selectMoeda = document.querySelector("#moeda");
const btn = document.querySelector("#btn");
const resultadoBox = document.querySelector(".resultado");
const taxaBox = document.querySelector(".taxa");

function pegarMoeda() {
    const valor = inputValor.value.replace(",", ".");
    const moeda = selectMoeda.value;

    if (!valor || isNaN(valor)) {
        alert("Digite um valor válido!");
        return;
    }

    fetch(`https://economia.awesomeapi.com.br/json/last/${moeda}`)
        .then(res => res.json())
        .then(data => {
            displayResultado(data, valor, moeda);
        })
        .catch(err => {
            alert("Erro ao buscar dados!");
            console.log(err);
        });
}

function displayResultado(data, valor, moeda) {
    const chave = moeda.replace("-", "");
    const cotacaoAtual = Number(data[chave].bid);

    const convertido = (cotacaoAtual * Number(valor)).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    taxaBox.textContent = `1 ${moeda.slice(0, 3)} = R$ ${cotacaoAtual}`;
    resultadoBox.textContent = convertido;
}

btn.addEventListener("click", pegarMoeda);