const canvas = document.querySelector('#myCanvas')
canvas.width = 200

const ctx = canvas.getContext('2d')
const car = new Car(100,100,30,50)


animate()

function animate () {
    car.update()
    canvas.height = window.innerHeight
    car.draw(ctx)               // note: car will be an object with a 'draw' method that will take in 'ctx'
    requestAnimationFrame(animate)
}