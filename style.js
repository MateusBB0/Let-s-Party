
//Parte de pesquisar
let pesquisar = document.getElementById("pesquisa");
let cards = document.querySelectorAll(".local");
let aviso = document.getElementById("aviso");

function filtroPesquisa() {
    let termo = pesquisar.value.toLowerCase();
    let tem_card = false;

    for (let i = 0; i < cards.length; i++) {
        let texto = cards[i].textContent.toLowerCase();

        if (texto.includes(termo)) {
            cards[i].style.display = "";
            tem_card = true;
        } else {
            cards[i].style.display = "none";
        }
    }

    if (aviso) {
        if (tem_card) {
            aviso.style.display = "none";
        } else {
            aviso.style.display = "flex";
        }
    }
}

if (pesquisar) {
    pesquisar.addEventListener("input", filtroPesquisa);
}

//Parte do evento.html
const chaveFesta = "letsPartyConfiguracao";
const precoEspaco = 2500;
const servicos = [450, 300, 500, 380];

let festa = {
    mesas: 5,
    cadeiras: 60,
    servicos: [false, false, false, false]
};

//Para salvar os dados a gente pesquisou e achou essa maneira, ja que tem que ter os valores salvos pras outras paginas
let dados = localStorage.getItem(chaveFesta);

if (dados != null) {
    festa = JSON.parse(dados);
}

function salvarFesta() {
    localStorage.setItem(chaveFesta, JSON.stringify(festa));
}

function totalServicos() {
    let total = 0;
    for (let i = 0; i < servicos.length; i++) {
        if (festa.servicos[i] == true) {
            total = total + servicos[i];
        }
    }
    return total;
}

//Formatação (Pesquisamos para descobrir como fazer isso)
function formatarValor(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function atualizarOrcamento() {
    let extras = totalServicos();
    let total = precoEspaco + extras;

    let linhas = document.querySelectorAll(".linhas_resumo .linha_resumo");

	//Aqui tivemos que descobrir como pegar cada linha para alterar pois antes não estava funcionando
    if (linhas.length >= 3) {
        linhas[0].lastElementChild.textContent = formatarValor(precoEspaco);
        linhas[1].firstElementChild.textContent = "Móveis (" + festa.mesas + " mes / " + festa.cadeiras + " cad):";
		linhas[1].lastElementChild.textContent = "Inclusos";

        let quantidade = 0;
        for (let i = 0; i < festa.servicos.length; i++) {
            if (festa.servicos[i] == true) {
                quantidade++;
            }
        }

        linhas[2].firstElementChild.textContent = "Serviços Extras (" + quantidade + "):";
        linhas[2].lastElementChild.textContent = formatarValor(extras);
    }

    let valores = document.querySelectorAll(".valor_total");

    for (let i = 0; i < valores.length; i++) {
        valores[i].textContent = formatarValor(total);
    }

    atualizarResumoFinal();
}

function atualizarContadores() {
    let contadores = document.querySelectorAll(".card_contador");

    if (contadores.length >= 2) {
        let mesas = contadores[0];
        let cadeiras = contadores[1];

        mesas.querySelector(".cabecalho_contador .texto_cinza_escuro").textContent = festa.mesas + " / 15";

        mesas.querySelector(".valor_contador").textContent = festa.mesas;

        cadeiras.querySelector(".cabecalho_contador .texto_cinza_escuro").textContent = festa.cadeiras + " / 80";

        cadeiras.querySelector(".valor_contador").textContent = festa.cadeiras;

        let botoesMesas = mesas.querySelectorAll("button");
        let botoesCadeiras = cadeiras.querySelectorAll("button");

		//Impedir de passar do limite minimo e maximo de mesas e cadeiras
        botoesMesas[0].disabled = festa.mesas <= 5;
        botoesMesas[1].disabled = festa.mesas >= 15;

        botoesCadeiras[0].disabled = festa.cadeiras <= 60;
        botoesCadeiras[1].disabled = festa.cadeiras >= 80;
    }
}

// Configurar contadores
function configurarContadores() {
    let contadores = document.querySelectorAll(".card_contador");

    if (contadores.length < 2) {
        return;
    }

    let botoesMesas = contadores[0].querySelectorAll("button");
    let botoesCadeiras = contadores[1].querySelectorAll("button");

    //Diminuir mesas
    botoesMesas[0].addEventListener("click", function() {
        if (festa.mesas > 5) {
            festa.mesas--;
        }

        salvarFesta();
        atualizarContadores();
        atualizarOrcamento();
    });

    //Aumentar mesas
    botoesMesas[1].addEventListener("click", function() {
        if (festa.mesas < 15) {
            festa.mesas++;
        }

        salvarFesta();
        atualizarContadores();
        atualizarOrcamento();
    });

    //Diminuir cadeiras
    botoesCadeiras[0].addEventListener("click", function() {
        if (festa.cadeiras > 60) {
            festa.cadeiras = festa.cadeiras - 5;
        }

        salvarFesta();
        atualizarContadores();
        atualizarOrcamento();
    });

    //Aumentar cadeiras
    botoesCadeiras[1].addEventListener("click", function() {
        if (festa.cadeiras < 80) {
            festa.cadeiras = festa.cadeiras + 5;
        }

        salvarFesta();
        atualizarContadores();
        atualizarOrcamento();
    });
}

function configurarServicos() {
    let opcoes = document.querySelectorAll(".card_servico");

    for (let i = 0; i < opcoes.length; i++) {
		//Quando slecionar colocamos pra ele ficar com borda e fundo um pouco diferente
        if (festa.servicos[i] == true) {
            opcoes[i].style.border = "2px solid #171717";
            opcoes[i].style.backgroundColor = "#f1f1f1";
        }

        opcoes[i].style.cursor = "pointer";

        opcoes[i].addEventListener("click", function() {

            if (festa.servicos[i] == true) {
                festa.servicos[i] = false;

                opcoes[i].style.border = "";
                opcoes[i].style.backgroundColor = "";
            } else {
                festa.servicos[i] = true;

                opcoes[i].style.border = "2px solid #171717";
                opcoes[i].style.backgroundColor = "#f1f1f1";
            }

            salvarFesta();
            atualizarOrcamento();
        });
    }
}

//Parte do resumo
function atualizarResumoFinal() {
    let elemento = document.querySelector(".linha_valor_total .texto_preto_negrito");

    if (elemento) {
        let total = precoEspaco + totalServicos();

        elemento.textContent = "Valor Total: " + formatarValor(total);
    }
}

function atualizarConfirmacao() {
    let detalhes = document.querySelectorAll(".coluna_infos_evento .item_detalhe");

    if (detalhes.length >= 2) {
        detalhes[1].querySelector(".texto_preto_negrito").textContent = festa.mesas + " mesas e " + festa.cadeiras + " cadeiras";
    }

    let linhas = document.querySelectorAll(".linhas_resumo .linha_resumo");

    if (linhas.length >= 3) {
        linhas[0].lastElementChild.textContent = formatarValor(precoEspaco);
        linhas[1].firstElementChild.textContent = "Móveis (" + festa.mesas + " mes / " + festa.cadeiras + " cad):";
        linhas[1].lastElementChild.textContent = "Inclusos";

        let quantidade = 0;

        for (let i = 0; i < festa.servicos.length; i++) {
            if (festa.servicos[i] == true) {
                quantidade++;
            }
        }

        linhas[2].firstElementChild.textContent = "Serviços Extras (" + quantidade + "):";
        linhas[2].lastElementChild.textContent = formatarValor(totalServicos());
    }

    let valores = document.querySelectorAll(".valor_total");
    for (let i = 0; i < valores.length; i++) {
        valores[i].textContent = formatarValor(precoEspaco + totalServicos());
    }
}

//Fazer as funções serem executadas
if (document.querySelector(".card_contador")) {
    atualizarContadores();
    configurarContadores();
    configurarServicos();
    atualizarOrcamento();
}

if (document.querySelector(".card_resumo_final")) {
    atualizarResumoFinal();
}

if (document.querySelector(".card_confirmacao")) {
    atualizarConfirmacao();
}
