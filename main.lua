
local bodies = {}
local BODY_COUNT = 300
local GRAVITY = 39.8
local SOFT = 0.1
local LIMIT = 600
local W = 800
local H = 600
local MASS_LIMIT = 1000

function init_bodies()
    for i=1,BODY_COUNT do
        bodies[i] = {
            x = math.random() * W,
            y = math.random() * H,
            z = math.random()* LIMIT,
            vx = 0.0, vy = 0.0, vz = 0.0,
            ax = 0.0, ay = 0.0, az = 0.0,
            mass = 100*math.random()
        }
    end
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

function update_pos(dt)
    for i=1,BODY_COUNT do
        local b = bodies[i]
        b.x = b.x + (b.vx*dt)
        b.y = b.y + (b.vy*dt)
    end
end

function update_vel(dt)
    for i=1,BODY_COUNT do
        local b = bodies[i]
        b.vx = b.vx + (b.ax*dt)
        b.vy = b.vy + (b.ay*dt)
        b.vz = b.vz + (b.az*dt)
    end
end

function update_acc(dt)
    for i=1,BODY_COUNT do
        local ax = 0.0
        local ay = 0.0
        local az = 0.0
        local b = bodies[i]
        for j=1,BODY_COUNT do
            if i~=j then
                local c = bodies[j]
                local dx = c.x - b.x
                local dy = c.y - b.y
                local dz = c.z - b.z
                local dist_sq = dx*dx + dy*dy + dz*dz
                local f = (GRAVITY*c.mass) / (
                    dist_sq * math.sqrt(dist_sq + SOFT)
                )
                ax = ax + (dx*f)
                ay = ay + (dy*f)
                az = az + (dz*f)
            end
        end
        b.ax = ax
        b.ay = ay
        b.az = az
    end
end

function love.keyreleased(key)
    -- print(key)
    if key == "escape" then
        love.event.quit()
    end
    if key == "r" then
        init_bodies()
    end
end

function love.load()
    init_bodies()
end

function love.update(dt)
    update_pos(dt)
    update_vel(dt)
    update_acc(dt)
end

function love.draw()
    love.graphics.print("Current FPS: "..tostring(love.timer.getFPS( )), 10, 10)

    for i=1,BODY_COUNT do
        local b = bodies[i]
        if b.mass>0.8*MASS_LIMIT then
            love.graphics.setColor(255,0,0)
        else
            love.graphics.setColor(255,255,255)
        end
        
        -- love.graphics.point(b.x,b.y)
        love.graphics.circle("fill",b.x,b.y,2)
    end
end