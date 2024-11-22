const canvas = document.querySelector('#myCanvas')
canvas.width = 200

const ctx = canvas.getContext('2d')             // get access to canvas methods
const road = new Road(canvas.width/2, canvas.width*0.9)
const car = new Car(road.getLaneCenter(1),100,30,50)        // arg1= which lane to start on


animate()

function animate () {
    car.update()
    canvas.height = window.innerHeight          // allow browser window changes to update the canvas size

    ctx.save()
    ctx.translate(0, -car.y+canvas.height*0.7)    // camera follows car
    road.draw(ctx)
    car.draw(ctx)               // note: car will be an object with a 'draw' method that will take in 'ctx'

    ctx.restore()
    requestAnimationFrame(animate)          // run function repeatedly
}