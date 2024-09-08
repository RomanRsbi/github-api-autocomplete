// "https://api.github.com/search/repositories?q=Q"

function debounce (fn, debounceTime) {
	let a;
	return function() {
		clearTimeout(a);
		a = setTimeout(() => {
			fn.apply(this, arguments);
		}, debounceTime);
	};
};

function addCard (e) {
	document.querySelector('.search-string__input').value = '';
	document.querySelectorAll('.search-string-element').forEach(el => el.remove());
	let items = document.querySelector('.items');
	items.insertAdjacentHTML('afterbegin', `
		<li class='items__card'>
			<p class='items__description'>
				<span>Name:${e.target.textContent}</span>
				<span>Owner:${e.target.dataset.owner}</span>
				<span>stars:${e.target.dataset.stars}</span>
			</p>
			<button class='button-close'>
			</button>
		</li>
		`);
		let buttonClose = document.querySelectorAll('.button-close');
		buttonClose.forEach(el => {
			el.addEventListener('click', function(e) {
				e.target.parentNode.remove();
			});
		});
}

async function searchInput (words) {
	if (!words.target.value) {
		document.querySelectorAll('.search-string-element').forEach(el => el.remove());
	} else {
		document.querySelectorAll('.search-string-element').forEach(el => el.remove());
		let sectionSearch = document.querySelector('.search-string');
		let response = await fetch(`https://api.github.com/search/repositories?q=${words.target.value}`);
		let responseInJson = await response.json();
		let responseArr = responseInJson.items;
		let html = await responseArr.map(el => {
			return `<div data-stars="${el.stargazers_count}" data-owner="${el.owner.login}" class='search-string-element'>${el.name}</div>`
		}).slice(0, 5).join('');
		sectionSearch.insertAdjacentHTML("beforeend", html);
		let autocompleteRes = document.querySelectorAll('.search-string-element');
		autocompleteRes.forEach(el => {
			el.addEventListener('click', addCard);
		});
	}
}

let debTime = debounce(searchInput, 800);

let input = document.querySelector('.search-string__input');
input.addEventListener('keydown', debTime);
