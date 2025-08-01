// Creando las variables
const ingresarPokemon = document.getElementById("ingresar-pokemon");
const clicBoton = document.getElementById("clic-boton");
const pokemonFiltrado = document.getElementById("pokemon-filtrado");
const lisCaptura = document.getElementById("lista-captura");

let listaCaptura = [];

// Función para buscar un Pokémon
async function buscarPokemon(nombre) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`);
        if (!response.ok) throw new Error("Ese Pokémon no existe :)");

        const data = await response.json();
        resultadoBusqueda(data);
    } catch (error) {
        mostrarError(error.message);
    }
}

// Función para mostrar el Pokémon encontrado
function resultadoBusqueda(pokemon) {
    pokemonFiltrado.innerHTML = "";

    const carta = document.createElement("div");
    carta.classList.add("pokemon-card");

    const img = document.createElement("img");
    img.src = pokemon.sprites.front_default;

    const nombre = document.createElement("h3");
    nombre.textContent = pokemon.name;

    const tipos = document.createElement("p");
    tipos.textContent = " Tipo(s): " + pokemon.types.map(t => t.type.name).join(", ");

    const altura = document.createElement("p");
    altura.textContent = "Altura: " + (pokemon.height / 10) + "m ";

    const peso = document.createElement("p");
    peso.textContent = " Peso: " + (pokemon.weight / 10) + "kg ";

    const btnAgregar = document.createElement("button");
    btnAgregar.textContent = "Agregar";
    btnAgregar.onclick = () => agregarAPokelist(pokemon);

    carta.appendChild(img);
    carta.appendChild(nombre);
    carta.appendChild(tipos);
    carta.appendChild(altura);
    carta.appendChild(peso);
    carta.appendChild(btnAgregar);
    pokemonFiltrado.appendChild(carta);
}

// Función para mostrar errores
function mostrarError(mensaje) {
    pokemonFiltrado.innerHTML = `<p style="color: red; margin-top: 10px;">⚠️ ${mensaje}</p>`;
}

// Agregar a la lista
function agregarAPokelist(pokemon) {
    const yaExiste = listaCaptura.some(p => p.id === pokemon.id);
    if (yaExiste) {
        alert("Este Pokémon ya está en tu Pokédex.");
        return;
    }

    listaCaptura.push({
        id: pokemon.id,
        nombre: pokemon.name,
        imagen: pokemon.sprites.front_default,
        estado: "pendiente",
        tipos: pokemon.types.map(t => t.type.name),
        altura: pokemon.height / 10,
        peso: pokemon.weight / 10
    });

    actualizarListaCaptura();
    guardarEnLocalStorage();
    pokemonFiltrado.innerHTML = "";
}

// Mostrar la lista de captura
function actualizarListaCaptura() {
    lisCaptura.innerHTML = "";

    listaCaptura.forEach((p) => {
        if (filtroActual !== "todos" && p.estado !== filtroActual) return;

        const item = document.createElement("li");
        item.classList.add("capture-item");

        const img = document.createElement("img");
        img.src = p.imagen;

        const nombre = document.createElement("h4");
        nombre.textContent = p.nombre;

        const tipos = document.createElement("p");
        tipos.textContent = "Tipo(s): " + p.tipos.join(", ");

        const altura = document.createElement("p");
        altura.textContent = "Altura: " + p.altura + " m";

        const peso = document.createElement("p");
        peso.textContent = "Peso: " + p.peso + " kg";

        const estadoBtn = document.createElement("button");
        estadoBtn.textContent = p.estado === "capturado" ? "✔ Capturado" : "✖ Pendiente";
        estadoBtn.className = p.estado === "capturado" ? "btn-capturado" : "btn-pendiente";
        estadoBtn.onclick = () => {
            p.estado = p.estado === "capturado" ? "pendiente" : "capturado";
            actualizarListaCaptura();
            guardarEnLocalStorage();
        };

        item.appendChild(img);
        item.appendChild(nombre);
        item.appendChild(tipos);
        item.appendChild(altura);
        item.appendChild(peso);
        item.appendChild(estadoBtn);

        lisCaptura.appendChild(item);
    });
}

// Evento del botón
clicBoton.addEventListener("click", () => {
    const nombre = ingresarPokemon.value.trim();
    if (nombre) {
        buscarPokemon(nombre);
    }
});

//local storage
function guardarEnLocalStorage() {
    localStorage.setItem("listaCaptura", JSON.stringify(listaCaptura));
}

window.addEventListener("DOMContentLoaded", () => {
    const guardada = localStorage.getItem("listaCaptura");
    if (guardada) {
        listaCaptura = JSON.parse(guardada);
        actualizarListaCaptura();
    }
});

let filtroActual = "todos";

document.getElementById("filtros").addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        filtroActual = e.target.dataset.filtro;
        actualizarListaCaptura();
    }
});