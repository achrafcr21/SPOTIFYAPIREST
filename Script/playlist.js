// Variables globals
let token = "";
let currentPlaylistId = null;
const apiUrl = "https://api.spotify.com/v1";

// Funció per obtenir el token
function getToken() {
    const hash = window.location.hash;
    if (hash) {
        token = hash.substring(1).split('&')[0].split('=')[1];
        console.log("Token obtingut:", token);
        carregarPlaylists();
        carregarCançonsGuardades();
    } else {
        console.error("No s'ha trobat el token");
    }
}

// Funció per carregar les playlists
async function carregarPlaylists() {
    try {
        const resposta = await fetch(`${apiUrl}/me/playlists`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resposta.ok) throw new Error(`Error ${resposta.status}`);
        const dades = await resposta.json();
        mostrarPlaylists(dades.items);
    } catch (error) {
        console.error("Error al carregar playlists:", error);
    }
}

// Funció per mostrar les playlists
function mostrarPlaylists(playlists) {
    const container = document.getElementById("playlist-container");
    container.innerHTML = "";
    playlists.forEach(playlist => {
        const div = document.createElement("div");
        div.className = "playlist-item";
        div.textContent = playlist.name;
        div.onclick = () => seleccionarPlaylist(playlist.id, playlist.name);
        container.appendChild(div);
    });
}

// Funció per seleccionar una playlist
async function seleccionarPlaylist(playlistId, playlistName) {
    currentPlaylistId = playlistId;
    document.getElementById("playlist-name").value = playlistName;
    try {
        const resposta = await fetch(`${apiUrl}/playlists/${playlistId}/tracks`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resposta.ok) throw new Error(`Error ${resposta.status}`);
        const dades = await resposta.json();
        mostrarCançons(dades.items);
    } catch (error) {
        console.error("Error al carregar cançons:", error);
    }
}

// Funció per mostrar les cançons
function mostrarCançons(cançons) {
    const container = document.getElementById("cançons-container");
    container.innerHTML = "";
    cançons.forEach(item => {
        const div = document.createElement("div");
        div.className = "canço-item";
        const dataAfegida = new Date(item.added_at).toLocaleDateString();
        div.innerHTML = `
            ${item.track.name} - ${item.track.artists[0].name} - ${dataAfegida}
            <button onclick="eliminarCanço('${item.track.uri}')">DEL</button>
        `;
        container.appendChild(div);
    });
}

// Funció per carregar cançons guardades
function carregarCançonsGuardades() {
    console.log("Intentant carregar cançons del localStorage...");
    const cançons = JSON.parse(localStorage.getItem('cançons') || '[]');
    console.log("Cançons carregades del localStorage:", cançons);

    const container = document.getElementById("cançons-seleccionades-container");
    container.innerHTML = "";
    cançons.forEach(canço => {
        const div = document.createElement("div");
        div.className = "canço-item";
        div.innerHTML = `
            ${canço.nom} - ${canço.artista}
            <div>
                <button onclick="afegirAPlaylist('${canço.uri}')">ADD</button>
                <button onclick="eliminarCançoGuardada('${canço.uri}')">DEL</button>
            </div>
        `;
        container.appendChild(div);
    });
}

// Funció per eliminar cançó de playlist
async function eliminarCanço(uri) {
    if (!currentPlaylistId) return;
    if (!confirm("Estàs segur que vols eliminar la cançó de la playlist?")) return;

    try {
        const resposta = await fetch(`${apiUrl}/playlists/${currentPlaylistId}/tracks`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tracks: [{ uri }]
            })
        });
        if (!resposta.ok) throw new Error(`Error ${resposta.status}`);
        seleccionarPlaylist(currentPlaylistId, document.getElementById("playlist-name").value);
    } catch (error) {
        console.error("Error al eliminar cançó:", error);
    }
}

// Funció per afegir cançó a playlist
async function afegirAPlaylist(uri) {
    if (!currentPlaylistId) {
        alert("Has de seleccionar una playlist");
        return;
    }
    if (!confirm("Estàs segur que vols afegir la cançó a la playlist?")) return;

    try {
        const resposta = await fetch(`${apiUrl}/playlists/${currentPlaylistId}/tracks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: [uri]
            })
        });
        if (!resposta.ok) throw new Error(`Error ${resposta.status}`);
        alert("La cançó s'ha afegit correctament");
        eliminarCançoGuardada(uri);
        seleccionarPlaylist(currentPlaylistId, document.getElementById("playlist-name").value);
    } catch (error) {
        console.error("Error al afegir cançó:", error);
    }
}

// Funció per eliminar cançó guardada
function eliminarCançoGuardada(uri) {
    if (!confirm("Estàs segur que vols eliminar la cançó de la llista de cançons guardades?")) return;
    
    const cançons = JSON.parse(localStorage.getItem('cançons') || '[]');
    const novesCançons = cançons.filter(c => c.uri !== uri);
    localStorage.setItem('cançons', JSON.stringify(novesCançons));
    carregarCançonsGuardades();
}

// Funció per modificar nom playlist
async function modificarNomPlaylist() {
    if (!currentPlaylistId) return;
    const nouNom = document.getElementById("playlist-name").value;
    if (!confirm("Estàs segur que vols modificar el nom de la playlist?")) return;

    try {
        const resposta = await fetch(`${apiUrl}/playlists/${currentPlaylistId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nouNom
            })
        });
        if (!resposta.ok) throw new Error(`Error ${resposta.status}`);
        carregarPlaylists();
    } catch (error) {
        console.error("Error al modificar nom:", error);
    }
}

// Event listeners
document.querySelector('.save').addEventListener('click', modificarNomPlaylist);

// Inicialització
getToken();
carregarCançonsGuardades();