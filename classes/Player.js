import {INITIAL_FRAME, PATH_SPACESHIP_ENGINE, PATH_SPACESHIP_IMAGE, PATH_SPACESHIP_SPRITE} from "../utils/constants.js";
import Projectile from "./Projectile.js";

class Player{
    constructor(canvasWidth, canvasHeight){
        
        this.alive = true
        this.width = 48 * 2;
        this.height = 48 * 2;
        this.velocity = 5
        this.position = {
            x : canvasWidth / 2 - this.width / 2 , 
            y : canvasHeight - this.height - 30,
        };
        this.image = this.getImage(PATH_SPACESHIP_IMAGE);
        this.engineImage = this.getImage(PATH_SPACESHIP_ENGINE)
        this.engineSprites = this.getImage(PATH_SPACESHIP_SPRITE)

        this.sx = 0;
        this.frameCounter = INITIAL_FRAME;
    }
    getImage(path){
        const image = new Image();
        image.src = path;
        return image;        
    }
    moveLeft(){this.position.x -= this.velocity }
    moveRight(){this.position.x += this.velocity }
    
    draw(ctx){
        ctx.drawImage(
            this.image, 
            this.position.x, 
            this.position.y,
            this.width,
            this.height,
        );
        ctx.drawImage(
            this.engineSprites, 
            this.sx,
            0,
            48,
            48,
            this.position.x,
            this.position.y + 10,
            this.width,
            this.height,            
        );
        ctx.drawImage(
            this.engineImage,
            this.position.x,
            this.position.y + 8,
            this.width,
            this.height,
        )
        this.update()
    }
    update(){
        if(this.frameCounter === 0){
            this.sx = this.sx === 96 ? 0 : this.sx + 48;
            this.frameCounter = INITIAL_FRAME;
        }
        this.frameCounter--;
    }
    shoot(projectiles){
        const p = new Projectile({
            x:this.position.x + this.width / 2 - 1,
            y:this.position.y + 2,
        }, -10
    );
    projectiles.push(p);
    }
    hit(projectile){
        return (
            projectile.position.x >= this.position.x + 20 &&
            projectile.position.x <= this.position.x + 20 + this.width - 40 &&
            projectile.position.y >= this.position.y + 20 &&
            projectile.position.y <= this.position.y + 20 + this.height - 40
        );
    }
}

export default Player;