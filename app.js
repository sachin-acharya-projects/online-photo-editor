// DOM selection lines
const $ = (identifier) => document.querySelector(identifier)

const fileInput = $("#inputFile")

const brightnessInput = $("#brightness");
const saturationInput = $("#saturation");
const blurInput = $("#blur");
const inversionInput = $("#inversion");

const sliderInput = [brightnessInput, saturationInput, blurInput, inversionInput]

const filenameInput = $(".filename")
const filelabel = $(".inputFileLabel")

const change_image = $(".change_image")
const loading_bar = $(".loading-bar")

const resetallBtn = $(".reset-all")
const saveBtn = $(".save")

const canvas = $("#canvas")
const canvasCtx = canvas.getContext("2d")

// Preserve previous settings for most of the browser::not all
const settings = {
	brightness: brightnessInput.value,
	saturation: saturationInput.value,
	blur: blurInput.value,
	inversion: inversionInput.value
}

let defaultSettings = {
	brightness: "100",
  saturation: "100",
	blur: "0",
  inversion: "0"
}
let image = null

function resetSettings() {
	Object.assign(settings, defaultSettings) // target: settings & source: defaultSettings:: a.brightness = b.brightness
  // settings.brightness = "100";
  // settings.saturation = "100";
  // settings.blur = "0";
  // settings.inversion = "0";

  // Checking if defaultSettings is empty by checking absolute value for undefined
  if (defaultSettings['brightness'] === undefined) {
  	// defaultSettings = {...settings}
  	console.log("settings", settings)
  }

  brightnessInput.value = settings.brightness;
  saturationInput.value = settings.saturation;
  blurInput.value = settings.blur;
  inversionInput.value = settings.inversion;
}

function resetOne(key, value) {
	if (!image) return
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
	if(!image) return
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

function changeInputState(state, elementList = sliderInput) {
	elementList.forEach(input => {
		if (state === 'disabled') {
			input.setAttribute(state, true)
		}else {
			input.removeAttribute("disabled")
		}
	})
}

function changeLabelState(state) {
	const labels = document.querySelectorAll(".control-list div div label")
	labels.forEach(label => {
		if(state === 'disabled'){
		label.classList.add("disable")
		}else {
		label.classList.remove("disable")
		}
	})
}

function enableDisable(label_html) {
	if(!image) return
	const valueFor = label_html.htmlFor // label_html.getAttribute("for")
	if (label_html.classList.contains("disable")) {
		label_html.classList.remove("disable")
		previous_value = label_html.getAttribute("data-val")
		resetOne(valueFor, previous_value)
		label_html.title = "Click to disable this setting"
		document.getElementById(valueFor).removeAttribute("disabled")
	}else {
		label_html.classList.add('disable')
		label_html.setAttribute("data-val", settings[valueFor])
		resetOne(valueFor, defaultSettings[valueFor])
		label_html.title = "Click to enable this setting"
		document.getElementById(valueFor).setAttribute("disabled", true)
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
		// resetSettings()
		renderImage()
	})

	filenameInput.value = "online-" + fileInput.files[0].name
	image.src = URL.createObjectURL(fileInput.files[0])

	canvas.style.display = "block"
	filelabel.style.display = "none"
	changeInputState("enabled")
	changeLabelState("enabled")
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

// Initialize beforehand
!function () {
	const labels = document.querySelectorAll(".control-list div div label")
	labels.forEach(label => {
		label.title = "Click to disable this setting"
	})

	changeInputState("disabled")
	changeLabelState("disabled")
	// Optional::Reset Settings
	// resetSettings()
}()