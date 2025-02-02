# SPOTIFYAPIREST


## **Descripció**
Aquest projecte és un buscador de cançons que utilitza l'API de Spotify. Permet cercar cançons, mostrar informació detallada dels artistes i afegir cançons a una llista personal. El projecte està desenvolupat amb **HTML**, **CSS** i **JavaScript**.

---

## **Funcionalitats**
- 🔍 Cercar cançons a través de l'API de Spotify.
- 🎵 Mostrar informació detallada de cada artista (gèneres, popularitat, seguidors).
- ➕ Afegir cançons a una llista personal.
- 🗑️ Esborrar el text del buscador i els resultats.

---

## **Estructura del projecte**
- **index.html**: Conté l'estructura principal del projecte.
- **styles.css**: Defineix l'estil visual de la pàgina.
- **script.js**: Gestiona tota la lògica del projecte i les interaccions amb l'API de Spotify.

---

## **Passos principals**

### **1. Obtenir el token d'accés**
- Per accedir a l'API de Spotify, es necessita un token d'autenticació.
- Funció: `obtenirToken()`
  - Fa una sol·licitud `POST` a Spotify per obtenir el token.
  - Habilita el buscador quan es genera el token.

```javascript
function obtenirToken() {
    console.log('Iniciant obtenció del token...');
    // Sol·licitud POST per obtenir el token
}
2. Habilitar el buscador
Activa l'input i els botons "Buscar" i "Borrar".
Funció: habilitarBuscador()
javascript
Copiar código
function habilitarBuscador() {
    document.getElementById('input-cerca').disabled = false;
    document.getElementById('btn-buscar').disabled = false;
}
3. Cercar cançons
Fa una cerca de cançons utilitzant l'API de Spotify.
Funció: buscarCançons()
javascript
Copiar código
function buscarCançons() {
    const cerca = document.getElementById('input-cerca').value.trim();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(cerca)}&type=track&limit=12`;
    // Sol·licitud GET a l'API
}
4. Mostrar resultats
Mostra les cançons trobades com a targetes amb informació.
Funció: mostrarResultats(cancions)
javascript
Copiar código
function mostrarResultats(cancions) {
    // Crear targetes dinàmicament
}
5. Mostrar informació de l'artista
Mostra detalls de l'artista seleccionat (gèneres, popularitat, seguidors).
Funcions:
obtenirInformacioArtista(artistaId)
mostrarInformacioArtista(artista)
javascript
Copiar código
function mostrarInformacioArtista(artista) {
    const generes = artista.genres.length > 0 ? artista.genres.join(', ') : 'No disponible';
}
6. Afegir cançons a la llista
Permet afegir cançons a una llista personal.
Funció: afegirCanco(nomCanco, nomArtista)
javascript
Copiar código
function afegirCanco(nomCanco, nomArtista) {
    const novaCanco = document.createElement('li');
    novaCanco.textContent = `${nomCanco} - ${nomArtista}`;
}
7. Borrar el buscador
Esborra el text del buscador i els resultats.
Funció: esborrarBuscador()
javascript
Copiar código
function esborrarBuscador() {
    document.getElementById('input-cerca').value = '';
}
Aprenentatges
Aquest projecte m'ha permès practicar i entendre conceptes com:

Fetch API: Fer sol·licituds GET i POST per accedir a APIs externes.
Manipulació del DOM: Crear i modificar elements HTML dinàmicament.
Gestió d'errors: Identificar i gestionar errors per millorar l'experiència de l'usuari.
Asincronia: Utilitzar promeses i async/await per treballar amb dades externes.
Estructura del projecte
plaintext
Copiar código
📁 Projecte
├── index.html
├── styles.css
└── script.js