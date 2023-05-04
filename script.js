const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const image = document.getElementById("source");
const tree = document.getElementById("tree");
const playerImage = document.getElementById('wolf')
const playerSpeed = 10

// {x:3812, y:39021}
// {x: 0, y:0. width: 132, height: 192}
function pointInsideRectangle(point, rectangle){
    if(point.x > rectangle.x && point.x < rectangle.x+rectangle.width && point.y > rectangle.y && point.y < rectangle.y + rectangle.height){
        return true
    }
    return false
}

// {x: 0, y:0. width: 132, height: 192}
function rectanglesColide(rectangle1, rectangle2){
    // for(let i=0; i<=1; i++){
    //     for(let y=0; y<=1; y++){
    //         if(pointInsideRectangle({x:rectangle1.x+i*rectangle1.width,y:rectangle1.y+i*rectangle1.height }, rectangle2)){
    //             return true
    //         }
    //     }
    // }
    // for(let z=0; z<=1; z++){
    //     for(let w=0; w<=1; w++){
    //         if(pointInsideRectangle({x:rectangle2.x+w*rectangle2.width,y:rectangle2.y+z*rectangle2.height }, rectangle1)){
    //             return true
    //         }
    //     }
    // }
    return false
}

window.addEventListener("keydown", (e) => {
    let collision = rectanglesColide(player, tree)
    console.log(collision);
    switch(e.key){
        case 'w':
            player.y -= collision ? 0 : playerSpeed
            break
        case 'a':
            player.x -= collision ? 0 : playerSpeed
            break
        case 's':
            player.y += collision ? 0 : playerSpeed
            break
        case 'd':
            player.x += collision ? 0 : playerSpeed
    }
})
const player = {
    x: 100,
    y: 100,
    width: 64,
    height: 64,
    health: 100,
}

ctx.fillStyle = '#000000'
ctx.drawImage(image, 50, 50, 64, 64);
const map = [
    [0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,1],
    [0,1,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
]
const allTrees = []
map.forEach((row, index) => {
    row.forEach((col,innerIndex) => {
        if(col === 1){
            allTrees.push({
                x: innerIndex*100,
                y: index*100,
                width: 100,
                height: 100
            })
        }
    })
})
console.log(allTrees);

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    map.forEach((row, index) => {
        row.forEach((col,innerIndex) => {
            ctx.fillStyle = '#46fa70'
            ctx.fillRect(innerIndex*100,index*100, 100,100)
            ctx.fillStyle = col === 0 ? '#1cad43' : '#1cad43'
            ctx.fillRect(innerIndex*100+1,index*100+1, 98,98)
            if(col === 1){
                ctx.drawImage(tree, innerIndex*100+18, index*100+18, 64, 64);
            }
        })
    })
    
    ctx.drawImage(wolf, player.x-32, player.y-32, 64, 64);
    window.requestAnimationFrame(animate)
}
animate()