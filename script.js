const clientId = 'a4eb78fc15f54c4c8cc39e9b225e09e0';
const clientSecret = 'aebea2dd7b89488a8f76d1d9170efe1b';
const tokenUrl = 'https://accounts.spotify.com/api/token';
let token = ''; // Guardarem aquí el token d'autenticació

// **Funció per obtenir el token d'API de Spotify**
function obtenirToken() {
    console.log('Iniciant obtenció del token...');
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
    console.log('Habilitant buscador...');
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

    if (cancions.length === 0) {
        contenidor.innerHTML = '<p>No s\'han trobat resultats.</p>';
        return;
    }

    // Recorrem cada cançó per crear la seva targeta
    cancions.forEach(canco => {
        const artistaId = canco.artists[0]?.id || '';

        // Creem un nou div per a cada targeta
        const targeta = document.createElement('div');
        targeta.className = 'card';
        targeta.setAttribute('onclick', `obtenirInformacioArtista('${artistaId}')`);

        targeta.innerHTML = `
            <img src="${canco.album.images[0]?.url || ''}" alt="Caràtula" width="150">
            <h3>${canco.name}</h3>
            <p>Artista: ${canco.artists[0]?.name || 'Desconegut'}</p>
            <p>Àlbum: ${canco.album.name}</p>
            <button onclick="afegirCanco('${canco.name}', '${canco.artists[0]?.name}'); event.stopPropagation();">
                + Afegir cançó
            </button>
        `;
        contenidor.appendChild(targeta);
    });
}

// **Funció per afegir una cançó a la llista de la dreta**
window.afegirCanco = function (nomCanco, nomArtista) {
    const llistaContenidor = document.getElementById('llista-cancons');
    const novaCanco = document.createElement('li');
    novaCanco.textContent = `${nomCanco} - ${nomArtista}`;
    llistaContenidor.appendChild(novaCanco);
}

// **Funció per obtenir informació detallada d'un artista a partir del seu ID**
function obtenirInformacioArtista(artistaId) {
    if (!artistaId) {
        alert('No s\'ha trobat informació d\'aquest artista.');
        return;
    }

    const url = `https://api.spotify.com/v1/artists/${artistaId}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error(`Error: ${resposta.status}`);
            }
            return resposta.json();
        })
        .then(artista => {
            mostrarInformacioArtista(artista); // Passa l'objecte artista complet
        })
        .catch(error => {
            console.error('Error al obtenir informació de l\'artista:', error);
            alert('Hi ha hagut un problema amb la informació de l\'artista.');
        });
}

// **Funció per mostrar la informació d'un artista al panell lateral**
function mostrarInformacioArtista(artista) {
    const contenidorArtista = document.getElementById('informacio-artista');
    const generes = artista.genres.length > 0 ? artista.genres.join(', ') : 'No disponible';

    contenidorArtista.innerHTML = `
        <h2>${artista.name}</h2>
        <p><strong>Popularitat:</strong> ${artista.popularity}</p>
        <p><strong>Gèneres:</strong> ${generes}</p>
        <p><strong>Seguidors:</strong> ${artista.followers.total.toLocaleString()}</p>
    `;
}

// **Funció per esborrar el buscador i resultats**
function esborrarBuscador() {
    document.getElementById('input-cerca').value = '';
    document.getElementById('cards-container').innerHTML = '';
    document.getElementById('missatge').textContent = 'Fes una nova búsqueda';
}

// **Esdeveniments per als botons**
document.getElementById('btn-buscar').addEventListener('click', buscarCançons);
document.getElementById('btn-borrar').addEventListener('click', esborrarBuscador);

// **Crida inicial per obtenir el token**
obtenirToken();