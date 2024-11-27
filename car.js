class Car {
    constructor(x,y,w,h, controlType, maxSpeed=3){
        this.x = x
        this.y = y
        this.w = w
        this.h = h

        this.speed = 0
        this.acceleration = 0.2
        this.maxSpeed = maxSpeed
        this.friction = 0.05
        this.angle = 0
        this.damaged = false

        // this.polygon = null             // 

        if(controlType != "DUMMY"){
            this.sensor = new Sensor(this)          // pass the car object into the sensor
        }
        this.controls = new Controls(controlType)
    }

    update(roadBorders, traffic){
        if(!this.damaged){
            this.#move()
            this.polygon = this.#createPolygon()
            this.damaged = this.#assessDamage(roadBorders, traffic)
        }
        if(this.sensor){
            this.sensor.update(roadBorders, traffic)
        }
    }

    #assessDamage(roadBorders, traffic) {
        for(let i=0; i<roadBorders.length; i++) {
            // is there an intersection between the car and the border
            if(polysIntersect(this.polygon, roadBorders[i])) {return true}
        }
        for(let i=0; i<traffic.length; i++) {
            // is there an intersection between the car and the border
            if(polysIntersect(this.polygon, traffic[i].polygon)) {return true}
        }
        return false
    }

    // new way to draw the car (using polygon instead of rectangle)
    #createPolygon(){
        const points = []
        const rad = Math.hypot(this.w, this.h)/2
        const alpha = Math.atan2(this.w, this.h)
        points.push({
            x:this.x - Math.sin(this.angle - alpha)*rad,
            y:this.y - Math.cos(this.angle - alpha)*rad
        })
        points.push({
            x:this.x - Math.sin(this.angle + alpha)*rad,
            y:this.y - Math.cos(this.angle + alpha)*rad
        })
        points.push({
            x:this.x - Math.sin(Math.PI + this.angle - alpha)*rad,
            y:this.y - Math.cos(Math.PI + this.angle - alpha)*rad
        })
        points.push({
            x:this.x - Math.sin(Math.PI + this.angle + alpha)*rad,
            y:this.y - Math.cos(Math.PI + this.angle + alpha)*rad
        })
        return points
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

    draw(ctx, colour){
        if(this.damaged) ctx.fillStyle='gray'
        else ctx.fillStyle= colour

        // rotate the car - left/right steering
        // ctx.save()
        // ctx.translate(this.x, this.y)
        // ctx.rotate(-this.angle)

        // draw the car
        // ctx.beginPath()
        // ctx.rect(
        //     -this.w/2, 
        //     -this.h/2,
        //     this.w,
        //     this.h
        // )
        // ctx.fill()

        // ctx.restore()

        // .:. new way to draw car
        ctx.beginPath()
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
        for(let i=1; i<this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
        }
        ctx.fill()

        if(this.sensor){
            this.sensor.draw(ctx)           // draw the sensors
        }
    }
}