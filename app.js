const hero = document.getElementById('hero');
const previous = document.querySelector('.previous');
const next = document.querySelector('.next');
const sliderWrapper = document.querySelector('.slider__wrapper');
const sliderParent = document.querySelector('.slider');
const sliderLeft = sliderParent.getBoundingClientRect().left;
const slider = document.querySelector('.slider__inner');
let tiles = [];
let trans = 0;
let idx = 0;

let nav = true; // used to disable next and previous buttons to when the slider is animating
let width = 0;
let initialTileLengh = 0;
let buttonClicked = false; // used to determine if the next or pevious button has been clicked for the mouseup event.
let mouseX = 0;
let mousedown = false;

// API
let projects = [];

async function setProjects(){
    const url = './projects.json'
    const request = await fetch(url);
    const response = await request.json();
    projects = response;
    for(let i = 0; i < 3; i++){
        projects.forEach((project, index) => {
            let tile = document.createElement('div');
            tile.classList.add('tile');
            tile.classList.add(index);
            let backgroundImage = document.createElement('img');
            backgroundImage.src = project.image;
            backgroundImage.setAttribute('draggable', 'false')
            tile.appendChild(backgroundImage);
            let header = document.createElement('h3');
            header.classList.add('tile__header');
            header.textContent = `${index}`;
            tile.appendChild(header);
            slider.appendChild(tile);
            tile.addEventListener('click', (e) => {
                if(Math.abs(e.clientX - mouseX) < 5){
                    idx = index;
                    for(let i = 0; i < tiles.length; i++){
                        if(tiles[i] === tile){
                            console.log(tiles[i].classList[1])
                            slider.style.transform = `translate3d(-${(i * 200)}px, 0, 0)`;
                            setTimeout(() => {
                                slider.style.transition = '0s';
                
                                setTimeout(() => {
                                    slider.style.transform = `translate3d(-${(idx * 200) + trans}px, 0, 0)`;
                                }, 10)
                        
                                setTimeout(() => {
                                    slider.style.transition = '0.5s';
                                }, 100)
                                setBackground()
                            }, 500)       
                        }
                    }   
                }
            })
        })
    }
    tiles = [...document.querySelectorAll('.tile')];
    initialTileLengh = tiles.length / 3;
    trans = (tiles.length * 200) / 3;
    width = slider.getBoundingClientRect().width;
    
    slider.style.transform = `translate3d(-${((idx) * 200) + trans}px, 0, 0)`;
    setBackground();
}

setProjects()

previous.addEventListener('click', () => {
    if(nav){
        idx--;
        setNav();
        resetSlider(idx);
    }
})

next.addEventListener('click', (e) => {
    if(nav){
        idx++;
        setNav();
        resetSlider(idx);
    }
})

previous.addEventListener('mousedown', () => {
   buttonClicked = true;
})

next.addEventListener('mousedown', (e) => {
    buttonClicked = true;
})

sliderParent.addEventListener('mousedown', (e) => {
    mouseX = e.clientX;
    mousedown = true;
    slider.style.transition = '0s';
})

window.addEventListener('mousemove', (e) => {
    if(mousedown){
        slider.style.transform = `translate3d(${((((idx) * 200) + trans) - (e.clientX - mouseX)) * -1}px, 0, 0)`;
    }
})

window.addEventListener('mouseup', (e) => {
    mousedown = false;
    slider.style.transition = '0.5s';
    if(!buttonClicked && Math.abs(e.clientX - mouseX) >= 5){
        let obj = {
            idx: 0,
            dist: Math.abs(sliderLeft - tiles[0].getBoundingClientRect().left)
        }
    
        for(let i = 0; i < tiles.length; i++){
            let {left} = tiles[i].getBoundingClientRect();
            if(Math.abs(sliderLeft - left) < obj.dist){
                obj.idx = i;
                obj.dist = Math.abs(sliderLeft - left);
            }
        }
        
        idx = obj.idx;
      
        let item = tiles[idx].classList[1];
        slider.style.transform = `translate3d(-${((idx) * 200)}px, 0, 0)`;
        setTimeout(() => {
            slider.style.transition = '0s';
            idx = +item;
            setBackground()
            let newtrans = (idx * 200) + trans ;
            if(nav){
                slider.style.transform = `translate3d(-${newtrans}px, 0, 0)`;
            }
            setTimeout(() => {
                slider.style.transition = '0.5s';
                idx = +item;
                // setBackground()
            }, 100)
        }, 500)
    }
   buttonClicked = false;
})

function resetSlider(index){
    slider.style.transform = `translate3d(-${(idx * 200) + trans}px, 0, 0)`;
    setTimeout(() => {
        if(index >= initialTileLengh) idx = 0;
        if(index < 0) idx = initialTileLengh - 1;

        slider.style.transition = '0s';
        let pos = (idx * 200) + trans;

        setTimeout(() => {
            slider.style.transform = `translate3d(-${pos}px, 0, 0)`;
        }, 10)

        setTimeout(() => {
            slider.style.transition = '0.5s';
        }, 100)
        setBackground()
    }, 500)
    
}

function setNav(){
    nav = false;
    setTimeout(() => {
        nav = true;
    }, 600)
}

function setBackground(){
    hero.style.backgroundImage = `url(${projects[idx].image})`;
}