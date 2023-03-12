
const hero = document.getElementById('hero');

const previous = document.querySelector('.previous');
const next = document.querySelector('.next');
const sliderWrapper = document.querySelector('.slider__wrapper');
const sliderParent = document.querySelector('.slider');
const sliderLeft = sliderParent.getBoundingClientRect().left;
const slider = document.querySelector('.slider__inner');
let tiles = [...document.querySelectorAll('.tile')];
const initialTileLengh = tiles.length;
let idx = 0;
let {width} = slider.getBoundingClientRect();
let nav = true;
let trans = tiles.length * 200;
let buttonClicked = false;

for(let i = 0; i < 2; i++){
    tiles.forEach((tile, idx) => {
        if( i == 0){
            tile.classList.add(idx);
            let header = document.createElement('h3');
            header.classList.add('tile__header');
            header.textContent = `${idx}`;
            tile.appendChild(header);
        }
       
        let clone = tile.cloneNode(true);
        clone.classList.add('clone');
        slider.appendChild(clone);
    })
}

tiles = [...document.querySelectorAll('.tile')];
slider.style.transform = `translate3d(-${((idx) * 200) + trans}px, 0, 0)`;

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
        resetSlider(idx)
    }
})

previous.addEventListener('mousedown', () => {
   buttonClicked = true;
})

next.addEventListener('mousedown', (e) => {
    buttonClicked = true;
})

let mouseX = 0;
let mousedown = false;

sliderParent.addEventListener('mousedown', (e) => {
    mouseX = e.clientX;
    mousedown = true;
    slider.style.transition = '0s';
    console.log('mousedown');
})

window.addEventListener('mousemove', (e) => {
    if(mousedown){
        slider.style.transform = `translate3d(${((((idx) * 200) + trans) - (e.clientX - mouseX)) * -1}px, 0, 0)`;
    }
})

window.addEventListener('mouseup', (e) => {
    mousedown = false;
    if(!buttonClicked){
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
        slider.style.transition = '0.5s';
        idx = obj.idx;
      
        let item = tiles[idx].classList[1];
        slider.style.transform = `translate3d(-${((idx) * 200)}px, 0, 0)`;
        setTimeout(() => {
            slider.style.transition = '0s';
            idx = +item;
            console.log(idx)
            let newtrans = (idx * 200) + trans ;
            if(nav){
                slider.style.transform = `translate3d(-${newtrans}px, 0, 0)`;
            }
            
            setTimeout(() => {
                slider.style.transition = '0.5s';
                idx = +item;
            }, 100)
        }, 500)
    }
   buttonClicked = false

   
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
    }, 500)
}

function setNav(){
    nav = false;
    setTimeout(() => {
        nav = true;
    },600)
}
