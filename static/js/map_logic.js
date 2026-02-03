let contadorPuntos = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar mapa
    var map = L.map('map').setView([31.8667, -116.6167], 13);

    // MAPA CLARO Y PROFESIONAL (Alidade Smooth)
    // Este mapa es perfecto porque es claro pero minimalista
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; Stadia Maps, &copy; OpenStreetMap'
    }).addTo(map);

    window.agregarALista = function(lat, lng) {
        const lista = document.getElementById('lista-lugares');
        contadorPuntos++;
        
        const msg = document.getElementById('mensaje-vacio');
        if (msg) msg.remove();

        const item = document.createElement('div');
        // Estilo de tarjeta mejorado para combinar con tu landing
        item.className = "p-4 bg-white/10 border border-white/20 rounded-2xl hover:bg-green-500/20 hover:border-green-400 transition-all cursor-pointer group shadow-lg";
        
        item.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="bg-green-500 text-black font-black w-10 h-10 flex items-center justify-center rounded-xl text-xs shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                    ${contadorPuntos}
                </div>
                <div>
                    <p class="text-white font-bold text-sm tracking-tight">Ruta Registrada</p>
                    <p class="text-green-400 text-[10px] font-mono opacity-90">${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
                </div>
            </div>
        `;
        
        item.onclick = () => map.flyTo([lat, lng], 16);
        lista.prepend(item);
    };

    map.on('click', function(e) {
        const {lat, lng} = e.latlng;
        // Marcador personalizado (opcional, por ahora el estándar)
        const marker = L.marker([lat, lng]).addTo(map);
        
        marker.bindPopup(`
            <div class="p-2 text-center bg-gray-900 rounded-lg">
                <p class="text-white text-[10px] mb-2 font-bold uppercase">¿Guardar coordenadas?</p>
                <button onclick="confirmarPunto(${lat}, ${lng}, this)" 
                        class="bg-green-600 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-green-400 transition-colors">
                    Confirmar
                </button>
            </div>
        `).openPopup();
        window.currentMarker = marker;
    });

    window.confirmarPunto = function(lat, lng, btn) {
        document.getElementById('spinner').classList.remove('hidden');
        btn.innerText = "PROCESANDO...";
        
        fetch('/guardar_punto', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({lat, lng})
        }).then(() => {
            document.getElementById('spinner').classList.add('hidden');
            if(window.currentMarker) window.currentMarker.isConfirmed = true;
            agregarALista(lat, lng);
            map.closePopup();
        });
    };
});