let canvas, gui;

function setupGUI() {
    gui = new dat.GUI({autoPlace: false, width: 250});
    document.body.appendChild(gui.domElement);
    gui.domElement.style.position = 'absolute';
    gui.closed = true;
    gui.updateDisplay();
}

//////////////////////////////////////////////////

let params = {
    save: () => saveCanvas('frame-' + nf(frameCount, 5) + '.png'),
    X: 80,
    FR: 15,
    dens: 0.2,
    restart: () => restart()
};

let X = 80, Y = 50, FR, dens = params.dens, grid;

function setup() {
    canvas = createCanvas(800, 500);
    canvas.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2);
    setupGUI();
    windowResized();
    pixelDensity(2);
    colorMode(RGB, 1);
    background(0);

    frameRate(params.FR);
    restart(params.dens);

    gui.add(params, 'save').name('Save canvas');
    gui.add(params, 'X', 40, 320, 1).name('X').onChange(() => {
        X = params.X;
        Y = params.X * height / width;
        restart()
    });
    gui.add(params, 'FR', 1, 60, 1).name('Framerate').onChange(() => {
        FR = params.FR;
        frameRate(FR);
    });
    gui.add(params, 'dens', 0, 1, 0.05).name('Density').onChange(() => {
        dens = params.dens;
        restart();
    });
    gui.add(params, 'restart').name('Restart');
}

function draw() {
    show();
    step();
}

function show() {
    background(0);
    noStroke();
    fill(0.3, 1, 0);
    for (let i = 0; i < X; i++) {
        for (let j = 0; j < Y; j++) {
            if (grid[i][j] === 1) {
                rect(i * width / X, j * height / Y, width / X, height / Y);
            }
        }
    }
}

function restart() {
    grid = [];
    for (let i = 0; i < X; i++) {
        grid.push([]);
        for (let j = 0; j < Y; j++) {
            if (random() < dens) {
                grid[i][j] = 1;
            } else {
                grid[i][j] = 0;
            }
        }
    }
}

function step() {
    let newGrid = [];
    for (let i = 0; i < X; i++) {
        newGrid[i] = [];
        for (let j = 0; j < Y; j++) {
            let count = 0;
            for (let k = -1; k <= 1; k++) {
                for (let l = -1; l <= 1; l++) {
                    if (k === 0 && l === 0) {
                        continue;
                    }
                    if (grid[(i + k + X) % X][(j + l + Y) % Y] === 1) {
                        count++;
                    }
                }
            }
            if (grid[i][j] === 1) {
                if (count === 2 || count === 3) {
                    newGrid[i][j] = 1;
                } else {
                    newGrid[i][j] = 0;
                }
            } else {
                if (count === 3) {
                    newGrid[i][j] = 1;
                } else {
                    newGrid[i][j] = 0;
                }
            }
        }
    }
    grid = newGrid;
}

function windowResized() {
    canvas.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2);
    gui.domElement.style.left = canvas.x + canvas.width - gui.width + 'px';
    gui.domElement.style.top = canvas.y + 'px';
}

function clog(object) {
    console.log(object);
}
