'use strict';

// Initialisation générale
document.addEventListener('DOMContentLoaded', (event) => {

    // Ajout du listener sur la dernière mesure
    document.getElementById("id-last-mesure").addEventListener('click', onLastMeasureClick);

    // Ajout du listener sur le top des mesures
    document.getElementById("id-top-mesures").addEventListener('click', onTopMeasuresClick);

    // Ajout du listener sur le tableau des mesures
    document.getElementById("id-table-mesures").addEventListener('click', onTableMeasuresClick);

    // Ajout du listener sur les graphiques des mesures
    document.getElementById("id-graph-mesures").addEventListener('click', onGraphMeasuresClick);

});

//---------------------------------------------------------------------------------
// Dernière mesure
//---------------------------------------------------------------------------------
/**
 * Callback (onClick) sur la dernière mesure
 * @param {Event} e 
 */
function onLastMeasureClick(e) {
    // Suppression de l'ancien affichage
    clearPanelMeasures();

    // Appel de la request
    requestStationMeteo('GET', `http://192.168.1.197:8080/last-measure`, 'onLastMeasureResponse');
};

/**
 * Callback (onLoad) sur la dernière mesure
 * @param {JSON} response 
 */
function onLastMeasureResponse(response) {

    displayMeasure("id-section-details",
        "Dernière mesure du ",
        response.measureDate.substring(0, 10),
        response.temperature,
        response.humidity,
        response.pressure
    );
};

//---------------------------------------------------------------------------------
// Top mesures
//---------------------------------------------------------------------------------
/**
 * Callback (onClick) sur le top mesures
 * @param {Event} e 
 */
function onTopMeasuresClick(e) {
    // Suppression de l'ancien affichage
    clearPanelMeasures();

    // Appel de la request top humidité
    requestStationMeteo('GET', `http://192.168.1.197:8080/top-measure/humidity`, 'onTopMeasureHumidityResponse');

    // Appel de la request top température
    requestStationMeteo('GET', `http://192.168.1.197:8080/top-measure/temperature`, 'onTopMeasureTemperatureResponse');

    // Appel de la request top pression
    requestStationMeteo('GET', `http://192.168.1.197:8080/top-measure/pressure`, 'onTopMeasurePressureResponse');
};

/**
 * Callback (onLoad) sur le top mesure humidité
 * @param {JSON} response 
 */
function onTopMeasureHumidityResponse(response) {

    displayMeasure("id-section-details",
        "Top humidité le ",
        response.measureDate.substring(0, 10),
        response.temperature,
        response.humidity,
        response.pressure
    );
};

/**
 * Callback (onLoad) sur le top mesure température
 * @param {JSON} response 
 */
function onTopMeasureTemperatureResponse(response) {

    displayMeasure("id-section-details",
        "Top température le ",
        response.measureDate.substring(0, 10),
        response.temperature,
        response.humidity,
        response.pressure
    );
};

/**
 * Callback (onLoad) sur le top mesure pression
 * @param {JSON} response 
 */
function onTopMeasurePressureResponse(response) {

    displayMeasure("id-section-details",
        "Top pression le ",
        response.measureDate.substring(0, 10),
        response.temperature,
        response.humidity,
        response.pressure
    );

};

//---------------------------------------------------------------------------------
// Tableau des mesures
//---------------------------------------------------------------------------------
/**
 * Callback (onClick) sur le bouton tableau des mesures
 * @param {Event} e 
 */
function onTableMeasuresClick(e) {
    // Suppression de l'ancien affichage
    clearPanelMeasures();

    // Récupération de la date courante
    let today = new Date();
    // Mise en forme de la date au format YYYY-MM-DD
    let currentDate = today.getFullYear() + '-' + (today.getMonth() + 1).toLocaleString("fr-FR", {
        minimumIntegerDigits: 2
    }) + '-' + today.getDate().toLocaleString("fr-FR", {
        minimumIntegerDigits: 2
    });

    // Calcul de j-1
    let yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    // Mise en forme de la date au format YYYY-MM-DD
    yesterdayDate = yesterdayDate.getFullYear() + '-' + (yesterdayDate.getMonth() + 1).toLocaleString("fr-FR", {
        minimumIntegerDigits: 2
    }) + '-' + yesterdayDate.getDate().toLocaleString("fr-FR", {
        minimumIntegerDigits: 2
    });

    // Appel de la request table des mesures
    let url = `http://192.168.1.197:8080/measure/date?startDate=` + yesterdayDate + '&endDate=' + currentDate;
    requestStationMeteo('GET', url, 'onTableMeasuresResponse');
};

/**
 * Callback (onLoad) sur le tableau de mesures
 * @param {JSON} response 
 */
function onTableMeasuresResponse(response) {

    // Récupération du point d'ancrage
    const anchor = document.getElementById("id-section-details");

    let tableEl = document.createElement("table");
    tableEl.classList.add('table');

    let theadEl = document.createElement("thead");
    tableEl.appendChild(theadEl);
    anchor.appendChild(tableEl);

    let trEl = document.createElement("tr");
    theadEl.appendChild(trEl);

    addTagTh(trEl, "Date");
    addTagTh(trEl, "Température (°C)");
    addTagTh(trEl, "Humidité (%hum)");
    addTagTh(trEl, "Pression (hPa)");

    let tbodyEl = document.createElement("tbody");
    tableEl.appendChild(tbodyEl);

    for (let i = 0; i < response.length; i++) {
        let trEl2 = document.createElement("tr");
        tbodyEl.appendChild(trEl2);

        addTagTd(trEl2, response[i].measureDate.substring(0, 10) + " " + response[i].measureDate.substring(11, 19));
        addTagTd(trEl2, response[i].temperature);
        addTagTd(trEl2, response[i].humidity);
        addTagTd(trEl2, response[i].pressure);
    }
};

//---------------------------------------------------------------------------------
// Graphiques des mesures
//---------------------------------------------------------------------------------
/**
 * Callback (onClick) sur le bouton graphiques de mesures
 * @param {Event} e 
 */
function onGraphMeasuresClick(e) {
    // Suppression de l'ancien affichage
    clearPanelMeasures();

    const datePickerModelEl = document.getElementById("graphDatePickerModel");
    let datePickerEl = datePickerModelEl.cloneNode(true);

    const anchor = document.getElementById("id-section-details");
    anchor.appendChild(datePickerEl);

    
    let canvasEl = datePickerEl.querySelector("#graphCanvasModel");
    canvasEl.setAttribute("id", "graphCanvas");

    datePickerEl.setAttribute("id", "graphDatePicker");
    datePickerEl.classList.remove("hide");

    let inputEls = datePickerEl.querySelectorAll("input");
    inputEls[0].setAttribute("id", "graphDatePickerStartDate");
    inputEls[1].setAttribute("id", "graphDatePickerEndDate");

    datePickerEl.querySelector("#id-form-datepicker-submit-Model").setAttribute("id", "id-form-datepicker-submit");

    // Récupération de la date courante
    let today = new Date();
    // Mise en forme de la date au format YYYY-MM-DD
    let currentDate = today.getFullYear() + '-' + (today.getMonth() + 1).toLocaleString("fr-FR", {
        minimumIntegerDigits: 2
    }) + '-' + today.getDate().toLocaleString("fr-FR", {
        minimumIntegerDigits: 2
    });

    // Calcul de j-1
    let yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    // Mise en forme de la date au format YYYY-MM-DD
    yesterdayDate = yesterdayDate.getFullYear() + '-' + (yesterdayDate.getMonth() + 1).toLocaleString("fr-FR", {
        minimumIntegerDigits: 2
    }) + '-' + yesterdayDate.getDate().toLocaleString("fr-FR", {
        minimumIntegerDigits: 2
    });

    // Affectation de la plage de date par défaut
    inputEls[0].value = yesterdayDate;
    inputEls[1].value = currentDate;

    // Ajout du listener sur les graphiques des mesures
    document.getElementById("id-form-datepicker-submit").addEventListener('click', onGraphMeasuresCustomDatesClick);

    let url = `http://192.168.1.197:8080/measure/date?startDate=` + yesterdayDate + '&endDate=' + currentDate;

    // Appel de la request table des mesures
    requestStationMeteo('GET', url, 'onGraphMeasuresResponse');

};

/**
 * Callback (onClick) sur le bouton de soumission d'une plage de dates dans l'onglet Graphiques de mesures
 * @param {*} e 
 */
function onGraphMeasuresCustomDatesClick(e) {
    // Suppression des éventuels graphes précédents 
    let children = document.getElementById("graphCanvas");
        while (children.firstChild) {
            children.removeChild(children.firstChild);
        }

    // Récupération de la nouvelle plage de date saisie
    const startDate = document.getElementById("graphDatePickerStartDate").value;
    const endDate =  document.getElementById("graphDatePickerEndDate").value;

    // TODO : contrôle de saisie des dates

    // Appel de la request table des mesures
    let url = `http://192.168.1.197:8080/measure/date?startDate=` + startDate + '&endDate=' + endDate;
    requestStationMeteo('GET', url, 'onGraphMeasuresResponse');
}

/**
 * Callback (onLoad) sur les graphiques de mesures
 * @param {JSON} response 
 */
function onGraphMeasuresResponse(response) {

    // Construction des séries statistiques
    let serieLabels = new Array();
    let serieTemperatures = new Array();
    let serieHumidity = new Array();
    let seriePressure = new Array();

    for (let i = 0; i < response.length; i++) {
        // Limitation des séries statistiques à un point par intervalle de 15 minutes
        if (i % 15 === 0) {
            serieLabels.push(response[i].measureDate.substring(0, 10));
            serieTemperatures.push(response[i].temperature);
            serieHumidity.push(response[i].humidity);
            seriePressure.push(response[i].pressure);
        }
    }

    // Ajout des graphiques
    addGraph("temperature", "Températures", serieLabels, serieTemperatures, 'Evolution des températures', '#8b0000');
    addGraph("humidity", "Humidités", serieLabels, serieHumidity, 'Evolution des humidités', '#2196f3');
    addGraph("pressure", "Pressions", serieLabels, seriePressure, 'Evolution des pressions', '#b8860b');
};

/**
 * Ajout d'un graphique
 * @param {*} type 
 * @param {*} label
 * @param {*} labels 
 * @param {*} serie 
 * @param {*} title 
 * @param {*} color
 */
function addGraph(type, label, labels, serie, title, color) {

    let canvasEl = document.createElement("canvas");
    canvasEl.setAttribute("id", "id-canvas-" + type);
    canvasEl.classList.add('chart');
    canvasEl.setAttribute("width", '350');
    canvasEl.setAttribute("height", '400');

    let ctx = canvasEl.getContext('2d');

    // Récupération du point d'ancrage
    const anchor = document.getElementById("graphCanvas");
    let divEl = document.createElement("div");
    divEl.classList.add("graph");
    anchor.appendChild(divEl);

    divEl.appendChild(canvasEl);

    let myChart = new Chart(canvasEl, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label, // Name the series
                data: serie, // Specify the data values array
                fill: false,
                borderColor: color, // Add custom color border (Line)
                backgroundColor: color, // Add custom color background (Points and Fill)
                borderWidth: 2 // Specify bar border width
            }]
        },
        options: {
            responsive: true, // Instruct chart js to respond nicely.
            maintainAspectRatio: true, // Add to prevent default behaviour of full-width/height
            title: {
                display: true,
                text: title
            },
            scales: {
                yAxes: [{
                    ticks: {
                        //max: 30,
                        //min: 18,
                        //stepSize: 0.5,
                        autoSkip: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        //maxRotation: 90,
                        //minRotation: 90,
                        autoSkip: true
                        //maxTicksLimit: 10
                    },
                    gridLines: {
                        display: true,
                        lineWidth: 1
                    }
                }]
            }
        }
    });
};

//---------------------------------------------------------------------------------
// Fonctions communes
//---------------------------------------------------------------------------------

/**
 * Ajoud d'une balise TH
 * @param {*} trEl 
 * @param {*} textContent 
 */
function addTagTh(trEl, textContent) {
    let th = document.createElement("th");
    th.textContent = textContent;
    th.setAttribute("scope", "col");
    trEl.appendChild(th);
}

/**
 * Ajout d'une balise TD
 * @param {*} trEl 
 * @param {*} textContent 
 */
function addTagTd(trEl, textContent) {
    let td = document.createElement("td");
    td.textContent = textContent;
    trEl.appendChild(td);
}


/**
 * Génère un bloc de mesure
 * @param {*} anchorId
 * @param {*} title 
 * @param {*} date 
 * @param {*} temperature 
 * @param {*} humidity 
 * @param {*} pressure 
 */
function displayMeasure(anchorId, title, date, temperature, humidity, pressure) {
    // Récupération du point d'ancrage
    const anchor = document.getElementById(anchorId);

    let divElement = document.createElement("div");
    divElement.classList.add('measure');
    divElement.classList.add('container-fluid');

    // Date
    let titleElement = document.createElement("h5");
    let boldEl = document.createElement("b");
    divElement.appendChild(boldEl);
    titleElement.textContent = title + date.substring(0, 10);
    boldEl.appendChild(titleElement);

    // Température
    let temperatureElement = document.createElement("h6");
    temperatureElement.textContent = "Température : " + temperature + " °C";
    divElement.appendChild(temperatureElement);

    // Humidité
    let humidityElement = document.createElement("h6");
    humidityElement.textContent = "Humidité : " + humidity + " %hum";
    divElement.appendChild(humidityElement);

    // Pression
    let pressureElement = document.createElement("h6");
    pressureElement.textContent = "Pression : " + pressure + " hPa";
    divElement.appendChild(pressureElement);

    anchor.appendChild(divElement);
}

/**
 * Suppression du corps affiché
 */
function clearPanelMeasures() {
    try {
        let children = document.getElementById("id-section-details");
        while (children.firstChild) {
            children.removeChild(children.firstChild);
        }
    } catch (error) {
        // Rien à supprimer...
        console.log("La balise <SECTION> a mystérieusement disparu... : " + error);
    }

    try {
        // Suppression du listener sur le bouton des graphiques des mesures
        document.getElementById("id-form-datepicker-submit").removeEventListener('click', onGraphMeasuresCustomDatesClick);
    } catch (error) {
        //console.log('Aucun listener à supprimer');
    }
};

/**
 * Envoi d'une request vers le serveur Météo
 * @param {*} type 
 * @param {*} url 
 * @param {*} callback 
 */
function requestStationMeteo(type, url, callback) {
    const request = new XMLHttpRequest();

    // Open a new connection, using the GET request on the URL endpoint
    request.open(type, url, true);

    // Traitement de la réponse du serveur
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            const jsonResult = JSON.parse(this.response);
            // Appel du callback
            //callback(jsonResult);
            window[callback](jsonResult);

        } else {
            const jsonResult = JSON.parse(this.response);
            alert('Erreur de communication ' + request.status + " " + jsonResult.error + ' avec la station météo : ' + jsonResult.message);
        }
    }

    // Traitement d'un problème réseau
    request.onerror = function() {
        console.log("La station météo n'est pas accessible, veuillez contactez votre formateur...");
    }

    // Send request
    request.send();
}
