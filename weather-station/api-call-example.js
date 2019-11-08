const request = new XMLHttpRequest();

// Open a new connection, using the GET request on the URL endpoint
request.open('GET', `http://192.168.1.32:8080/last-measure`, true);

request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
        const jsonResult = JSON.parse(this.response)

    } else {
        console.log('Erreur ...')
    }
}

// Send request
request.send();