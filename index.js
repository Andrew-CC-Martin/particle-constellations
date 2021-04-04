// constants
const constants = {
  THICKNESS_FACTOR: 500,
  THICKNESS_MAX: 1,
  OPACITY_FACTOR: 100,
  JOIN_DISTANCE: 200,
  // MOUSE_INTERACTION_RADIUS: 100,
  PARTICLE_COUNT: 50
}

function initializeState(constants) {
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext('2d')
  const height = window.innerHeight
  const width = window.innerWidth
  canvas.width = width
  canvas.height = height

  const state = {
    particles: [],
    constants,
    canvasProps: {
      canvas,
      ctx,
      height,
      width
    }
  }

  const { PARTICLE_COUNT } = constants
  // Create the initial states for each particle
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // randomise particle position
    const x = Math.random() * width
    const y = Math.random() * height
    // randomise particle velocity
    const vx = Math.random() * (Math.round(Math.random()) ? 1 : -1)
    const vy = Math.random() * (Math.round(Math.random()) ? 1 : -1)
    state.particles.push({
      x,
      y,
      vx,
      vy,
    })
  }

  return state
}

function generateNewState(oldState) {
  const { particles, constants, canvasProps } = oldState
  const { PARTICLE_COUNT } = constants
  const newState = { particles: [], constants, canvasProps }
  // Update the positions for each particle
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Get new position (current position + velocity)
    const calculatedX = particles[i].x + particles[i].vx
    const calculatedY = particles[i].y + particles[i].vy

    // Detect collisions with edges of screen
    // If collision, reverse velocity
    let newVx = particles[i].vx
    let newVy = particles[i].vy
    // collision with left and right edges
    if ((calculatedX < 0) || (calculatedX > window.innerWidth)) {
      // particles[i].vx = -particles[i].vx
      newVx = -particles[i].vx
    }
    // collision with top and bottom edges
    if ((calculatedY < 0) || (calculatedY > window.innerHeight)) {
      // particles[i].vy = -particles[i].vy
      newVy = -particles[i].vy
    }

    // update postions based on velocities
    const newX = particles[i].x + newVx
    const newY = particles[i].y + newVy
    newState.particles.push({
      x: newX,
      y: newY,
      vx: newVx,
      vy: newVy
    })
  }

  return newState
}

function drawLines(state) {
  const { particles, constants, canvasProps } = state
  const { PARTICLE_COUNT, JOIN_DISTANCE, OPACITY_FACTOR, THICKNESS_FACTOR, THICKNESS_MAX } = constants
  const { ctx, width, height } = canvasProps
  // Wipe the canvas clear before each animation frame
  ctx.clearRect(0, 0, width, height)

  // Draw the lines between the particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    for (let j = 0; j < PARTICLE_COUNT; j++) {
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
}

// animation loop
function animate(oldState) {
  const newState = generateNewState(oldState)

  drawLines(newState)

  // run the animation loop again when the browser's ready
  requestAnimationFrame(() => animate(newState))
}

// Create initial state and start animation loop
const state = initializeState(constants)
animate(state)
