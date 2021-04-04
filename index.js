// constants
const THICKNESS_FACTOR = 500
const THICKNESS_MAX = 1
const OPACITY_FACTOR = 100
const JOIN_DISTANCE = 200
const MOUSE_INTERACTION_RADIUS = 100

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')
const height = window.innerHeight
const width = window.innerWidth
canvas.width = width
canvas.height = height

// state
let particles
let particleCount

function setParticleState() {
  const slider = document.getElementById("particles")
  particleCount = Number(slider.value)

  particles = []
  // Create the initial states for each particle
  for (let i = 0; i < particleCount; i++) {
    // get particle position
    const x = Math.random() * width
    const y = Math.random() * height
    const vx = Math.random() * (Math.round(Math.random()) ? 1 : -1)
    const vy = Math.random() * (Math.round(Math.random()) ? 1 : -1)
    particles.push({
      x,
      y,
      vx,
      vy,
    })
  }
}
setParticleState()

// Start animation loop
animate()

// animation loop
function animate() {
  // Wipe the canvas clear before each animation frame
  ctx.clearRect(0, 0, width, height)

  // Update the positions for each particle
  for (let i = 0; i < particleCount; i++) {
    // Get new position (current position + velocity)
    const newX = particles[i].x + particles[i].vx
    const newY = particles[i].y + particles[i].vy

    // Detect collisions with edges of screen
    // If collision, reverse velocity
    if ((newX < 0) || (newX > window.innerWidth)) {
      particles[i].vx = -particles[i].vx
    }
    if ((newY < 0) || (newY > window.innerHeight)) {
      particles[i].vy = -particles[i].vy
    }

    // update postions based on velocities
    particles[i].y = particles[i].y + particles[i].vy
    particles[i].x = particles[i].x + particles[i].vx
  }

  // Draw the lines between the particles
  for (let i = 0; i < particleCount; i++) {
    for (let j = 0; j < particleCount; j++) {
      // No need for particle to check against self
      if (i === j) {
        break
      }
      const distanceX = particles[i].x - particles[j].x
      const distanceY = particles[i].y - particles[j].y
      const distance = ((distanceY ** 2) + (distanceX ** 2)) ** 0.5

      // check if particle is close. Only draw line if distance is within limit
      if (distance < JOIN_DISTANCE) {
        // opactity of line increases when particles are closer
        const opacity = OPACITY_FACTOR / distance
        // thickness of line increases when particles are closer together
        const thicknessCalculated = (THICKNESS_FACTOR / distance)
        // but only up to a max value
        const thickness = thicknessCalculated > THICKNESS_MAX ? THICKNESS_MAX : thicknessCalculated

        // set the stroke style based on the above factors
        // opacity
        ctx.strokeStyle = `rgb(255, 255, 255, ${opacity})`
        // thickness
        ctx.lineWidth = thickness

        // draw line between particles
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
      }
    }
  }

  // run the animation loop again when the browser's ready
  requestAnimationFrame(animate)
}

function hideSlider() {
  document.getElementById("slider").innerHTML = ''
}
