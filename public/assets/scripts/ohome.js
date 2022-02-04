function getImage(a) {
  return new Promise(function (b, c) {
    axios.post("/get_image", { timestamp: a }).then(function (d) {
      b(d.data)
    })
  })
}
function convertToTimstamp(a) {
  a = a.split("-")
  return new Date(a[0], a[1] - 1, a[2])
}
function doChanges(a) {
  removeImage()
  setDate(a.stringDate)
  setTitle(a.response.title)
  var b = document.createElement("img")
  b.src = a.response.url
  b.classList.add("image")
  var c = document.querySelector(".pictureBox")
  b.onload = function () {
    c.appendChild(b)
    var d = document.getElementsByClassName("loader")[0]
    c.removeChild(d)
  }
}
function setDate(a) {
  document.querySelector(".datePicture").innerText = a
}
function setTitle(a) {
  document.querySelector(".titlePicture").innerText = a
}
function getInputValue() {
  return document.querySelector(".inputBox").value
}
function startHomePage() {
  getImage(Date.now()).then(function (a) {
    document.querySelector(".titlePicture").classList.remove("loading")
    doChanges(a)
  })
  document.querySelector(".inputButton").addEventListener("click", function () {
    if (getInputValue()) {
      var a = getInputValue()
      a = convertToTimstamp(a)
      getImage(a).then(function (b) {
        b.error
          ? alert("Specified date not available!")
          : (doChanges(b), removeImage())
      })
    } else alert("Enter date first")
  })
}
function removeImage() {
  try {
    var a = document.querySelector(".pictureBox"),
      b = document.getElementsByClassName("image")[0]
    a.removeChild(b)
    var c = document.createElement("div")
    c.classList.add("loader")
    a.append(c)
  } catch (d) {}
}
function removeLoader() {
  var a = document.getElementsByClassName("loader")[0]
  box.removeChild(a)
}
startHomePage()
