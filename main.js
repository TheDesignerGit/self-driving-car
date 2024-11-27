const carCanvas = document.querySelector('#carCanvas')
carCanvas.width = 200
const networkCanvas = document.querySelector('#networkCanvas')
networkCanvas.width = 300

const carCtx = carCanvas.getContext('2d')             // get access to canvas methods
const networkCtx = networkCanvas.getContext('2d')             // get access to canvas methods

const road = new Road(carCanvas.width/2, carCanvas.width*0.9)
const car = new Car(road.getLaneCenter(1),100,30,50, "AI")        // arg-1 = which lane to start on
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)
]

animate()

function animate (time) {
    for(let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders, [])             // update the traffic, keeping in mind the borders
    }
    car.update(road.borders, traffic)
    carCanvas.height = window.innerHeight          // allow browser window changes to update the canvas size
    networkCanvas.height = window.innerHeight          // allow browser window changes to update the canvas size

    // ..: draw the elements to the canvas
    carCtx.save()
    carCtx.translate(0, -car.y+carCanvas.height*0.7)    // 'camera' follows car over Y-axis
    road.draw(carCtx)
    for(let i=0; i<traffic.length; i++){
        traffic[i].draw(carCtx, "red")
    }
    car.draw(carCtx, "blue")               // note: car will be an object with a 'draw' method that will take in 'ctx'

    carCtx.restore()

    networkCtx.lineDashOffset = (-1)*time*0.01      // animate the visualiser dashes
    Visualiser.drawNetwork(networkCtx, car.brain)
    requestAnimationFrame(animate)          // run function repeatedly
}