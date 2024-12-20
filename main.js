const carCanvas = document.querySelector('#carCanvas')
carCanvas.width = 200
const networkCanvas = document.querySelector('#networkCanvas')
networkCanvas.width = 300

const carCtx = carCanvas.getContext('2d')             // get access to canvas methods
const networkCtx = networkCanvas.getContext('2d')             // get access to canvas methods

const road = new Road(carCanvas.width/2, carCanvas.width*0.9)

// const car = new Car(road.getLaneCenter(1),100,30,50, "AI")        // 1st arg = which lane to start on
const N = 100                                    //   number of cars to generate
const cars = generateCars(N)
const mutationRate = 0.1
let bestCar = cars[0]
if(localStorage.getItem('bestBrain')) {                 // load the previously saved bestCar
    for(let i=0; i<cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'))
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain, mutationRate)
        }
    }
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(3), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -900, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(3), -900, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -1100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -1100, 30, 50, "DUMMY", 2)
]

animate()


function save() {                   // save the best progress
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain))
}

function discardSave() {
    localStorage.removeItem('bestBrain')
}

function generateCars(N){
    const cars = []
    for (let i=1 ; i<=N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
    }
    return cars
}

function animate (time) {
    for(let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders, [])             // update the traffic, keeping in mind the borders
    }
    for(let i=0; i<cars.length; i++){
        cars[i].update(road.borders, traffic)
    }
    bestCar = cars.find(              // select the car with lowest y-value (that's moved up the most)
        c => c.y == Math.min(
            ...cars.map(c => c.y)
        )
    )

    carCanvas.height = window.innerHeight          // allow browser window changes to update the canvas size
    networkCanvas.height = window.innerHeight          // allow browser window changes to update the canvas size

    // ..: draw the elements to the canvas
    carCtx.save()
    carCtx.translate(0, -bestCar.y+carCanvas.height*0.7)    // 'camera' follows car over Y-axis
    road.draw(carCtx)
    for(let i=0; i<traffic.length; i++){
        traffic[i].draw(carCtx, "red")
    }
    carCtx.globalAlpha = 0.2                    // make the cars transparent
    for(let i=0; i<cars.length; i++){
        cars[i].draw(carCtx, "blue")               // note: car will be an object with a 'draw' method that will take in 'ctx'
    }
    carCtx.globalAlpha = 1                      // stop transparency from affecting other elements on canvas
    bestCar.draw(carCtx, "blue", true) 

    carCtx.restore()

    // networkCtx.lineDashOffset = (-1)*time*0.01      // animate the visualiser dashes. resource intensive
    Visualiser.drawNetwork(networkCtx, bestCar.brain)       // print the brain of the hero car
    requestAnimationFrame(animate)          // run function repeatedly
}