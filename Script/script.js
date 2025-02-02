const clientId = 'a4eb78fc15f54c4c8cc39e9b225e09e0';
const clientSecret = 'aebea2dd7b89488a8f76d1d9170efe1b';
const tokenUrl = 'https://accounts.spotify.com/api/token';
let token = ''; // Guardarem aquí el token d'autenticació

//Variables de la segona part de practica
const URL = "https://accounts.spotify.com/authorize";
const redirectUri = "http://127.0.0.1:5500/playlist.html";
const scopes =
  "playlist-modify-private user-library-modify playlist-modify-public";

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
    document.getElementById('btn-playlist').disabled = false;

    // Estil dels botons quan estan habilitats
    document.getElementById('btn-buscar').style.cursor = 'pointer';
    document.getElementById('btn-borrar').style.cursor = 'pointer'; 
    document.getElementById('btn-playlist').style.cursor = 'pointer';
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
    for (let i = 0; i < cancions.length; i++) {
        const canco = cancions[i]; // Cadascuna de les cançons
        const artistaId = canco.artists[0]?.id || ''; // Obtenim el ID del primer artista

        // Creem el div per a la targeta
        const targeta = document.createElement('div');
        targeta.className = 'card';
        targeta.onclick = function() {
            obtenirInformacioArtista(artistaId); // Assignem l'acció del clic
        };

        // Creem la imatge
        const imatge = document.createElement('img');
        imatge.src = canco.album.images[0]?.url || '';
        imatge.alt = 'Caràtula';
        imatge.width = 150;

        // Creem el títol (h3)
        const titol = document.createElement('h3');
        titol.textContent = canco.name;

        // Creem el paràgraf per a l'artista
        const parArtista = document.createElement('p');
        parArtista.textContent = `Artista: ${canco.artists[0]?.name || 'Desconegut'}`;

        // Creem el paràgraf per a l'àlbum
        const parAlbum = document.createElement('p');
        parAlbum.textContent = `Àlbum: ${canco.album.name}`;

        // Creem el botó
        const boto = document.createElement('button');
        boto.textContent = '+ Afegir cançó';
        boto.onclick = function(event) {
            afegirCanco(canco);
            event.stopPropagation(); // Evitem que el clic del botó activi el clic de la targeta
        };

        // Afegim els elements al div de la targeta
        targeta.appendChild(imatge);
        targeta.appendChild(titol);
        targeta.appendChild(parArtista);
        targeta.appendChild(parAlbum);
        targeta.appendChild(boto);

        // Afegim la targeta al contenidor de resultats
        contenidor.appendChild(targeta);
    }
}

// **Funció per afegir cançó
function afegirCanco(track) {
    // Guardar en localStorage
    const cançons = JSON.parse(localStorage.getItem('cançons') || '[]');
    const novaCanco = {
        nom: track.name,
        artista: track.artists[0].name,
        uri: track.uri
    };
    cançons.push(novaCanco);
    localStorage.setItem('cançons', JSON.stringify(cançons));
    
    // Console.log para debug
    console.log("Cançó guardada en localStorage:", novaCanco);
    console.log("Totes les cançons en localStorage:", cançons);

    // Mostrar en la lista de canciones (recuperamos esta parte)
    const llistaCançons = document.getElementById('llista-cancons');
    const li = document.createElement('li');
    li.textContent = `${track.name} - ${track.artists[0].name}`;
    llistaCançons.appendChild(li);
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

// Funcion playlist:
const autoritzar = function () {
    const authUrl =
      URL +
      `?client_id=${clientId}` +
      `&response_type=token` +
      `&redirect_uri=${redirectUri}` +
      `&scope=${scopes}`;
  
    window.location.assign(authUrl);
  };
  
  // Assignar l'esdeveniment al botó
  document.getElementById("btn-playlist").addEventListener("click", autoritzar);

// **Crida inicial per obtenir el token**
obtenirToken();