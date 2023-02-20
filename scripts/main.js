const store = {
  lifts: 0,
  floors: 0,
  state: [],
}

const outputContainer = document.querySelector('#output')
const floorsContainer = document.querySelector('#floorsContainer')
const liftsContainer = document.querySelector('#liftsContainer')

function initialize() {
  // get num of floors and num of lifts from the form and store them
  const floors = document.querySelector('#numOfFloors').value
  const lifts = document.querySelector('#numOfLifts').value

  store.floors = parseInt(floors)
  store.lifts = parseInt(lifts)

  // hide the input form
  const inputContainer = document.querySelector('#input')
  inputContainer.style.display = 'none'

  // show the output form
  outputContainer.style.display = 'block'

  // push initial data to store
  for (let i = 0; i < store.lifts; i++) {
    store.state.push({
      id: i,
      floor: 1,
      isAvailable: 1,
    })
  }

  addFloorsToScene()
  addLiftsToScene()
}

// helpers
function addFloorsToScene() {
  // loop to add floor with title and up-down buttons
  for (let i = store.floors; i >= 1; i--) {
    const floor = document.createElement('div')
    floor.classList.add('floor')
    floor.style.width = `${160 * store.lifts}px`

    const floorTitle = document.createElement('h5')
    floorTitle.textContent = `Floor ${i}`
    floorTitle.classList.add('floor-title')
    floor.appendChild(floorTitle)

    const upButton = document.createElement('button')
    upButton.classList.add('up-button')
    upButton.innerHTML = 'Up'
    upButton.value = i

    const downButton = document.createElement('button')
    downButton.classList.add('down-button')
    downButton.innerHTML = 'Down'
    downButton.value = i

    upButton.addEventListener('click', function () {
      findClosestAvailableLift(parseInt(this.value), 'up')
    })

    downButton.addEventListener('click', function () {
      findClosestAvailableLift(parseInt(this.value), 'down')
    })

    floor.appendChild(upButton)
    floor.appendChild(downButton)
    floorsContainer.append(floor)
  }
}

function findClosestAvailableLift(requestedFloorNumber, direction) {
  let closestLift = 0
  let closestDiff = store.floors

  for (let j = 0; j < store.lifts; j++) {
    const lift = store.state[j]

    // skip lifts that are not in right direction
    if (
      (requestedFloorNumber > lift.floor && direction === 'down') ||
      (requestedFloorNumber < lift.floor && direction === 'up')
    ) {
      continue
    }

    // skip all the occupied lifts
    if (!lift.isAvailable) {
      continue
    }

    // find the closest lift
    const diff = Math.abs(lift.floor - requestedFloorNumber)
    if (diff < closestDiff) {
      closestLift = j
      closestDiff = diff
    }
  }

  // handle edge case
  const currentLift = store.state[closestLift]
  const isNotTheSameFloor = currentLift.floor !== requestedFloorNumber
  const isAvailable = currentLift.isAvailable
  const isRightDirection =
    (requestedFloorNumber > currentLift.floor && direction === 'up') ||
    (requestedFloorNumber < currentLift.floor && direction === 'down')

  if (isNotTheSameFloor && isAvailable && isRightDirection) {
    moveLift(closestLift, requestedFloorNumber)
  }
}

function addLiftsToScene() {
  for (let i = 0; i < store.lifts; i++) {
    const left = `${(i + 1) * 120}px`
    const liftContainer = document.createElement('div')
    liftContainer.classList.add('lift')
    liftContainer.style.bottom = '16px'
    liftContainer.style.left = left

    const leftDoor = document.createElement('span')
    leftDoor.style.display = 'block'
    leftDoor.style.width = '49%'
    leftDoor.classList.add('left-door')
    const rightDoor = document.createElement('span')
    rightDoor.style.display = 'block'
    rightDoor.style.width = '49%'
    rightDoor.classList.add('right-door')

    liftContainer.append(leftDoor, rightDoor)
    liftsContainer.appendChild(liftContainer)
  }
}

function moveLift(liftId, floorNumber) {
  const lift = store.state[liftId]
  const oldFloor = lift.floor

  lift.isAvailable = 0
  lift.floor = floorNumber

  const liftContainer = liftsContainer.querySelectorAll('div')[liftId]
  const timeToTravelInSeconds =
    (oldFloor - floorNumber > 0
      ? oldFloor - floorNumber
      : (oldFloor - floorNumber) * -1) * 2
  const timeToTravelInMilliSeconds = timeToTravelInSeconds * 1000

  liftContainer.style.transition = `all ${timeToTravelInSeconds}s ease`

  liftContainer.style.bottom = `${(floorNumber - 1) * 100 + floorNumber * 16}px`

  setTimeout(() => {
    openAndCloseDoors(liftId)
  }, timeToTravelInMilliSeconds)
}

function openAndCloseDoors(liftId) {
  const lift = store.state[liftId]
  const liftThatHasToOpenDoors = liftsContainer.querySelectorAll('div')[liftId]
  const doors = liftThatHasToOpenDoors.querySelectorAll('span')

  if (doors.length === 2) {
    const leftDoor = doors[0]
    const rightDoor = doors[1]

    leftDoor.style.width = '1%'
    rightDoor.style.width = '1%'

    setTimeout(() => {
      leftDoor.style.width = '49%'
      rightDoor.style.width = '49%'

      lift.isAvailable = 1
    }, 2500)
  }
}
