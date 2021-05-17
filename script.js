const submit = document.querySelector('#submit')
const form = document.querySelector('#pokeForm')
const card = document.querySelector('#card') //contiene la tarjeta de los pokemons
const container = document.querySelector('#container')
const img = document.querySelector('#pokeImg')
const closeCard = document.querySelector('#close')

//paginacion data
let pag = 0


// trae data de cada pokemon segun el nombre retorna una promesa
const getPokemon = async (pokemon) => {
    const get = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    const data = await get.json()
    return data
}

// evento del submit que llama la funcion getPokemon() la cual llama a la funcion render()
submit.addEventListener('click',(ev)=>{
    ev.preventDefault()
    getPokemon(form.pokeInput.value)
        .then(data => render(data))
        .catch(err => {
            console.log('there is an error:',err.message)
            alert('Must enter a valid pokemon name')})
            form.pokeInput.value = ''
})


//renderiza la tarjeta del pokemon elegido
const render = (data) => {
    
    img.src = data.sprites.other['official-artwork'].front_default
    card.style = 'display: block'
}

closeCard.addEventListener('click',(ev) => {
    ev.target.parentElement.style = 'display: none'
    img.src = ''
})


// trae data de todos los pokemon con su url
const getData = async(offSet=0)=>{
    const get = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=50&offset=${offSet}`)
    const data = await get.json()
    return data
}
/////****  llamada a la fucion que renderiza la grilla de pokemon  ****////// 


getData().then(data => renderCards(data))

//llama a cada uno de los pokemon y realiza un fetch en sus url
const renderCards = async (data) => {
    container.innerHTML = ` <div id="leftPag" class="pagination">
                                <div id="arrowLeft"></div>
                            </div>
                            <div id="loading" style="display: block"></div>
                            <div id="rightPag" class="pagination">
                                <div id="arrowRight"></div>
                            </div>`
    //llama los elementos para la paginacion
    const leftPag = document.querySelector('#leftPag')
    const rightPag = document.querySelector('#rightPag')

    //llama la funcion getData() con el nuevo offset para los datos de la api
    rightPag.addEventListener('click',()=>{
        if(pag<1069){
            pag+=50
            getData(String(pag)).then(data => renderCards(data))
        }
        
    })

    leftPag.addEventListener('click',()=>{
        if(pag>=50){
            pag-=50
            getData(String(pag)).then(data => renderCards(data))
        }
        
    })
//genera una array de promesas para luego iterar con la funcion que renderiza
    let _pokeArr = Promise.all(data.results.map(pokemon => getPokemon(pokemon.name)))
    console.log(_pokeArr)
    _pokeArr.then(data=>data.map(poke =>dataPokemon(poke,poke.name)))
}
// renderiza las tarjetas de cada pokemon
const dataPokemon = (data,name) => {
    let div = document.createElement('div')
    div.setAttribute('id',name)
    div.classList = 'pokeCard'
    let h3 = document.createElement('h3')
    h3.innerHTML = name
    container.appendChild(div)
    let divImg = document.createElement('div')
    let img = document.createElement('img')
    img.src = data.sprites.front_default
    divImg.appendChild(img)
    div.appendChild(divImg)
    div.appendChild(h3)
    div.addEventListener('click',(ev)=>{
        getPokemon(name)
        .then(data => render(data))
    })
    const loading = document.querySelector('#loading')
loading.style = 'display : none'
}


