(function(){
    const pokeFinder = {
        init: function(){
            this.cacheDOM()
            this.bindings()
        },
        cacheDOM: function(){
            this.submit = document.querySelector('#submit')
            this.form = document.querySelector('#pokeForm')
            this.img = document.querySelector('#pokeImg')
            this.card = document.querySelector('#card')
            this.closeCard = document.querySelector('#close')
        },

        bindings: function(){
            this.submit.addEventListener('click',this.renderPokemon.bind(this))
            this.closeCard.addEventListener('click',this.closeCardFunc.bind(this))
        },

        render: function(data){
            this.img.src = data.sprites.other['official-artwork'].front_default
            this.card.style = 'display: block'
        },
        fetchPokemon: async function(pokemon){
            const get = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
            const data = await get.json()
            return data
        },
        renderPokemon: function(ev){
            ev.preventDefault()
            this.fetchPokemon(this.form.pokeInput.value)
            .then(data => {this.render(data)})
            .catch(err => {
                console.log('there is an error:',err.message)
                alert('Must enter a valid pokemon name')})
                this.form.pokeInput.value = ''
        },

        closeCardFunc: function(ev){
            ev.target.parentElement.style = 'display: none'
            this.img.src = ''
        }

    }
    pokeFinder.init()

    pokeCards = {
        pag : 0,
        init: function(){
            this.cacheDOM()
            this.bindings()
            this.render()
        },

        cacheDOM: function(){
            this.container = document.querySelector('#cardBox')
            this.leftPag = document.querySelector('#leftPag')
            this.rightPag = document.querySelector('#rightPag')
        },

        bindings: function(){
            this.rightPag.addEventListener('click',()=>{
                if(this.pag<1069){
                    this.pag+=50
                    this.fetchAllData(String(this.pag)).then(data => this.renderCards(data))
                }                
            })
            this.leftPag.addEventListener('click',()=>{
                if(this.pag>=50){
                    this.pag-=50
                    this.fetchAllData(String(this.pag)).then(data => this.renderCards(data))
                }
                
                    })
        },

        render: function(){
            this.fetchAllData().then(data => this.renderCards(data))
        },
        fetchAllData: async function(offSet=0){
            const get = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=50&offset=${offSet}`)
            const data = await get.json()
            return data
        },
        fetchPokemon: async function(pokemon){
            const get = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
            const data = await get.json()
            return data
        },

        renderCards: async function(data){
            this.container.innerHTML = '<div id="loading" style="display: block"></div>'
            console.log(this.container.innerHTML)     
            let _pokeArr = Promise.all(data.results.map(pokemon => this.fetchPokemon(pokemon.name)))
            _pokeArr.then(data=>data.map(poke =>this.dataPokemon(poke,poke.name)))
        },

        dataPokemon: function(data,name){
            let div = document.createElement('div')
            div.setAttribute('id',name)
            div.classList = 'pokeCard'
            let h3 = document.createElement('h3')
            h3.innerHTML = name
            let divImg = document.createElement('div')
            let img = document.createElement('img')
            img.src = data.sprites.front_default
            divImg.appendChild(img)
            div.appendChild(divImg)
            div.appendChild(h3)
            this.container.appendChild(div)
            div.addEventListener('click',(ev)=>{
                this.fetchPokemon(name)
                    .then(data => pokeFinder.render(data))
            })
            const loading = document.querySelector('#loading')
            loading.style = 'display : none'
        }

        
    }
    pokeCards.init()
})()

