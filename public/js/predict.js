var clsName;
var percentage;
let counter = 0;
var outPutLbl = document.querySelector('.outPutLbl');
var explanationLbl = document.querySelector('.explanationLbl');
var causesLbl = document.querySelector('.causesLbl');
var treatmentLbl = document.querySelector('.treatmentLbl');
var selftreatmentLbl = document.querySelector('.selftreatmentLbl');
let imageLoaded = false;
$("#image-selector").change(function () {
	imageLoaded = false;
	let reader = new FileReader();
	reader.onload = function () {
		let dataURL = reader.result;
		$("#selected-image").attr("src", dataURL);
		$("#prediction-list").empty();
		imageLoaded = true;
	}

	let file = $("#image-selector").prop('files')[0];
	reader.readAsDataURL(file);
});

let model;
let modelLoaded = false;
$(document).ready(async function () {
	modelLoaded = false;
	$('.progress-bar').show();
	console.log("Loading model...");
	model = await tf.loadGraphModel('model/model.json');
	console.log("Model loaded.");
	$('.progress-bar').hide();
	modelLoaded = true;
});

$("#predict-button").click(async function () {
	if (!modelLoaded) { alert("The model must be loaded first"); return; }
	if (!imageLoaded) { alert("Please select an image first"); return; }

	let image = $('#selected-image').get(0);

	// Pre-process the image
	console.log("Loading image...");
	let tensor = tf.browser.fromPixels(image, 3)
		.resizeNearestNeighbor([224, 224]) // change the image size
		.expandDims()
		.toFloat()
		.reverse(-1); // RGB -> BGR
	let predictions = await model.predict(tensor).data();
	console.log(predictions);
	let top5 = Array.from(predictions)
		.map(function (p, i) { // this is Array.map
			return {
				probability: p,
				className: TARGET_CLASSES[i] // we are selecting the value from the obj
			};
		}).sort(function (a, b) {
			return b.probability - a.probability;
		}).slice(0, 4);

	$("#prediction-list").empty();
	top5.forEach(function (p) {
		$("#prediction-list").append(`<li>${p.className}: ${p.probability.toFixed(2)}</li>`);
	});

	const items = top5.map((num) => {
		return num.className
	})

	for (let i = 0; i < 1; i++) {
		percentage = top5[i].probability.toFixed(2);
		clsName = top5[i].className;
	}
	var view = document.querySelectorAll(".box")
	view[0].classList.remove('hidden');

	console.log(percentage);
	console.log(clsName);

	if (clsName === "DrugRash") {
		outPutLbl.innerHTML = "Drug Rash";
		explanationLbl.innerHTML = "Temporary outbreak of red, bumpy, scaly or itchy patches of skin, possibly with blisters or welts.";
		causesLbl.innerHTML = "CAUSES : Skin rashes can have causes that aren't due to underlying disease. Examples include hot and humid weather, excess sun exposure or scratchy clothes that don't fit.";
		treatmentLbl.innerHTML = "MEDICINE : glucocorticoids, epinephrine (given by injection), diphenhydramine, corticosteroid ";
		selftreatmentLbl.innerHTML = "SELF TREATMENT : Avoiding harsh soaps and detergents, perfumed soaps or lotions and known allergy triggers may help to soothe irritated skin. Using an antihistamine or steroid cream may also help.";
	} 
	else if (clsName === "ErythemaMigrans") {
		outPutLbl.innerHTML = "Erythema Migrans";
		explanationLbl.innerHTML = "an expanding rash often seen in the early stage of Lyme disease, and can also (but less commonly) be caused by southern tick-associated rash illness.";
		causesLbl.innerHTML = "CAUSES : a bite from a lone star tick";
		treatmentLbl.innerHTML = "MEDICINE : oral antibiotics, such as doxycycline (Acticlate, Doryx, Vibra-Tabs) or amoxicillin. A 14- to 21-day course of treatment will effectively treat the disease in most people. If your Lyme disease is in a later stage with neurological symptoms, you might need intravenous (IV) antibiotics.";
		selftreatmentLbl.innerHTML = "SELF TREATMENT : If you’re in wooded or high grass areas during tick season (May through mid-July), it’s important that you take precautions to avoid tick bites. This is the best way to prevent Lyme disease.";
	} 
	else if (clsName === "PityriasisRoseaRash") {
		outPutLbl.innerHTML = "Pityriasis Rosea Rash";
		explanationLbl.innerHTML = "A skin rash that sometimes begins as a large spot on the chest, abdomen or back, followed by a pattern of smaller lesions";
		causesLbl.innerHTML = "CAUSES : The cause of pityriasis rosea isn't well understood, but it may be triggered by a viral infection.";
		treatmentLbl.innerHTML = "MEDICINE : Corticosteroids";
		selftreatmentLbl.innerHTML = "SELF TREATMENT : Condition usually improves over time without treatment. Moisturizer, Hydrates and protects skin from damage.";
	} 
	else if (clsName === "RingWorm") {
		outPutLbl.innerHTML = "Ring Worm";
		explanationLbl.innerHTML = "A highly contagious fungal infection of the skin or scalp.";
		causesLbl.innerHTML = "CAUSES : caused by a fungus";
		treatmentLbl.innerHTML = "MEDICINE : Antifungal";
		selftreatmentLbl.innerHTML = "SELF TREATMENT : Antifungal creams, ointments, gels, or sprays.";
	}
});

