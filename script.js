// **Variables globals**
const clientId = 'a4eb78fc15f54c4c8cc39e9b225e09e0';
const clientSecret = 'aebea2dd7b89488a8f76d1d9170efe1b';
const tokenUrl = 'https://accounts.spotify.com/api/token';
let token = ''; // Guardarem aquí el token d'autenticació

// **Funció per obtenir el token d'API de Spotify**
function obtenirToken() {
    const cosConsulta = new URLSearchParams({
        grant_type: 'client_credentials'
    });

    fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: cosConsulta
    })
    .then(resposta => {
        if (!resposta.ok) {
            throw new Error(`Error: ${resposta.status}`);
        }
        return resposta.json();
    })
    .then(dades => {
        token = dades.access_token; // Guardem el token
        habilitarBuscador(); // Activem el buscador
        console.log('Token obtingut:', token);
    })
    .catch(error => {
        console.error('Error al obtenir el token:', error);
    });
}

// **Funció per habilitar el buscador**
function habilitarBuscador() {
    document.getElementById('input-cerca').disabled = false;
    document.getElementById('btn-buscar').disabled = false;
    document.getElementById('btn-borrar').disabled = false;

    // Estil dels botons quan estan habilitats
    document.getElementById('btn-buscar').style.cursor = 'pointer';
    document.getElementById('btn-borrar').style.cursor = 'pointer';
}

// **Funció per buscar cançons a Spotify**
function buscarCançons() {
    const cerca = document.getElementById('input-cerca').value.trim(); // Obtenim el text del buscador
    if (!cerca) {
        alert('Escriu el nom de la cançó que vols buscar.');
        return;
    }

    // Endpoint per fer la cerca
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(cerca)}&type=track&limit=12`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token // Utilitzem el token obtingut
        }
    })
    .then(resposta => {
        if (!resposta.ok) {
            throw new Error(`Error: ${resposta.status}`);
        }
        return resposta.json();
    })
    .then(dades => {
        mostrarResultats(dades.tracks.items); // Mostrem els resultats
    })
    .catch(error => {
        console.error('Error en la cerca:', error);
        alert('Hi ha hagut un problema amb la cerca.');
    });
}


// **Funció per mostrar els resultats a la pàgina**
function mostrarResultats(cancions) {
    const contenidor = document.getElementById('cards-container');
    contenidor.innerHTML = ''; // Esborrem els resultats anteriors

    // Si no hi ha resultats
    if (cancions.length === 0) {
        contenidor.innerHTML = '<p>No s\'han trobat resultats.</p>';
        return;
    }

    // Recorrem cada cançó per crear la seva targeta
    for (let i = 0; i < cancions.length; i++) { // Usar "cancions" correctament
        const canco = cancions[i]; // Cadascuna de les cançons

        // Creem un nou div per a cada targeta
        const targeta = document.createElement('div');
        targeta.className = 'card';

        // Contingut de la targeta amb les dades de la cançó
        targeta.innerHTML = `
            <img src="${canco.album.images[0]?.url || ''}" alt="Caràtula" width="150">
            <h3>${canco.name}</h3>
            <p>Artista: ${canco.artists[0]?.name || 'Desconegut'}</p>
            <p>Àlbum: ${canco.album.name}</p>
            <button onclick="afegirCanco('${canco.name}', '${canco.artists[0]?.name}')">
                + Afegir cançó
            </button>
        `;

        // Afegim la targeta al contenidor de resultats
        contenidor.appendChild(targeta);
    }
}

// **Funció per afegir una cançó a la llista de la dreta**
function afegirCanco(nomCanco, nomArtista) {
    // Seleccionem el contenidor de la llista de cançons
    const llistaContenidor = document.getElementById('llista-cancons');

    // Creem un nou element <li> per afegir-lo a la llista
    const novaCanco = document.createElement('li');
    novaCanco.textContent = `${nomCanco} - ${nomArtista}`;

    // Afegim la nova cançó a la llista
    llistaContenidor.appendChild(novaCanco);
}


// **Funció per esborrar el buscador i resultats**
function esborrarBuscador() {
    document.getElementById('input-cerca').value = ''; // Esborrem el text
    document.getElementById('cards-container').innerHTML = ''; // Esborrem els resultats
    document.getElementById('missatge').textContent = 'Fes una nova búsqueda';
}

// **Esdeveniments per als botons**
document.getElementById('btn-buscar').addEventListener('click', buscarCançons);
document.getElementById('btn-borrar').addEventListener('click', esborrarBuscador);

// **Crida inicial per obtenir el token**
obtenirToken();