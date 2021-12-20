
class GrowthSite {
    constructor(x, y, direction, growth_speed, ttl, generation, color) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.initial_direction = direction;
        this.growth_speed = growth_speed;
        this.ttl = ttl;
        this.generation = generation;
        this.color = color;
    }
}

// const noise_scale = 0.1;

function grow_twig(x, y, direction, growth_speed, ttl, color) {
    let growth_sites = [new GrowthSite(x, y, direction, growth_speed, ttl, 0, color)];

    while (growth_sites.length > 0) {
        growth_sites = growth_step(growth_sites);
    }
}

function growth_step(growth_sites) {
    // const max_noise_value = 0.9; // for unbiased results using 4 octaves of noise with a decay of 0.5, use = 15.0 / 16.0;
    const max_angle_incr = Math.PI / 16.0;
    const branching_angle = Math.PI / 6.0;

    growth_sites.forEach(gs => {
        // gs.direction += 2.0 * max_angle_incr * (noise(noise_scale * gs.x, noise_scale * gs.y) - 0.5 * max_noise_value);
        gs.direction += 2.0 * max_angle_incr * (Math.random() - 0.5);
        if (Math.abs(gs.direction - gs.initial_direction) > branching_angle) {
            growth_sites.push(branch_growth_site(gs));
            gs.initial_direction = gs.direction;
        }

        const incr_x = gs.growth_speed * Math.cos(gs.direction);
        const incr_y = gs.growth_speed * Math.sin(gs.direction);
        draw_twig_segment(gs, gs.x + incr_x, gs.y + incr_y);
        gs.x += incr_x;
        gs.y += incr_y;
        gs.ttl -= 1;
    });

    return growth_sites.filter(gs => gs.ttl > 0);
}

function branch_growth_site(gs) {
    return new GrowthSite(
        gs.x,
        gs.y,
        2.0 * gs.initial_direction - gs.direction,
        gs.growth_speed,// - 0.25 * noise(noise_scale * gs.x, noise_scale * gs.y, 5.0),
        gs.ttl * 0.5,
        gs.generation + 1,
        gs.color
    );
}

function draw_twig_segment(gs, new_x, new_y) {
    // strokeCap(ROUND);
    stroke(gs.color);
    strokeWeight(2.0 * Math.pow(0.75, gs.generation) + gs.ttl / 50.0);
    line(gs.x, gs.y, new_x, new_y);
}

function rand(min, max) {
    return (max - min) * Math.random() + min;
}

let global_growth_sites = [];

function add_global_growth_site() {
    global_growth_sites.push(new GrowthSite(
        canvas_width / 2,
        canvas_height / 2,
        rand(0.0, 2.0 * Math.PI),
        rand(2, 3),
        rand(150, 300),
        0,
        rand(45, 245)
    ));
}

const canvas_width  = 1000;
const canvas_height = 1000;
let frame_count = 0;

function setup() {
    // noiseSeed(589022682);
    // noiseDetail(4, 0.5);
    createCanvas(canvas_width, canvas_height);
    background(0);

    add_global_growth_site();
}

function draw() {
    if (global_growth_sites.length > 0) {
        global_growth_sites = growth_step(global_growth_sites);
    }

    frame_count += 1;
    if (frame_count >= 60) {
        add_global_growth_site();
        frame_count = 0;
    }
}
