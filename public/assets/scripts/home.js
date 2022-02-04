function getImage(date) {
  return new Promise((resolve, reject) => {
    axios.post("/get_image", { date: date }).then((results) => {
      resolve(results.data)
    })
  })
}

function doChanges(obj) {
  removeImage()
  setDate(obj.stringDate)
  setTitle(obj.response.title)

  let img = document.createElement("img")
  img.src = obj.response.url
  img.classList.add("image")

  let box = document.querySelector(".pictureBox")

  img.onload = () => {
    box.appendChild(img)
    let loader = document.getElementsByClassName("loader")[0]
    box.removeChild(loader)
  }
}

function setDate(date) {
  let target = document.querySelector(".datePicture")
  target.innerText = date
}

function setTitle(title) {
  let target = document.querySelector(".titlePicture")
  target.innerText = title
}

function getInputValue() {
  return document.querySelector(".inputBox").value
}

function startHomePage() {
  let timestamp = new Date()
  let year = timestamp.getFullYear()
  let month = timestamp.getMonth() + 1
  let day = timestamp.getDate()
  let toGet = year.toString() + "-" + month.toString() + "-" + day.toString()
  getImage(toGet).then((res) => {
    document.querySelector(".titlePicture").classList.remove("loading")
    doChanges(res)
  })

  let button = document.querySelector(".inputButton")

  button.addEventListener("click", () => {
    if (!getInputValue()) {
      alert("Enter date first")
      return
    }

    let date = getInputValue()

    getImage(date).then((res) => {
      if (res.error) {
        alert("Specified date not available!")
        return
      }
      doChanges(res)
      removeImage()
    })
  })
}

function removeImage() {
  try {
    let box = document.querySelector(".pictureBox")
    let image = document.getElementsByClassName("image")[0]
    box.removeChild(image)

    let loader = document.createElement("div")
    loader.classList.add("loader")
    box.append(loader)
  } catch {}
}

function removeLoader() {
  let loader = document.getElementsByClassName("loader")[0]
  box.removeChild(loader)
}

startHomePage()
