const listEl = document.getElementById('list')
const inputEl = document.getElementById('inputSecrch')
const btnSearch = document.getElementById('search-btn')
const watchlishInner  = document.getElementById('searchList')
const inputSearch =document.getElementById('movie-input')
let localWatchlist = JSON.parse(localStorage.getItem('watchlist')) || []

btnSearch.addEventListener('click',handleSearch)

function renderList(arr){
  let html =''
  let htmlADd =''
   listEl.innerHTML = ''
   arr.forEach(element => {
    const itemId = element.imdbID 
    const istheid = (element) => element === itemId
    const indexRender = localWatchlist.findIndex(istheid)

    if(indexRender !== -1){
      htmlADd =` <a class='addlist'  data-idd=${itemId}  id=id-${itemId}> - Watchlist</a>`
    }else{
      htmlADd =` <a class='addlist' data-idd=${itemId} id=id-${itemId}> + Watchlist</a>`
 
    }

    html +=`<div class="boxmovie" id='box-${itemId}'>
    <img src=${element.Poster} alt="">
    <div class="infomovie">
      <h1>${element.Title}</h1>
      <div class="timemovie">
        <p>${element.Runtime}</p>
        <p>${element.Genre}</p>
        ${htmlADd}
      </div>
      <p class='textColor'>${element.Plot}</p>
    </div>
  </div>
  `  
   });
   listEl.innerHTML = html
}

async function handleSearch(){
  if(inputSearch){
    const res = await fetch(`https://www.omdbapi.com/?apikey=3f9608a5&s=${inputSearch.value}`)
    const data = await res.json()
        if(data.Search !==undefined &&  data.Response !== 'False'){
          console.log('hi')
          const completeData = await Promise.all(  
            data.Search.map(async data=>{
              const response  = await fetch(`https://www.omdbapi.com/?apikey=3f9608a5&i=${data.imdbID}`)
              const info = await response .json()
              return info
            })
           )
           renderList(completeData)
        }    
  }
}

document.addEventListener('click',function(e){
  if(e.target.dataset.idd){
    handleClickAD(e.target.dataset.idd)
  }else if(e.target.dataset.deletelist){
    console.log(e.target.dataset.deletelist)
    handleDeleteList(e.target.dataset.deletelist)
  }
})

function handleDeleteList(id){
const box = document.getElementById(`box-delete-${id}`)
box.style.display = 'none'
localWatchlist = localWatchlist.filter(item => item !== id)
localStorage.setItem('watchlist', JSON.stringify(localWatchlist));
if(localWatchlist.length===0){
  listEl.innerHTML = `<div class="textmwl">
 <h5>Your watchlist is looking a little empty...</h5>
 <a href="index.html">Let’s add some movies!</a>
</div>`
}
}

function handleClickAD(id){
  const istheid = (element) => element === id
  console.log(istheid)
  const indexRender = localWatchlist.findIndex(istheid) 
  if(indexRender !== -1){
    localWatchlist = localWatchlist.filter(element => element !== id) 
    document.getElementById(`id-${id}`).innerHTML = ` <a data-idd=${id}  id=id-${id}> + Watchlist</a>`
  }else{
    localWatchlist.push(id)
    document.getElementById(`id-${id}`).innerHTML = ` <a data-idd=${id}  id=id-${id}> - Watchlist</a>`
  }
  localStorage.setItem('watchlist', JSON.stringify(localWatchlist));
}

function renderWatchList(arr){
  let html =''
   listEl.innerHTML = ''
   arr.forEach(element => {
    html +=`<div class="boxmovie" id='box-delete-${element.imdbID}'>
    <img src=${element.Poster} alt="">
    <div class="infomovie">
      <h1>${element.Title}</h1>
      <div class="timemovie">
        <p>${element.Runtime}</p>
        <p>${element.Genre}</p>
        <a class='addlist' data-deletelist=${element.imdbID}  id=id-${element.imdbID}> - Watchlist</a>
      </div>
      <p class='textColor'>${element.Plot}</p>
    </div>
  </div>   
  `  
   });
   listEl.innerHTML = html
}

if(watchlishInner){
  inputEl.style.display ='none'
  listEl.innerHTML =`<h1>Hello<h1>`
  if (localWatchlist && localWatchlist.length > 0) {
    Promise.all(localWatchlist.map(async element => {
      const res = await fetch(`https://www.omdbapi.com/?apikey=3f9608a5&i=${element}`);
      const data = await res.json();
      return data;
  })).then(completeData => {
      renderWatchList(completeData);
  })
} else {
 listEl.innerHTML = `<div class="textmwl">
 <h5>Your watchlist is looking a little empty...</h5>
 <a href="index.html">Let’s add some movies!</a>
</div>`
}

}



