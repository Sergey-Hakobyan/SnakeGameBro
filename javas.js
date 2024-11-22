let dx = 0
let dy = 0
let countedPoints = 0
const stepSpeed = 7
const maxSpeed = stepSpeed * 2
const msPerSec = 1000
const minTimeDeleteFruit = 8
const maxTimeDeleteFruit = 12
const posibility = {
    any: 5,
    Apple: 60,

}
const fruitsDB = []
const scoreCounter = document.getElementById("Score")
const setupStartPosition = () => {
    const loseBlock = document.getElementById("loseBlock")
    const headSnake = document.getElementById("Sharik")
    const { height, width } = getComputedStyle(headSnake)
    const headRad = parseFloat(height) / 2
    const gap = parseFloat(width)
    const { innerWidth, innerHeight } = window
    let x = (innerWidth - parseFloat(width)) / 2
    let y = (innerHeight - parseFloat(height)) / 2
    let fruitCount = 0
    const loseEmerge = () => {
        setTimeout(
            () => { loseBlock.style.opacity = "1" },
            1)
        loseBlock.style.display = "flex"
    }
    
    const pointsEmerge = () => {
        const Score = document.getElementById("Score")
        Score.style.opacity = 0
    }





    const changePoint = (difference) => {
        countedPoints += difference / headRad
        scoreCounter.textContent = `Количество очков: ${Math.ceil(countedPoints)}.`
        if (countedPoints < 0) {
            loseEmerge()
        }
    }

    const checkPosibilityOfEating = () => {
        fruitsDB.forEach((fruit, i) => {
            const dx = fruit.x - x
            const dy = fruit.y - y
            const r = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
            const radSum = fruit.d / 2 + headRad
            if (radSum >= r) {
                //убираем с сайта 
                document.body.removeChild(fruit.link)
                //Змейка реагирует на поедание
                if (fruit.type === "Apple") {
                    changePoint(fruit.d)
                }
                else if (fruit.type === "Shit") {
                    changePoint(-fruit.d)
                }
                //убираем с бд
                fruitsDB.splice(i, 1)

            }
        });
    }
    const generateFruit = (type) => {
        const fruitCooX = genNum(0, innerWidth)
        const fruitCooY = genNum(0, innerHeight)
        const lifeTime = genNum(minTimeDeleteFruit, maxTimeDeleteFruit) * msPerSec
        const diamtre = genNum(parseFloat(width) * 0.5, parseFloat(width) * 1.5)
        const fruitHTML = document.createElement("div")
        fruitHTML.style.transform = `translate(${fruitCooX}px,${fruitCooY}px)`
        fruitHTML.style.height = `${diamtre}px`
        fruitHTML.style.width = `${diamtre}px`
        fruitHTML.id = `fruit-${fruitCount}`
        fruitHTML.classList.add("Fruit")
        fruitHTML.classList.add(type)
        document.body.appendChild(fruitHTML)
        const link = document.getElementById(fruitHTML.id)
        //исчезновение фрукта
        const fruitNum = fruitCount
        setTimeout(() => {

            let index = 0
            let findIndex = -1
            for (fruit of fruitsDB) {
                if (fruit.n == fruitNum) {
                    findIndex = index
                    break
                }
                index++
            }
            if (findIndex != -1) {
                document.body.removeChild(link)
                fruitsDB.splice(findIndex, 1)
            }
        }, lifeTime
        )

        return {
            x: fruitCooX,
            y: fruitCooY,
            // t:lifeTime,
            d: diamtre,
            n: fruitCount++,
            link,
            type
        }
    }
    setInterval(() => {
        checkPosibilityOfEating()
        const randnum = genNum(0, 100)
        if (randnum < posibility.any) {
            let typeGenerateFruit = ""
            if (genNum(0, 100) < posibility.Apple) {
                typeGenerateFruit = "Apple"
            }
            else {
                typeGenerateFruit = "Shit"
            }
            fruitsDB.push(generateFruit(typeGenerateFruit))
        }
        x += dx
        y += dy
        if (x > innerWidth + gap + parseFloat(width)) {
            temporraryDIsabledAnimation()
            x = -gap
        }
        if (x < -gap) {
            temporraryDIsabledAnimation()
            x = innerWidth + gap + parseFloat(width)
        }
        if (y > innerHeight + gap + parseFloat(height)) {
            temporraryDIsabledAnimation()
            y = -gap
        }
        if (y < -gap) {
            temporraryDIsabledAnimation()
            y = innerHeight + gap + parseFloat(height)
        }
        headSnake.style.transform = `translate(${x}px,${y}px)`
    }, 200)

}
const genNum = (a, b) => Math.random() * (b - a) + a


const catchKey = (event) => {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'ц':
            if (Math.abs(dy) <= maxSpeed || dy > 0) {
                dy -= stepSpeed
                dx = 0
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'ы':
            if (Math.abs(dy) <= maxSpeed) {
                dy += stepSpeed
                dx = 0
            }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'ф':
            if (Math.abs(dx) <= maxSpeed) {
                dx -= stepSpeed
                dy = 0
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'в':
            if (Math.abs(dx) <= maxSpeed) {
                dx += stepSpeed
                dy = 0
            }
            break;
    }
}

const temporraryDIsabledAnimation = () => {
    Sharik.style.transition = "none"
    setTimeout(
        () => {
            Sharik.style.transition = ""
        },
        200
    )
}

document.addEventListener("DOMContentLoaded", setupStartPosition)
document.addEventListener("keydown", catchKey)