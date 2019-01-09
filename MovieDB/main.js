var storage = {
	url: 'https://api.themoviedb.org/3/',
	key: '?api_key=1078453dc71a614c3a03d74c27fbdcb1&language=en-US',
	articleList: [],
	total_pages: '',
	current_page: 1,
	articleListLength: '',
	limit: 10,
	movieList: [],
	movieIdClicked: '',
	movieItem: {},
	list : document.getElementById('listM'),
	movieBackground: document.getElementById('movieBackground'),
};
window.onload = function () {
	render()
};
function render () {
	var request = new XMLHttpRequest();
	request.getData('movie/top_rated', '&page=' + storage.current_page);
	request.onload = function () {

		// Begin accessing JSON data here
		var data = JSON.parse(this.response);
		if (request.status >= 200 && request.status < 400) {
			data.forEach(movie => {
				const card = document.createElement('div');
				card.setAttribute('class', 'card');

				const h1 = document.createElement('h1');
				h1.textContent = movie.title;

				const p = document.createElement('p');
				movie.description = movie.description.substring(0, 300);
				p.textContent = `${movie.description}...`;

				container.appendChild(card);
				card.appendChild(h1);
				card.appendChild(p);
			});
		} else {
			const errorMessage = document.createElement('marquee');
			errorMessage.textContent = `Gah, it's not working!`;
			app.appendChild(errorMessage);
		}
	}

	request.send();
}

function getData (apiName, num) {
	open('GET', storage.url + apiName + storage.key + num, true);

	// return fetch(      storage.url + apiName + storage.key + num,
	// 	{  method: 'GET'  }
	// )
}

// ------------------------Build Movie list grid

window.onload = function () {
	render()
};


// render results of API response

function render () {
	getData('movie/top_rated', '&page=' + storage.current_page)//API request for movie list
		.then(function(res) {
			return res.json()
		})
		.then(function(res) {
			console.log(res.results)
			storage.articleList = storage.articleList.concat(res.results); // add new object to existing array
			storage.total_pages	= res.total_pages;
			storage.articleListLength = storage.articleList.length;
			console.log(storage)
			ArticalList()
		})
}
// Create global div with id="articleList" to add all movies in grid here
function ArticalList () {
	//--------------------------  Infinite scroll  > render() while limit allows
	window.onscroll = function() {
		var d = document.documentElement;
		var offset = d.scrollTop + window.innerHeight;
		var height = d.offsetHeight;

		//console.log('offset = ' + offset);
		//console.log('height = ' + height);

		if (offset === height) {

			storage.current_page++

			if (storage.current_page < storage.limit) {
				render()
			}
		}
	};

	var i = (storage.current_page-1)*20+1
	storage.articleList.slice(i).forEach(function(item) {
		articleList.appendChild(ArticalItem(item))
	})
}

function ArticalItem (data) {
	// -----------------------create DOM elements of one element of grid

	var itemArticle = document.createElement('div');

	var itemArticleInner = document.createElement('div');

	var rowMovieDiv = document.createElement('div');

	var imgDiv = document.createElement('div');
	var img = document.createElement('img');

	var textDiv = document.createElement('div');
	var cardBodyDiv = document.createElement('div');
	var h4 = document.createElement('h4');
	var p = document.createElement('p');


	var moreFooterDiv = document.createElement('div');
	var a = document.createElement('a');


	// ------------------add classes and ids to elements
	itemArticle.className = 'col-12 col-sm-12 col-md-9 col-lg-6';
	itemArticleInner.className = 'card movie-card';
	rowMovieDiv.className = 'rowMovieDiv row no-gutters';
	imgDiv.className = 'imgDiv col-12 col-sm-4 col-md-4 col-lg-5 col-xl-4';
	img.setAttribute('class', 'poster');


	textDiv.className = 'textDiv col-12 col-sm-8 col-md-8 col-lg-7 col-xl-8 d-flex flex-column justify-content-around';

	cardBodyDiv.className = 'card-body';
	h4.className = 'card-title';
	p.className = 'card-text';
	a.id = data.id;

	moreFooterDiv.className = 'card-footer';
	a.className = 'moreInfo';

	storage.movieBackground.style.display = 'none';

	// -------------------define API content for the elements


	img.src = "https://image.tmdb.org/t/p/w500/" + data.poster_path;

	h4.innerText = data.title;

	// function to cut visible description text to last dot

	var cutString =  data.overview.slice(0,200);
	p.innerText = cutString.slice(0, cutString.lastIndexOf('.'))+'.';

	// events on More info link click

	a.innerText = 'More info';

	let id = storage.articleList.id

	a.addEventListener('click',
		(function(){clearList('movie')})
	);
	a.addEventListener('click',
		(function(){clearList('articleList')})
	);

	a.addEventListener('click',

		(function() {
			storage.movieIdClicked = this.id
			// console.log(storage.movieIdClicked)
			//console.log(storage.movieItem)
		})
	);

	a.addEventListener('click',
		renderMovie
	);


	// -------------------------Append elements to page

	itemArticle.appendChild(itemArticleInner)

	itemArticleInner.appendChild(rowMovieDiv)

	rowMovieDiv.appendChild(imgDiv)

	imgDiv.appendChild(img)

	rowMovieDiv.appendChild(textDiv);

	textDiv.appendChild(cardBodyDiv)
	cardBodyDiv.appendChild(h4)
	cardBodyDiv.appendChild(p)

	textDiv.appendChild(moreFooterDiv)
	moreFooterDiv.appendChild(a)
	storage.list.style.display = 'block';

	return itemArticle
}

