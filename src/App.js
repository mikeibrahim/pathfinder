class App {
  // Class Data
  static inst;
  static startSize = 20;
  static obstacleSize = 150;
  static numObstacles = 3;
  static endSize = 20;

  // Field Data
  #start;
  #end;
  #obstacles;
  #agent;

  // Constructor
  constructor() {
    App.inst = this;
    this.#start = createVector(0, 0);
    this.#end = createVector(0, 0);
    this.#obstacles = [];
  }

  // Setters
  setStart(point) { this.#start = point; }
  setEnd(point) { this.#end = point; }
  setObstacles(obstacles) { this.#obstacles = obstacles; }
  addObstacle(obstacle) { this.#obstacles.push(obstacle); }
  clearObstacles() { this.#obstacles = []; }

  // Getters
  getStart() { return this.#start; }
  getEnd() { return this.#end; }
  getObstacles() { return this.#obstacles; }

  // Callbacks
  setup() {
    this.newSimulation();
  }
  update() {
    this.#renderStart();
    this.#renderEnd();
    this.#renderObstacles();
    this.#updateAgent();
  }

  // Public Methods
  newSimulation() {
    this.clearObstacles();
    for (let i = 0; i < App.numObstacles; i++) {
      this.addObstacle(this.#getRandomPoint(App.obstacleSize));
    }
    this.setStart(this.#getRandomPoint(App.startSize));
    this.setEnd(this.#getRandomPoint(App.endSize));
    this.#agent = new Agent({
      start: this.#start,
      end: this.#end,
      obstacles: this.#obstacles
    });
  }

  // Private Methods
  #getRandomPoint(radius) {
    let v = createVector(random(-width / 2 + radius, width / 2 - radius), random(-height / 2 + radius, height / 2 - radius));

    for (let obstacle of this.#obstacles) {
      if (v.dist(obstacle) < radius + App.obstacleSize) {
        return this.#getRandomPoint(radius);
      }
    }
    return v;
  }
  #renderStart() {
    fill(0, 255, 0);
    circle(this.#start.x, this.#start.y, App.startSize * 2);
  }
  #renderEnd() {
    fill(255, 0, 0);
    circle(this.#end.x, this.#end.y, App.endSize * 2);
  }
  #renderObstacles() {
    fill(0);
    for (let obstacle of this.#obstacles) {
      circle(obstacle.x, obstacle.y, App.obstacleSize * 2);
    }
  }
  #updateAgent() {
    this.#agent.update();
  }
}
