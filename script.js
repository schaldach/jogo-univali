const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const tree = document.getElementById("tree");
const pFront = document.getElementById('pFront')
const pBack = document.getElementById('pBack')
const pLeft = document.getElementById('pLeft')
const pRight = document.getElementById('pRight')
const oniF = document.getElementById('oniF')
const oniB = document.getElementById('oniB')
const oniL = document.getElementById('oniL')
const oniR = document.getElementById('oniR')
const brick = document.getElementById('brick')
const floorMap = document.getElementById('map')
const custom = document.getElementById('custom')
const katanaR = document.getElementById('katanaR')
const katanaL = document.getElementById('katanaL')
const katanU = document.getElementById('katanU')
const katanD = document.getElementById('katanD')
const floorEnd = document.getElementById('floorEnd')
const leafs = document.getElementById('leafs')
const floorStart = document.getElementById('floorStart')
const scoreDisplay = document.getElementById('score')
const tS = 50
const floor = document.getElementById('floor')
const menu = document.getElementById('menu')
let points = 0
let gameStarted = false
let allEnemies = [...initialOnis]

function start(){
    menu.classList.add('hidden')
    gameStarted = true
}

const directions = {
    'front': pBack,
    'back': pFront,
    'left': pLeft,
    'right': pRight,
}
const oniDirections = {
    'front': oniB,
    'back': oniF,
    'left': oniL,
    'right': oniR,
}

const katanaDirections = {
    'front': katanU,
    'back': katanD,
    'left': katanaL,
    'right': katanaR,
}

function playerCollision(x,y){
    if( y<0 || y>15 || x<0 || x>15||map[y][x] === 1 ){
        return true
    }
}

window.addEventListener("keypress", (e) => {
    
    if(!gameStarted || player.attack){return}
    switch(e.key){
        case 'w':
            player.direction = 'front'
            if(!playerCollision(player.x, player.y-1)){
                player.y -= 1
            }
            break
        case 'a':
            player.direction = 'left'
            if(!playerCollision(player.x-1, player.y)){
                player.x -= 1
            }
            break
        case 's':
            player.direction = 'back'
            if(!playerCollision(player.x, player.y+1)){
                player.y += 1
            }
            break
        case 'd':
            player.direction = 'right'
            if(!playerCollision(player.x+1, player.y)){
                player.x += 1
            }
            break
    }
    if(e.code === 'Space' && !player.cooldown){
        player.attack = true
        player.cooldown = true
        setTimeout(() => {player.attack = false}, 100)
        setTimeout(() => {player.cooldown = false}, 500)
    }
})

let player = {
    x: 2,
    y: 12,
    direction: 'back',
    attack: false,
    cooldown: false,
}

ctx.fillStyle = '#000000'
const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1],
    [1,1,1,1,0,1,0,1,0,1,0,1,1,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1],
    [1,1,1,1,0,1,1,0,1,0,1,0,1,0,1,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1,1,1,1,0,1,1,0,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]
const allTrees = []
map.forEach((row, index) => {
    row.forEach((col,innerIndex) => {
        if(col === 1){
            allTrees.push({
                x: innerIndex*50,
                y: index*50,
            })
        }
    })
})
console.log(allTrees);

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(floorMap, 0,0,800,800)
    ctx.drawImage(tree, 2*tS, 2*tS, tS, tS)
    if(player.x === 2 && player.y === 2){
        restart(true)
    }
    if(player.attack){
        let dimensions = {
            x: player.direction === 'left' ? player.x-2 : player.direction === 'right' ? player.x+1 : player.x,
            y:player.direction === 'front' ? player.y-2 : player.direction === 'back' ? player.y+1 : player.y,
            width: player.direction === 'right' || player.direction === 'left' ? tS*2:tS,
            height: player.direction === 'front' || player.direction === 'back' ? tS*2:tS
        }
        ctx.drawImage(katanaDirections[player.direction], dimensions.x*tS, dimensions.y*tS, dimensions.width, dimensions.height)
    }
    allEnemies.forEach((enemy, index) => {
        ctx.globalAlpha = enemy.dead ? 0.25 : 1.0;
        const rightOni = oniDirections[enemy.path[enemy.pathIndex].direction]
        ctx.drawImage(rightOni, enemy.x*tS, enemy.y*tS, tS, tS)
        ctx.globalAlpha = 1.0;
        if(!enemy.dead && enemy.x === player.x && enemy.y === player.y){
            restart(false)
        }
        if(player.attack && !enemy.dead){
            if(player.direction === 'back'){
                if(enemy.x === player.x && (enemy.y === player.y +1 || enemy.y === player.y +2) ){
                    setTimeout(() => {allEnemies[index].dead = false}, 3500)
                    enemy.dead = true
                    points ++
                }
            }
            if(player.direction === 'front'){
                if(enemy.x === player.x && (enemy.y === player.y -1 || enemy.y === player.y -2) ){
                    setTimeout(() => {allEnemies[index].dead = false}, 3500)
                    enemy.dead = true
                    points ++
                }
            }
            if(player.direction === 'left'){
                if(enemy.y === player.y && (enemy.x === player.x -1 || enemy.x === player.x -2) ){
                    setTimeout(() => {allEnemies[index].dead = false}, 3500)
                    enemy.dead = true
                    points ++
                }
            }
            if(player.direction === 'right'){
                if(enemy.y === player.y && (enemy.x === player.x +1 || enemy.x === player.x +2) ){
                    setTimeout(() => {allEnemies[index].dead = false}, 3500)
                    enemy.dead = true
                    points ++
                }
            }
        }
    })
    ctx.drawImage(directions[player.direction], player.x*tS, player.y*tS, tS, tS);
    window.requestAnimationFrame(animate)
}

function restart(win){
    player = {
        x: 2,
        y: 12,
        direction: 'back',
        attack: false
    }
    allEnemies = [...initialOnis]
    custom.innerHTML = win ? 'Você venceu!' : 'Você morreu!'
    scoreDisplay.innerHTML = `Você matou ${points} demônios`
    menu.classList.remove('hidden')
    points = 0
    gameStarted = false
}
animate()
setInterval(() => {
    if(!gameStarted){return}
    allEnemies.forEach(enemy => {
        if(enemy.pathIndex === enemy.path.length-1){
            enemy.pathIndex = 0
        }
        enemy.pathIndex++
        enemy.x = enemy.path[enemy.pathIndex].x
        enemy.y = enemy.path[enemy.pathIndex].y
    })
}, 100)