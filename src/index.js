let app = null;

function setup() {
  createCanvas(800, 800, WEBGL);
  app = new App();
  app.setup();
}

function draw() {
  background(220);
  app.update();
}