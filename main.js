const canvas = document.querySelector('#myCanvas')
canvas.width = 200

const ctx = canvas.getContext('2d')             // get access to canvas methods
const road = new Road(canvas.width/2, canvas.width*0.9)
const car = new Car(road.getLaneCenter(1),100,30,50, "KEYS")        // arg-1 = which lane to start on
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)
]

animate()

function animate () {
    for(let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders, [])             // update the traffic, keeping in mind the borders
    }
    car.update(road.borders, traffic)
    canvas.height = window.innerHeight          // allow browser window changes to update the canvas size

    // ..: draw the element to the canvas
    ctx.save()
    ctx.translate(0, -car.y+canvas.height*0.7)    // 'camera' follows car over Y-axis
    road.draw(ctx)
    for(let i=0; i<traffic.length; i++){
        traffic[i].draw(ctx, "red")
    }
    car.draw(ctx, "blue")               // note: car will be an object with a 'draw' method that will take in 'ctx'

    ctx.restore()
    requestAnimationFrame(animate)          // run function repeatedly
}