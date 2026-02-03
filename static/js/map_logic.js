let contadorPuntos = 0;

document.addEventListener('DOMContentLoaded', function() {
    // 1. Inicializar mapa en Ensenada
    var map = L.map('map').setView([31.8667, -116.6167], 12);

    // 2. CAPA DE RELIEVE CLARO (Esri World Topo Map)
    // Este mapa es clarito, muestra las montañas y es gratuito.
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    }).addTo(map);

    // 3. Función para la lista lateral (con mejor contraste para mapa claro)
    window.agregarALista = function(lat, lng) {
        const lista = document.getElementById('lista-lugares');
        contadorPuntos++;
        
        const msg = document.getElementById('mensaje-vacio');
        if (msg) msg.remove();

        const item = document.createElement('div');
        // Usamos un fondo oscuro translúcido para que resalte sobre el mapa claro
        item.className = "p-4 bg-slate-900/60 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-slate-800 transition-all cursor-pointer group shadow-xl mb-3";
        
        item.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="bg-green-500 text-black font-black w-10 h-10 flex items-center justify-center rounded-xl text-xs shadow-lg">
                    ${contadorPuntos}
                </div>
                <div>
                    <p class="text-white font-bold text-sm tracking-tight">Punto de Ruta</p>
                    <p class="text-green-400 text-[10px] font-mono opacity-90">${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
                </div>
            </div>
        `;
        
        item.onclick = () => map.flyTo([lat, lng], 16);
        lista.prepend(item);
    };

    // 4. Lógica de clics y marcador
    map.on('click', function(e) {
        const {lat, lng} = e.latlng;
        const tempMarker = L.marker([lat, lng]).addTo(map);

        tempMarker.bindPopup(`
            <div class="p-2 text-center">
                <p class="text-gray-700 text-[10px] mb-2 font-bold uppercase tracking-widest">¿Guardar este punto?</p>
                <button onclick="confirmarPunto(${lat}, ${lng}, this)" 
                        class="bg-green-600 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-green-700 transition-all">
                    Confirmar
                </button>
            </div>
        `).openPopup();

        tempMarker.on('popupclose', () => {
            if (!tempMarker.isConfirmed) map.removeLayer(tempMarker);
        });

        window.currentTempMarker = tempMarker;
    });

    // 5. Función de guardado
    window.confirmarPunto = function(lat, lng, btn) {
        const spinner = document.getElementById('spinner');
        btn.disabled = true;
        btn.innerHTML = "Subiendo...";
        if (spinner) spinner.classList.remove('hidden');

        fetch('/guardar_punto', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({lat, lng})
        })
        .then(res => res.json())
        .then(data => {
            if (spinner) spinner.classList.add('hidden');
            if (window.currentTempMarker) window.currentTempMarker.isConfirmed = true;
            agregarALista(lat, lng);
            map.closePopup();
        })
        .catch(err => {
            console.error(err);
            if (spinner) spinner.classList.add('hidden');
            btn.disabled = false;
            btn.innerHTML = "Error";
        });
    };
});