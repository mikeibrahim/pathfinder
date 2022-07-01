class Agent {
  // Class Data
  static stepTime = 0.1;
  static agentSize = 10;
  static stepMagnitude = 30;
  static rayMagnitude = 1;
  static rotationMagnitude = 0.03;

  // Field Data
  #start;
  #end;
  #obstacles;
  #position;
  #currentStepTime;
  #currentDir;

  constructor({ start, end, obstacles }) {
    this.#start = start;
    this.#end = end;
    this.#obstacles = obstacles;
    this.#position = start.copy();
    this.#currentStepTime = Agent.stepTime;
  }

  // Callbacks
  update() {
    this.#updateCurrentStepTime();
    this.#render();
  }

  // Private Methods
  #updateCurrentStepTime() {
    this.#currentStepTime -= deltaTime / 1000;
    if (this.#currentStepTime <= 0) {
      this.#currentStepTime = Agent.stepTime;
      this.#updatePosition();
    }
  }
  #updatePosition() {
    this.#calculateDir();
    this.#step();
    this.#checkIfReachEnd();
  }
  #calculateDir() {
    let dir = p5.Vector.sub(this.#end, this.#position);
    let currentTheta = dir.heading();
    let flip = currentTheta > 0;
    let thetaDelta = 0;
    let iters = 0;

    while (this.#rayCastHit(currentTheta + thetaDelta) && iters < 1000) {
      thetaDelta += flip ? Agent.rotationMagnitude : -Agent.rotationMagnitude;
      thetaDelta = -thetaDelta;
      flip = !flip;
      iters++;
    }

    currentTheta += thetaDelta;
    this.#currentDir = createVector(cos(currentTheta), sin(currentTheta)).normalize();
  }

  #rayCastHit(theta) { // returns true if it hits the walls or the end with the given theta
    let pos = this.#position.copy(); // start raycasting from where we are
    let dir = createVector(cos(theta), sin(theta)); // get the movement vector

    while (dist(pos.x, pos.y, this.#end.x, this.#end.y) > App.endSize + Agent.agentSize && this.#inBounds(pos)) {
      pos = pos.add(dir.mult(Agent.rayMagnitude)); // moves the raycast
      for (let obstacle of this.#obstacles) {
        if (dist(pos.x, pos.y, obstacle.x, obstacle.y) < App.obstacleSize + Agent.agentSize) { // if the raycast is touching an obstacle, then we have hit an obstacle and this theta cannot be used
          return true;
        }
      }
    }
    return false;
  }
  #inBounds(pos) {
    return pos.x >= -width / 2 && pos.x <= width / 2 && pos.y >= -height / 2 && pos.y <= height / 2;
  }
  #step() {
    this.#position = this.#position.add(this.#currentDir.mult(Agent.stepMagnitude));
  }
  #checkIfReachEnd() {
    if (dist(this.#position.x, this.#position.y, this.#end.x, this.#end.y) < App.endSize + Agent.agentSize) {
      console.log("reached end");
      this.#position = this.#start.copy();
      this.#currentStepTime = Agent.stepTime;
      App.inst.newSimulation();
    }
  }
  #render() {
    fill(0, 0, 255);
    circle(this.#position.x, this.#position.y, Agent.agentSize * 2);
  }
}