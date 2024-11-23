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
        this.damaged = false

        // this.polygon = null             // 

        this.sensor = new Sensor(this)
        this.controls = new Controls()
    }

    update(roadBorders){
        this.#move()
        this.polygon = this.#createPolygon()
        this.damaged = this.#assessDamage(roadBorders)
        this.sensor.update(roadBorders)
    }

    #assessDamage(roadBorders) {
        for(let i=0; i<roadBorders.length; i++) {
            if(polysIntersect(this.polygon, roadBorders[i])) true
        }
        return false
    }

    // helper for detecting collisions
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

    draw(ctx){
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

        if(this.damaged) ctx.fillStyle='gray'
        else ctx.fillStyle='black'

        // .:. new way to draw car
        ctx.beginPath()
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
        for(let i=0; i<this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
        }
        ctx.fill()

        this.sensor.draw(ctx)           // draw the sensors
    }
}