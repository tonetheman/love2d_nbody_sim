let game = null;
let gameOptions = {
    width : 800,
    height : 600,
    body_count : 1000,
    GRAVITY : 39.8,
    SOFT : 0.1,
    MASS_LIMIT : 1000.0
};
let bodies = [];

function init_bodies() {
    for (let i=0;i<gameOptions.body_count;i++) {
        bodies[i] = {
            x : Phaser.Math.Between(0,gameOptions.width),
            y : Phaser.Math.Between(0,gameOptions.height),
            z : 0,
            vx : 0, vy : 0, vz : 0,
            ax : 0, ay : 0, az : 0,
            mass : 100*Phaser.Math.Between(0,100),
            spr : null
        };
    }

    
    bodies[0]  = {
        x : 800/2, y :600/2, z : 0,
        vx : 0.0, vy : 0.0, vz : 0.0,
        ax : 0.0, ay : 0.0, az : 0.0,
        mass : gameOptions.MASS_LIMIT*10
    }
    
    bodies[1] = {
        x : Phaser.Math.Between(0,800), y: Phaser.Math.Between(0,800), z : 0,
        vx : 0.0, vy : 0.0, vz : 0.0,
        ax : 0.0, ay : 0.0, az : 0.0,
        mass : gameOptions.MASS_LIMIT - Phaser.Math.Between(0,500)
    };
    bodies[2] = {
        x :Phaser.Math.Between(0,800), y : Phaser.Math.Between(0,600), z : 0,
        vx : 0.0, vy : 0.0, vz : 0.0,
        ax : 0.0, ay :  0.0, az : 0.0,
        mass : gameOptions.MASS_LIMIT - (Phaser.Math.Between(0,500))
    }
    

}

function update_pos(dt) {
    for(let i=0;i<gameOptions.body_count;i++) {
        let b = bodies[i];
        b.x += (b.vx*dt);
        b.y += (b.vy*dt);
    }
}

function update_vel(dt) {

    for (let i=0;i<gameOptions.body_count;i++) {
        let b = bodies[i];
        b.vx = b.vx + (b.ax*dt);
        b.vy = b.vy + (b.ay*dt);
        b.vz = b.vz + (b.az*dt);
    }
}

/*
function init_bodies()
    bodies[1]  = {
        x = 800/2, y=600/2, z = 0,
        vx = 0.0, vy = 0.0, vz = 0.0,
        ax = 0.0, ay = 0.0, az = 0.0,
        mass = MASS_LIMIT * 10
    }
    bodies[2] = {
        x = 800*math.random(), y=600*math.random(), z = 0,
        vx = 0.0, vy = 0.0, vz = 0.0,
        ax = 0.0, ay = 0.0, az = 0.0,
        mass = MASS_LIMIT - (500*math.random())
    }
    bodies[3] = {
        x = 800*math.random(), y=600*math.random(), z = 0,
        vx = 0.0, vy = 0.0, vz = 0.0,
        ax = 0.0, ay = 0.0, az = 0.0,
        mass = MASS_LIMIT - (500*math.random())
    }
end
*/

function update_acc(dt){
    for (let i=0;i<gameOptions.body_count;i++) {
        let ax = 0.0
        let ay = 0.0
        let az = 0.0
        let b = bodies[i]
        for(let j=0;j<gameOptions.body_count;j++) {
            if (i!=j) {
                let c = bodies[j]
                let dx = c.x - b.x
                let dy = c.y - b.y
                let dz = c.z - b.z
                let dist_sq = dx*dx + dy*dy + dz*dz
                let f = (gameOptions.GRAVITY*c.mass) / (
                    dist_sq * Math.sqrt(dist_sq + gameOptions.SOFT)
                )
                ax = ax + (dx*f)
                ay = ay + (dy*f)
                az = az + (dz*f)
            }
        }
        b.ax = ax
        b.ay = ay
        b.az = az

    }
}


class GameScene extends Phaser.Scene {
    constructor() {
        super("game");
    }
    make_debug_graphics() {
        let _this = this;
        function _gg(name,color) {
            let graphics = _this.add.graphics();
            graphics.lineStyle(8,color);
            graphics.moveTo(0,0);
            graphics.strokeRect(0,0,8,8);
            graphics.generateTexture(name,8,8);
            graphics.destroy();    
        }

        _gg("red",0xff0000);
        _gg("green",0x00ff00);
        _gg("blue",0x0000ff);
    }
    preload() {

    }
    create() {
        this.make_debug_graphics();
        init_bodies();
        for(let i=0;i<gameOptions.body_count;i++) {
            let b = bodies[i];
            b.spr = this.add.image(b.x,b.y,"blue").setOrigin(0,0);
        }

    }
    update(ts,dt) {
        dt /= 1000.0;
        //console.log(ts,dt);
        update_pos(dt);
        update_vel(dt);
        update_acc(dt);
        for (let i=0;i<gameOptions.body_count;i++) {
            let b = bodies[i];
            b.spr.x = b.x;
            b.spr.y = b.y;
        }
    }
}

function mainline() {
    game = new Phaser.Game(gameOptions);
    game.scene.add("game",GameScene,true);
    game.scene.start("game");
}

window.onload = mainline;