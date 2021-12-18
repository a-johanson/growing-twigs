
class GrowthSite {
    constructor(x, y, direction, growth_speed, ttl) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.initial_direction = direction;
        this.growth_speed = growth_speed;
        this.ttl = ttl;
    }
}

function grow_twig(x, y, direction, growth_speed, ttl) {
    let growth_sites = [new GrowthSite(x, y, direction, growth_speed, ttl)];

    while (growth_sites.length > 0) {
        growth_sites = growth_step(growth_sites);
    }
}

function growth_step(growth_sites) {
    const noise_scale = 0.1;
    const max_angle_incr = Math.PI / 16.0;
    const branching_angle = Math.PI / 6.0;

    growth_sites.forEach(gs => {
        gs.direction += 2.0 * max_angle_incr * (noise(noise_scale * gs.x, noise_scale * gs.y) - 0.45);
        if (Math.abs(gs.direction - gs.initial_direction) > branching_angle) {
            growth_sites.push(new GrowthSite(
                gs.x,
                gs.y,
                2.0 * gs.initial_direction - gs.direction,
                gs.growth_speed - 0.25 * noise(gs.x, gs.y, 5.0),
                gs.ttl * 0.5
            ));
            gs.initial_direction = gs.direction;
        }
        const incr_x = gs.growth_speed * Math.cos(gs.direction);
        const incr_y = gs.growth_speed * Math.sin(gs.direction);
        line(gs.x, gs.y, gs.x + incr_x, gs.y + incr_y);
        gs.x += incr_x;
        gs.y += incr_y;
        gs.ttl -= 1;
    });

    return growth_sites.filter(gs => gs.ttl > 0);
}

function setup() {
    // noiseSeed(589022682);
    noiseDetail(4, 0.5);
    createCanvas(800, 600);
    background(240);

    grow_twig(400, 100, 0.5 * Math.PI, 3, 150);
}