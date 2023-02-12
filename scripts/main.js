const store = {
    lifts: 0,
    floors: 0,
    state: [],
}

const floorsContainer = document.querySelector("#floorsContainer")
const liftsContainer = document.querySelector("#liftsContainer")

function initialize() {
    // get num of floors and num of lifts from the form and store them
    const floors = document.querySelector("#numOfFloors").value
    const lifts = document.querySelector("#numOfLifts").value

    store.floors = parseInt(floors)
    store.lifts = parseInt(lifts)

    // hide the input form
    const inputContainer = document.querySelector("#input")
    inputContainer.style.display = "none"

    // push initial data to store
    for (let i = 0; i < store.lifts; i++) {
        store.state.push({
            id: i,
            floor: 1,
        })
    }

    addFloorsToScene()
    addLiftsToScene()
}

// helpers
function addFloorsToScene() {
    // loop to add floor with title and up-down buttons
    for (let i = store.floors; i >= 1; i--) {
        const floor = document.createElement("div")
        floor.classList.add("floor")
        floor.style.width = `${160 * store.lifts}px`

        const floorTitle = document.createElement("h5")
        floorTitle.textContent = `Floor ${i}`
        floorTitle.classList.add("floor-title")
        floor.appendChild(floorTitle)

        const upButton = document.createElement("button")
        upButton.classList.add("up-button")
        upButton.innerHTML = "Up"
        upButton.value = i

        // add a click event on the up button to move the closest lift(s) up
        upButton.addEventListener("click", function () {
            const requestedFloorNumber = parseInt(this.value)
            let closestLift = 0
            let closestDiff = store.floors

            for (let j = 0; j < store.lifts; j++) {
                const lift = store.state[j]

                // skip lifts above requested floor
                if (lift.floor >= requestedFloorNumber) {
                    continue
                }

                // find the closest lift
                const diff = Math.abs(lift.floor - requestedFloorNumber)
                if (diff < closestDiff) {
                    closestLift = j
                    closestDiff = diff
                    store.state[closestLift].floor = requestedFloorNumber
                }
            }

            // condition to handle edge case
            if (store.state[closestLift].floor <= requestedFloorNumber) {
                moveLift(closestLift, requestedFloorNumber)
            }
        })

        const downButton = document.createElement("button")
        downButton.classList.add("down-button")
        downButton.innerHTML = "Down"
        downButton.value = i

        downButton.addEventListener("click", function () {
            const requestedFloorNumber = parseInt(this.value)
            let closestLift = 0
            let closestDiff = store.floors

            for (let j = 0; j < store.lifts; j++) {
                const lift = store.state[j]

                // skip lifts below requested floor
                if (lift.floor <= requestedFloorNumber) {
                    continue
                }

                // find the closest lift
                const diff = Math.abs(lift.floor - requestedFloorNumber)
                if (diff < closestDiff) {
                    closestLift = j
                    closestDiff = diff
                    store.state[closestLift].floor = requestedFloorNumber
                }
            }

            if (store.state[closestLift].floor >= requestedFloorNumber) {
                moveLift(closestLift, requestedFloorNumber)
            }
        })

        floor.appendChild(upButton)
        floor.appendChild(downButton)
        floorsContainer.append(floor)
    }
}

function addLiftsToScene() {
    for (let i = 0; i < store.lifts; i++) {
        const left = `${(i + 1) * 120}px`
        const liftContainer = document.createElement("div")
        liftContainer.classList.add("lift")
        liftContainer.style.bottom = "16px"
        liftContainer.style.left = left

        const leftDoor = document.createElement("span")
        leftDoor.style.display = "block"
        leftDoor.style.width = "49%"
        leftDoor.classList.add("left-door")
        const rightDoor = document.createElement("span")
        rightDoor.style.display = "block"
        rightDoor.style.width = "49%"
        rightDoor.classList.add("right-door")

        liftContainer.append(leftDoor, rightDoor)

        liftsContainer.appendChild(liftContainer)
    }
}

function moveLift(liftId, floorNumber) {
    const lift = store.state[liftId]
    lift.floor = floorNumber

    const liftContainer = liftsContainer.querySelectorAll("div")[liftId]
    liftContainer.style.bottom = `${(lift.floor - 1) * 100 + lift.floor * 16}px`
}
