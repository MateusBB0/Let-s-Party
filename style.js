// Pesquisar
let pesquisar = document.getElementById("pesquisa");
let cards = document.querySelectorAll(".local");
let aviso = document.getElementById("aviso");    
function filtroPesquisa(){
    const termo = pesquisar.value.toLowerCase();
    let tem_card = false;

for (let texto = 0; texto < cards.length; texto++) {
	const card = cards[texto];
	const textos = card.textContent.toLowerCase();
    
	if (textos.includes(termo)) {
		card.style.display ="";
        tem_card = true;
	}else{
		card.style.display = "none";
		
	}
}
    if(!tem_card){
        aviso.style.display = "flex";
	}else{
        aviso.style.display = "none";

    }
}
pesquisar.addEventListener("input", filtroPesquisa);