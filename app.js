// DOM selection lines
const $ = (identifier) => document.querySelector(identifier)

const fileInput = $("#inputFile")

const brightnessInput = $("#brightness");
const saturationInput = $("#saturation");
const blurInput = $("#blur");
const inversionInput = $("#inversion");

const filenameInput = $(".filename")
const filelabel = $(".inputFileLabel")

const change_image = $(".change_image")
const loading_bar = $(".loading-bar")

const resetallBtn = $(".reset-all")
const saveBtn = $(".save")

const canvas = $("#canvas")
const canvasCtx = canvas.getContext("2d")

const settings = {}
let defaultSettings = {}
let image = null

function resetSettings() {
  settings.brightness = "100";
  settings.saturation = "100";
  settings.blur = "0";
  settings.inversion = "0";

  if (defaultSettings['brightness'] === undefined) {
  	defaultSettings = {...settings}
  }

  brightnessInput.value = settings.brightness;
  saturationInput.value = settings.saturation;
  blurInput.value = settings.blur;
  inversionInput.value = settings.inversion;
}

function resetOne(key, value) {
	settings[key] = value
	inputList = {
		brightness: brightnessInput,
		saturation: saturationInput,
		blur: blurInput,
		inversion: inversionInput
	}
	inputList[key].value = settings[key]
	renderImage()
}

function updateSetting(key, value) {
	if(!image) return
	settings[key] = value
	renderImage()
}

function generateFilter() {
	const { brightness, saturation, blur, inversion } = settings
	return `brightness(${brightness}%) saturate(${saturation}%) blur(${blur}px) invert(${inversion}%)`;
}

function renderImage() {
	canvas.width = image.width
	canvas.height = image.height

	canvasCtx.filter = generateFilter()
	canvasCtx.drawImage(image, 0, 0)
}

function setEvents(element, handler) {
	element.addEventListener("input", handler)
	// element.addEventListener("change", handler)
}

function reloadEditor() {
	fileInput.click()
}

function enableDisable(label_html) {
	const valueFor = label_html.getAttribute("for")
	if (label_html.classList.contains("disable")) {
		label_html.classList.remove("disable")
		previous_value = label_html.getAttribute("data-val")
		resetOne(valueFor, previous_value)
	}else {
		label_html.classList.add('disable')
		label_html.setAttribute("data-val", settings[valueFor])
		resetOne(valueFor, defaultSettings[valueFor])
	}
}

setEvents(brightnessInput, () => {
	updateSetting("brightness", brightnessInput.value)
})

setEvents(saturationInput, () => {
	updateSetting("saturation", saturationInput.value)
})

setEvents(blurInput, () => {
	updateSetting("blur", blurInput.value)
})

setEvents(inversionInput, () => {
	updateSetting("inversion", inversionInput.value)
})

saveBtn.addEventListener("click", () => {
	if (!image) return
	let image_url = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  	let downloader = document.createElement("a")
  	downloader.href = image_url
  	downloader.download = filenameInput.value
  	downloader.target = "_blank"
  	downloader.click()
  	delete downloader
})

fileInput.addEventListener("change", () => {
	loading_bar.style.opacity = "1"
	image = new Image()
	change_image.textContent = "Change Image"
	image.addEventListener("load", () => {
		loading_bar.style.opacity = "0"
		resetSettings()
		renderImage()
	})

	filenameInput.value = "online-" + fileInput.files[0].name
	image.src = URL.createObjectURL(fileInput.files[0])

	canvas.style.display = "block"
	filelabel.style.display = "none"
})

resetallBtn.addEventListener("click", () => {
	resetSettings()
	renderImage()
})

function contextHandler(e) {
	e.preventDefault()
}
document.addEventListener("contextmenu", contextHandler, false)

filenameInput.addEventListener("contextmenu", (e) => {
	e.stopPropagation(); // it worked
	return true
}, true)