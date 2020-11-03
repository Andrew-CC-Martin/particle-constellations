// Create our PIXI webgl canvas and add it to DOM
let app = new PIXI.Application({
  height: window.innerHeight,
  width: window.innerWidth,
})
document.body.appendChild(app.view)

// Create the main stage for your display objects
const stage = new PIXI.Container()

let stars
let starCount

const THICKNESS_FACTOR = 500
const THICKNESS_MAX = 1
const OPACITY_FACTOR = 100

function setStarState() {
  // constants
  const starSlider = document.getElementById("stars")
  starCount = Number(starSlider.value)

  stars = []
  // Create the initial states for each star
  for (let i = 0; i < starCount; i++) {
    // get star position
    const x = Math.random() * window.innerWidth
    const y = Math.random() * window.innerHeight
    const vx = Math.random() * (Math.round(Math.random()) ? 1 : -1)
    const vy = Math.random() * (Math.round(Math.random()) ? 1 : -1)
    const colour = `0x${Math.floor(Math.random() * 16777215).toString(16)}`
    stars.push({
      x,
      y,
      vx,
      vy,
      colour,
    })
  }
}

setStarState()
// Initialise the pixi Graphics class
const graphics = new PIXI.Graphics()

// Add the graphics to the stage
stage.addChild(graphics)

// Start animating
animate()
function animate() {
  // Wipe the canvas clear before each animation frame
  graphics.clear()

  // Update the positions for each star
  for (let i = 0; i < starCount; i++) {
    // Get new position (current position + velocity)
    const newX = stars[i].x + stars[i].vx
    const newY = stars[i].y + stars[i].vy

    // Detect collisions with edges of screen
    // If collision, reverse velocity
    if ((newX < 0) || (newX > window.innerWidth)) {
      stars[i].vx = -stars[i].vx
    }
    if ((newY < 0) || (newY > window.innerHeight)) {
      stars[i].vy = -stars[i].vy
    }

    stars[i].y = stars[i].y + stars[i].vy
    stars[i].x = stars[i].x + stars[i].vx
  }

  // Draw the lines between the stars
  for (let i = 0; i < starCount; i++) {
    for (let j = 0; j < starCount; j++) {
      // No need for star to check against self
      if (i === j) {
        break
      }
      const distanceX = stars[i].x - stars[j].x
      const distanceY = stars[i].y - stars[j].y
      const distance = ((distanceY ** 2) + (distanceX ** 2)) ** 0.5

      // draw line from (stars[i].x, stars[i].y) to (stars[j].x, stars[j].y)
      const opacity = OPACITY_FACTOR / distance
      const thicknessCalculated = (THICKNESS_FACTOR / distance)
      const thickness = thicknessCalculated > THICKNESS_MAX ? THICKNESS_MAX : thicknessCalculated

      // Draw the line (endPoint should be relative to myGraph's position)
      graphics.lineStyle(thickness, stars[i].colour, opacity)
        .moveTo(stars[i].x, stars[i].y)
        .lineTo(stars[j].x, stars[j].y)
    }
  }

  //Render the stage
  app.renderer.render(stage)
  requestAnimationFrame(animate)
}

function hideSlider() {
  document.getElementById("slider").innerHTML = ''
}
