
class GrowthSite {
    constructor(position, direction, growth_speed, ttl) {
        this.position = position;
        this.direction = direction;
        this.initial_direction = direction;
        this.growth_speed = growth_speed;
        this.ttl = ttl;
    }
}

let growth_sites = [new GrowthSite([400, 100], 0.5 * Math.PI, 3, 150)];

function grwoth_step() {
    const noise_scale = 0.1;
    const max_angle_incr = Math.PI / 16.0;
    const branching_angle = Math.PI / 6.0;

    growth_sites.forEach(gs => {
        gs.direction += 2.0 * max_angle_incr * (noise(noise_scale * gs.position[0], noise_scale * gs.position[1]) - 0.45);
        if (Math.abs(gs.direction - gs.initial_direction) > branching_angle) {
            growth_sites.push(new GrowthSite(
                [...gs.position],
                2.0 * gs.initial_direction - gs.direction,
                gs.growth_speed - 0.25 * noise(gs.position[0], gs.position[1], 5.0),
                gs.ttl * 0.5
            ));
            gs.initial_direction = gs.direction;
        }
        let incr = [gs.growth_speed * Math.cos(gs.direction), gs.growth_speed * Math.sin(gs.direction)];
        line(gs.position[0], gs.position[1], gs.position[0] + incr[0], gs.position[1] + incr[1]);
        gs.position[0] += incr[0];
        gs.position[1] += incr[1];
        gs.ttl -= 1;
    });

    growth_sites = growth_sites.filter(gs => gs.ttl > 0);
}

function setup() {
    // noiseSeed(589022682);
    noiseDetail(4, 0.5);
    createCanvas(800, 600);
    background(240);

    while (growth_sites.length > 0) {
        grwoth_step();
    }
}
