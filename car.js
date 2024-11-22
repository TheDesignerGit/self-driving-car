class Car {
    constructor(x,y,w,h){
        this.x = x
        this.y = y
        this.w = w
        this.h = h

        this.speed = 0
        this.acceleration = 0.2
        this.maxSpeed = 3
        this.friction = 0.05
        this.angle = 0

        this.sensor = new Sensor(this)
        this.controls = new Controls()
    }

    update(){
        this.#move()
        this.sensor.update()
    }

    #move() {
        // ..: forward and reverse
        if(this.controls.forward) this.speed+=this.acceleration         // gradually accelate the car
        if(this.controls.reverse) this.speed-=this.acceleration
        if(this.speed > this.maxSpeed) this.speed = this.maxSpeed      // capping the forward speed
        if(this.speed < -this.maxSpeed/2) this.speed = -this.maxSpeed/2      // capping the reverse speed

        // ..: friction
        if(this.speed > 0) this.speed -= this.friction
        if(this.speed < 0) this.speed += this.friction
        if(Math.abs(this.speed) < this.friction) this.speed = 0

        // ..: left and right steering
        if(this.speed != 0) {
            const flip = this.speed>0 ? 1: -1           // flip the controls when moving in reverse
            if(this.controls.left) this.angle += 0.03* flip
            if(this.controls.right) this.angle -= 0.03* flip
        }

        this.x -= Math.sin(this.angle)*this.speed
        this.y -= Math.cos(this.angle)*this.speed
        // this.y -= this.speed                // update the speed vale
    }

    draw(ctx){
        // rotate the car - left/right steering
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(-this.angle)

        //draw the car
        ctx.beginPath()
        ctx.rect(
            -this.w/2, 
            -this.h/2,
            this.w,
            this.h
        )
        ctx.fill()

        ctx.restore()

        this.sensor.draw(ctx)           // draw the sensors
    }
}