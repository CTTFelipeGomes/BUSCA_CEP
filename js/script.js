// Seletores de Input
const inputCep = document.querySelector("#cep");
const inputEstado = document.querySelector("#estado");
const inputBairro = document.querySelector("#bairro");
const inputLogradouro = document.querySelector("#logradouro");
// Correção 1: Seletor de ID deve ser minúsculo (#cidade é o padrão)
const inputCidade = document.querySelector("#cidade"); 
const inputNumero = document.querySelector("#numero");
const inputComplemento = document.querySelector("#complemento");
const btnBuscar = document.querySelector("#btn-buscar");

// Função para desabilitar campos
function disableAddressFields() {
    inputNumero.setAttribute("disabled", true); // Use 'true' ou apenas a string vazia
    inputComplemento.setAttribute("disabled", true);
    inputNumero.value = ""; // Limpa o valor ao desabilitar
    inputComplemento.value = "";
}

// Função para habilitar campos
function enableAddressFields() {
    inputNumero.removeAttribute("disabled");
    // Correção 2: O método correto é removeAttribute, não removeAttributeNS
    inputComplemento.removeAttribute("disabled"); 
}

// Função assíncrona para buscar e preencher o formulário
async function preencherForm(event) {
    if (event) event.preventDefault(); // Impede o envio do formulário padrão

    // Limpa campos de endereço antes de uma nova busca
    inputBairro.value = "";
    inputEstado.value = "";
    inputLogradouro.value = "";
    inputCidade.value = "";
    inputNumero.value = "";
    inputComplemento.value = "";
    
    // Garante que o CEP tenha 8 dígitos numéricos, removendo o traço
    let valueInputCep = inputCep.value.replace(/\D/g, ""); 
    if (valueInputCep.length !== 8) {
        alert("Por favor, insira um CEP válido com 8 dígitos.");
        disableAddressFields(); // Desabilita se o CEP for inválido
        return;
    }

    try {
        let response = await fetch(`https://viacep.com.br/ws/${valueInputCep}/json/`);
        let data = await response.json();

        // Correção 3: data.erro é um booleano `true`, não uma string `"true"`
        if (data.erro === true) { 
            disableAddressFields();
            alert("CEP não encontrado pela API!");
            return;
        }

        // Preenche os campos com os dados retornados
        inputBairro.value = data.bairro;
        // Correção 4: A propriedade da API para o estado é 'uf'
        inputEstado.value = data.uf; 
        inputLogradouro.value = data.logradouro;
        inputCidade.value = data.localidade;
        
        enableAddressFields(); // Habilita campos Número e Complemento
        console.log(data);

    } catch (error) { 
        disableAddressFields();
        alert("Ocorreu um erro ao buscar o CEP. Verifique sua conexão.");
        console.error(error);
    }
}

// Ouve o clique no botão de busca
btnBuscar.addEventListener('click', preencherForm);


// --- Código da Máscara (Melhorado e Movido para o evento 'input') ---

function mask(){
  let valueInputCep = inputCep.value;
  // Garante que apenas números sejam usados na formatação e adiciona o traço
  valueInputCep = valueInputCep.replace(/\D/g, "").replace(/^(\d{5})(\d{1,3})$/, "$1-$2");
  
  inputCep.value = valueInputCep;
  
  // Limita o tamanho do campo para 9 caracteres totais
  if (inputCep.value.length > 9) {
    inputCep.value = inputCep.value.slice(0, 9);
  }
}

// Correção 5: Use 'input' em vez de 'keypress' para melhor funcionamento da máscara
inputCep.addEventListener('input', mask);

// Opcional: Chamar a busca automaticamente quando o usuário termina de digitar e sai do campo
inputCep.addEventListener('blur', preencherForm);

// Opcional: Desabilitar campos de endereço ao carregar a página
document.addEventListener('DOMContentLoaded', (event) => {
    disableAddressFields();
});
