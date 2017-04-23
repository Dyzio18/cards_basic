/*
Card Basic - Drag and Drop
@author: Nizio Patryk "Dyzio"
@version: 1.00.00


*/

var figuresTab = [2,3,4,5,6,7,8,9,10,'J','Q','K','A'];
var colorTab = ['trefl','karo','kier','pik'];
//var decksTab = []; // Associative array 
var myScore = 0;
var isModalOpen = false; // Variable to check modal open/close

//Drag and Drop API HTML5 
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");

    if( compareColor(data,ev.target.id))
	{
		ev.target.appendChild(document.getElementById(data));
	    compareCards(data, ev.target.id);	    
	    countCards('cards_box_one','cards_info_one');
	    countCards('cards_box_two','cards_info_two');
	}
}


// EventListener
document.addEventListener("DOMContentLoaded", function(event) {
  	createManyCardsHTML(3,'cards_box_two');
    countCards('cards_box_one','cards_info_one');
    countCards('cards_box_two','cards_info_two');	
});

//First Section
document.getElementById("cards_add_one").addEventListener("click", function() { 
	createOneCardHTML('cards_box_one'); 
    countCards('cards_box_one','cards_info_one');
});
document.getElementById("cards_delete_one").addEventListener("click", function() { 
	deleteLastCard('cards_box_one'); 
    countCards('cards_box_one','cards_info_one');
});
//Second Section
document.getElementById("cards_add_two").addEventListener("click", function() { 
	createOneCardHTML('cards_box_two'); 
    countCards('cards_box_two','cards_info_two');
});
/*document.getElementById("cards_delete_two").addEventListener("click", function() { 
	deleteLastCard('cards_box_two'); 
    countCards('cards_box_two','cards_info_two'); // Now button is disable
});*/

// Open Modal 
document.getElementById("info_modal_btn").addEventListener("click", function() { 
	useModal();

});



// Create many cards function (param_one - how many cards you wanna create [int], param_out - DOMstring )
function createManyCardsHTML(howMuch = 0,param_out){
    for (var i = 0, j = 0; i < howMuch; i++,j++) {  
		var cardHTML = document.createElement('div'); 
    	console.log("Log: "+howMuch+" cards created");
    	if(j>12){	// Number of figures is our scope (2, 3 ... Q, K, A)
    		j %= 13;
    	}

		cardHTML.id = makeID();
		cardHTML.className = 'card';
		cardHTML.draggable = 'true';
		cardHTML.addEventListener("dragstart", drag);

		cardHTML.innerHTML = figuresTab[j];
		cardHTML.setAttribute('value', j+2);
		cardHTML.setAttribute('data-color', colorTab[3]);

		body = document.getElementById(param_out);
		body.appendChild(cardHTML); //Add element to DOM tree
	}
}

//Create only one card with random property (param_out - DOMstring )
function createOneCardHTML (param_out) {
	var cardHTML = document.createElement('div'); //Create new div
    var j = Math.floor(Math.random()*200) % 13;
	cardHTML.id = makeID();
	cardHTML.className = 'card';
	cardHTML.draggable = 'true';
	cardHTML.addEventListener("dragstart", drag);

	cardHTML.innerHTML = figuresTab[j];
	cardHTML.setAttribute('value', j+2);

	j %= 4;
	cardHTML.setAttribute('data-color', colorTab[j]);
	body = document.getElementById(param_out);
	body.appendChild(cardHTML); //Add element to DOM tree
}

//Delete last card (param_in - DOMstring)
function deleteLastCard (param_out) {

	var list = document.getElementById(param_out);
	var item = list.lastElementChild;

	if ( item.classList == 'card')
    	list.removeChild(item);
}

// Generate and return random hash 
function makeID(){
    return  Math.random().toString(36).substring(2,7);
}

// This function compare two cards, if the cards are similar, removes both.
function compareCards (card_one, card_two) {
	var childCard = document.getElementById(card_one);  // Child
	var parentCard = document.getElementById(card_two);  // Target

	var childValue = childCard.getAttribute('value');
	var parentValue = parentCard.getAttribute('value');

	if (childValue === parentValue ) { 
 		var score_box = document.getElementById('score_box');
 		

 		// Calc value on deck
		myScore += stackValue(card_one);
		Number(myScore);
 		score_box.innerHTML = myScore;


 		//Delete children :( noo! xd )
 		parentCard.removeChild(childCard);
		var parentParentCard = parentCard.parentNode;
		parentParentCard.removeChild(parentCard);

		var animationThis = document.body;
			animationThis.classList.add("animate_bg");
 			setTimeout(function(){ animationThis.classList.remove("animate_bg"); }, 3000);

	}
}

// This function check and compare color both cards (DOMstring - drop card, DOMstring - target card)
function compareColor ( card_one, card_two ) {
	var childCard = document.getElementById(card_one);  // Child
	var parentCard = document.getElementById(card_two);  // Target

	var childColor = childCard.getAttribute('data-color');
	var parentColor = parentCard.getAttribute('data-color');

	var childValue = Number(childCard.getAttribute('value'));
	var parentValue = Number (parentCard.getAttribute('value'));


	if (childColor === parentColor && childValue <= parentValue) return 1;		// The same color, lowest value
	else if ( childValue === parentValue || parentCard.classList == "cards_box") return 1;
	
	else return 0;
}

// This function return value of cards on decks (param_in - DOMstring) [Recurention Function]
function stackValue (param_in) {
	var parentCard = document.getElementById(param_in);
	var children = parentCard.children;

	var value = Number(parentCard.getAttribute('value'));

	for (var i = 0; i < children.length; i++) {
	  var tableChild = children[i];
	  value += stackValue(tableChild.id);
	  value =  Number(value);
	}
	value =  Number(value);
	console.log(value);
	return value;
};

// Count cards function (parameters - DOMstring,DOMstring)
function countCards(param_in,param_out) {
	var input_box = document.getElementById(param_in)
	var cards = input_box.querySelectorAll('.card');

	if(cards){
		output_box = document.getElementById(param_out);
		txt_value =  cards.length;
		output_box.innerHTML = txt_value;
	}
};


// Modal modul - open/close modal info 
function useModal () {
	if(isModalOpen) {
		closeModal();
	}
	else {
		openModal();
	}
}

function openModal () {
	var nav_btn = document.getElementById('nav_icon');
	nav_btn.classList.add("open_nav");
	var modalRules = document.getElementById("modal_rules_window");
	modalRules.style.display = 'inherit';
	isModalOpen = true;
}

function closeModal () {
	var nav_btn = document.getElementById('nav_icon');
	nav_btn.classList.remove("open_nav");
	var modalRules = document.getElementById("modal_rules_window");
	modalRules.style.display = 'none';
	isModalOpen = false;
}




/*
TODO:
	OK -> Score/Wynik ( -- Mozna dodac mnoznik - super kombinacja)
	OK -- Animacja (Wybuch/NyanCat/Tło )  Like: https://codepen.io/alek/pen/EyyLgp 
	OK -- Dodanie pozostałych kolorów (pik, romb, dab)
	OK -- Rozgrywka np. ten sam kolor moze byc na sobie - wtedy mnoznik)
  	OK -- Zasady gry

- Poziomy trudności (2 poziomy)
- Mobile?... Napisac komunikat dla dotykowych! *(blah blah native HTML5 nie obsluguje, uzyc wersje mobile na JQuery UI)
- Wiecej animacji np. za jednym ruchem zebrano 50pkt. to przelatuje nyanCat itp.

?MODYFIKACJA: Karty mozna układac w talie (ten sam kolor) i zbic inną karte jeśli ma sie większą sume w kartach np: Q(=12) może zbic 10+3 albo J+2
*/


