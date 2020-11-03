// Get a random number that's between x and y
// (where y is positive and > x)
function getRandomFromXtoY(x, y) {
  const r = Math.random() * y
  if (r > x) {
    return r
  } else {
    getRandomFromXtoY(x, y)
  }
}

// Create our PIXI webgl canvas and add it to DOM
let app = new PIXI.Application({
  height: window.innerHeight,
  width: window.innerWidth,
})
document.body.appendChild(app.view)

// Create the main stage for your display objects
var stage = new PIXI.Container()

const starsCount = 100
const starSize = 2

// Create the initial states for each star
const stars = []
for (let i = 0; i < starsCount; i++) {
  // get star position
  const x = Math.random() * window.innerWidth
  const y = Math.random() * window.innerHeight
  const vx = Math.random() * (Math.round(Math.random()) ? 1 : -1)
  const vy = Math.random() * (Math.round(Math.random()) ? 1 : -1)
  const colour = `0x${Math.floor(Math.random()*16777215).toString(16)}`
  const size = getRandomFromXtoY(20, 70)
  stars.push({
    x,
    y,
    vx,
    vy,
    colour,
    size
  })
}

// Initialise the pixi Graphics class
var graphics = new PIXI.Graphics()

// Add the graphics to the stage
stage.addChild(graphics)

// Start animating
animate()
function animate() {
  // Wipe the canvas clear
  graphics.clear()

  // Update the positions for each star
  for (let i = 0; i < starsCount; i++) {
    // Get new position (current position + velocity)
    const newX = stars[i].x + stars[i].vx
    const newY = stars[i].y + stars[i].vy

    // Detect collisions with edges of screen
    // If collision, reverse velocity
    if ((newX < 0) || (newX > window.innerWidth)) {
      stars[i].vx = -stars[i].vx
    }
    if ((newY < 0) || (newY > window.innerWidth)) {
      stars[i].vy = -stars[i].vy
    }

    stars[i].y = stars[i].y + stars[i].vy
    stars[i].x = stars[i].x + stars[i].vx

    // Set the fill color
    graphics.beginFill(stars[i].colour)

    // Draw the star
    graphics.drawCircle(stars[i].x, stars[i].y, stars[i].size)

    // Applies fill to lines and shapes since the last call to beginFill.
    graphics.endFill()
  }
  //Render the stage
  app.renderer.render(stage)
  requestAnimationFrame(animate)
}
