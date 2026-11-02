// Hecho a la medida · biblioteca. Sin dependencias.
document.documentElement.classList.add('js');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
const normal = (t) => (t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const escapar = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ICONO = (id) => `<svg aria-hidden="true"><use href="#i-${id}"/></svg>`;
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const fechaCorta = (iso) => { const [a, m, d] = iso.split('-').map(Number); return `${d} ${MESES[m - 1]} ${a}`; };
const TIPOS = { guia: 'Guía', infografia: 'Infografía' };
const BLOQUES = { growth: 'Growth Marketing', marketing: 'Marketing', publicidad: 'Publicidad' };

/* aviso */
const aviso = (t) => {
  const a = $('#aviso');
  a.textContent = t;
  a.classList.add('ver');
  clearTimeout(aviso.t);
  aviso.t = setTimeout(() => a.classList.remove('ver'), 2000);
};

/* copiar: data-copiar="texto" */
document.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-copiar]');
  if (!b) return;
  try { await navigator.clipboard.writeText(b.dataset.copiar); aviso(b.dataset.aviso || 'Copiado'); }
  catch { aviso('No se pudo copiar'); }
});

/* menú lateral en móvil */
(() => {
  const lateral = $('#lateral'), velo = $('#velo'), abrir = $('#abrir-menu');
  if (!lateral || !abrir) return;
  const cerrar = (devolver = true) => {
    lateral.classList.remove('abierto'); velo.classList.remove('ver');
    abrir.setAttribute('aria-expanded', 'false');
    if (devolver) abrir.focus();
  };
  abrir.addEventListener('click', () => {
    lateral.classList.add('abierto'); velo.classList.add('ver');
    abrir.setAttribute('aria-expanded', 'true');
    $('a[aria-current="page"]', lateral)?.focus();
  });
  velo.addEventListener('click', () => cerrar());
  $('.cerrar-menu', lateral)?.addEventListener('click', () => cerrar());
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lateral.classList.contains('abierto')) cerrar(); });
  $$('a', lateral).forEach((a) => a.addEventListener('click', () => cerrar(false)));
  matchMedia('(min-width:1024px)').addEventListener('change', () => cerrar(false));
})();

/* índice de la página: rail (escritorio) y fases (móvil), con la sección activa */
(() => {
  const secciones = $$('main section[id] > h2:not(.oculto)').map((h) => ({ id: h.parentElement.id, t: h.dataset.corto || h.firstChild.textContent.trim() }));
  const rail = $('#rail-lista'), fases = $('#fases');
  if (secciones.length < 2) { $('.rail')?.setAttribute('hidden', ''); return; }
  rail.innerHTML = secciones.map((s) => `<li><a href="#${s.id}">${escapar(s.t)}</a></li>`).join('');
  fases.innerHTML = secciones.map((s) => `<a href="#${s.id}">${escapar(s.t)}</a>`).join('');
  const enlaces = $$('a', rail).concat($$('a', fases));
  const marcar = (id) => {
    enlaces.forEach((a) => a.classList.toggle('activa', a.getAttribute('href') === '#' + id));
    const enFases = $(`a[href="#${id}"]`, fases);
    if (enFases && fases.scrollWidth > fases.clientWidth) fases.scrollTo({ left: enFases.offsetLeft - 18, behavior: sinMovimiento ? 'auto' : 'smooth' });
  };
  // La sección activa es la última cuyo inicio ya pasó el 35 % de la pantalla.
  const els = secciones.map((s) => document.getElementById(s.id));
  let previa = null, pendiente = false;
  const revisar = () => {
    pendiente = false;
    const corte = innerHeight * 0.35;
    let activa = els[0];
    for (const el of els) if (el.getBoundingClientRect().top <= corte) activa = el;
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) activa = els.at(-1);
    if (activa.id !== previa) { previa = activa.id; marcar(activa.id); }
  };
  addEventListener('scroll', () => { if (!pendiente) { pendiente = true; requestAnimationFrame(revisar); } }, { passive: true });
  addEventListener('resize', revisar);
  revisar();
})();

/* aparición al entrar en pantalla, una sola vez */
const observarAparicion = (raiz = document) => {
  const grupos = $$('.escalonar, .recursos', raiz);
  grupos.forEach((g) => [...g.children].forEach((c, i) => { c.classList.add('aparece'); c.style.setProperty('--retardo', `${Math.min(i, 6) * 60}ms`); }));
  const els = $$('.aparece:not(.visto)', raiz);
  if (sinMovimiento || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('visto')); return; }
  const obs = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visto');
    obs.unobserve(e.target);
  }), { rootMargin: '0px 0px -6% 0px' });
  els.forEach((e) => obs.observe(e));
};
observarAparicion();

/* visor de imágenes (infografías) */
const visor = (() => {
  const dlg = $('#visor');
  if (!dlg) return null;
  let fotos = [], i = 0, x0 = null, t0 = 0;
  const img = $('img', dlg), titulo = $('.titulo', dlg), cont = $('.contador', dlg), bajar = $('#visor-bajar');
  const pintar = () => {
    const f = fotos[i];
    img.src = f.src; img.alt = f.alt || '';
    titulo.textContent = f.titulo || '';
    cont.textContent = fotos.length > 1 ? `${i + 1} / ${fotos.length}` : '';
    $$('.visor-pie [data-mover]', dlg).forEach((b) => (b.hidden = fotos.length < 2));
    $('.visor-pie', dlg).hidden = fotos.length < 2;
    if (f.descarga) { bajar.href = f.descarga; bajar.hidden = false; } else bajar.hidden = true;
  };
  const mover = (d) => { if (fotos.length < 2) return; i = (i + d + fotos.length) % fotos.length; pintar(); };
  $$('[data-mover]', dlg).forEach((b) => b.addEventListener('click', () => mover(Number(b.dataset.mover))));
  $('[data-cerrar]', dlg).addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.classList.contains('visor-escena')) dlg.close(); });
  dlg.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') mover(1); if (e.key === 'ArrowLeft') mover(-1); });
  const escena = $('.visor-escena', dlg);
  escena.addEventListener('pointerdown', (e) => { x0 = e.clientX; t0 = performance.now(); });
  escena.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0, v = Math.abs(dx) / (performance.now() - t0);
    if (Math.abs(dx) > 60 || (Math.abs(dx) > 20 && v > 0.11)) mover(dx < 0 ? 1 : -1);
    x0 = null;
  });
  return { abrir(lista, desde = 0) { fotos = lista; i = desde; pintar(); dlg.showModal(); } };
})();

/* biblioteca: datos/biblioteca.json */
let bibliotecaPromesa = null;
const cargarBiblioteca = () => (bibliotecaPromesa ??= fetch('datos/biblioteca.json').then((r) => r.json()).then((d) => d.recursos.sort((a, b) => b.fecha.localeCompare(a.fecha))));

const tarjetaRecurso = (r) => {
  const tipo = TIPOS[r.tipo] || r.tipo;
  const conVisor = r.imagenes?.length;
  const tapa = conVisor
    ? `<button type="button" class="recurso-tapa" data-abrir="${escapar(r.id)}" aria-label="Ver ${escapar(r.titulo)}">`
    : `<a class="recurso-tapa" href="${escapar(r.url)}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">`;
  const cierre = conVisor ? '</button>' : '</a>';
  const accion = conVisor
    ? `<button type="button" class="boton peq" data-abrir="${escapar(r.id)}">${ICONO('ojo')} Ver infografía</button>`
    : `<a class="boton peq" href="${escapar(r.url)}" target="_blank" rel="noopener">${ICONO('abrir')} Abrir guía</a>`;
  const enlaceAbs = r.url ? new URL(r.url, location.href).href : new URL(r.descargas?.[0] || r.imagenes?.[0] || '', location.href).href;
  const bajar = conVisor ? `<a class="copiar" href="${escapar(r.descargas?.[0] || r.imagenes[0])}" download>${ICONO('bajar')} Descargar</a>` : '';
  return `<article class="recurso" data-tipo="${escapar(r.tipo)}" data-bloque="${escapar(r.bloque)}">
    ${tapa}<img src="${escapar(r.miniatura)}" alt="" loading="lazy" width="540" height="675"><span class="chip">${escapar(tipo)}${r.formato ? ' · ' + escapar(r.formato) : ''}</span>${conVisor && r.imagenes.length > 1 ? `<span class="cuenta">${r.imagenes.length} láminas</span>` : ''}${cierre}
    <div class="recurso-cuerpo">
      <p class="nota"><i aria-hidden="true"></i>${escapar(BLOQUES[r.bloque] || '')} · ${fechaCorta(r.fecha)}</p>
      <h3>${escapar(r.titulo)}</h3>
      <p>${escapar(r.resumen)}</p>
      <div class="recurso-acciones">${accion}${bajar}<button type="button" class="copiar solo-icono" data-copiar="${escapar(enlaceAbs)}" data-aviso="Enlace copiado" aria-label="Copiar enlace" title="Copiar enlace">${ICONO('enlace')}</button></div>
    </div>
  </article>`;
};
const conectarVisor = (raiz, recursos) => {
  raiz.addEventListener('click', (e) => {
    const b = e.target.closest('[data-abrir]');
    if (!b) return;
    const r = recursos.find((x) => x.id === b.dataset.abrir);
    visor?.abrir(r.imagenes.map((src, k) => ({ src, alt: `${r.titulo}${r.imagenes.length > 1 ? `, lámina ${k + 1}` : ''}`, titulo: r.titulo, descarga: r.descargas?.[k] || src })));
  });
};
const pintarEn = (caja, lista, todos, vacio, animar = true) => {
  caja.innerHTML = lista.length ? lista.map(tarjetaRecurso).join('') : `<p class="vacio-lista">${escapar(vacio)}</p>`;
  if (animar) observarAparicion(caja.parentElement);
  if (!caja.dataset.conectado) { conectarVisor(caja, todos); caja.dataset.conectado = '1'; }
};
const errorCarga = (caja) => { caja.innerHTML = '<p class="vacio-lista">No se pudo cargar la biblioteca. Recarga la página.</p>'; };

// Listas fijas: lo último del inicio y las secciones de cada bloque
(() => {
  const ultimos = $('#ultimos'), cajas = $$('[data-recursos]');
  if (!ultimos && !cajas.length) return;
  cargarBiblioteca().then((rs) => {
    if (ultimos) pintarEn(ultimos, rs.slice(0, Number(ultimos.dataset.cuantos || 3)), rs, 'Muy pronto.');
    cajas.forEach((c) => pintarEn(c, rs.filter((r) => r.bloque === c.dataset.bloque && r.tipo === c.dataset.tipo), rs, c.dataset.vacio || 'Muy pronto.'));
  }).catch(() => [ultimos, ...cajas].filter(Boolean).forEach(errorCarga));
})();

// «Todo»: búsqueda y filtros por bloque y tipo (?q=, ?bloque=, ?tipo=)
(() => {
  const caja = $('#recursos');
  if (!caja) return;
  const campo = $('#buscar-recurso'), conteo = $('#conteo');
  const q0 = new URLSearchParams(location.search);
  const estado = { bloque: q0.get('bloque') || 'todo', tipo: q0.get('tipo') || 'todo', q: q0.get('q') || '' };
  campo.value = estado.q;
  cargarBiblioteca().then((rs) => {
    $$('[data-filtro]').forEach((b) => {
      const f = b.dataset.filtro, v = b.dataset.valor;
      const n = v === 'todo' ? rs.length : rs.filter((r) => r[f] === v).length;
      b.insertAdjacentHTML('beforeend', `<small>${n}</small>`);
    });
    // Filtrar se hace muchas veces seguidas: solo la primera pintada entra con animación.
    let primera = true;
    const pintar = () => {
      const terminos = normal(estado.q).split(/\s+/).filter(Boolean);
      const lista = rs.filter((r) =>
        (estado.bloque === 'todo' || r.bloque === estado.bloque) &&
        (estado.tipo === 'todo' || r.tipo === estado.tipo) &&
        terminos.every((t) => normal([r.titulo, r.resumen, TIPOS[r.tipo], BLOQUES[r.bloque], r.formato, ...(r.etiquetas || [])].join(' ')).includes(t)));
      pintarEn(caja, lista, rs, 'Nada coincide con esa búsqueda. Prueba con otra palabra o quita un filtro.', primera);
      primera = false;
      conteo.textContent = `${lista.length} ${lista.length === 1 ? 'recurso' : 'recursos'}`;
      $$('[data-filtro]').forEach((b) => b.setAttribute('aria-pressed', estado[b.dataset.filtro] === b.dataset.valor));
      const url = new URL(location.href);
      ['bloque', 'tipo', 'q'].forEach((k) => (estado[k] && estado[k] !== 'todo' ? url.searchParams.set(k, estado[k]) : url.searchParams.delete(k)));
      history.replaceState(null, '', url);
    };
    $$('[data-filtro]').forEach((b) => b.addEventListener('click', () => { estado[b.dataset.filtro] = b.dataset.valor; pintar(); }));
    campo.addEventListener('input', () => { estado.q = campo.value; pintar(); });
    pintar();
  }).catch(() => errorCarga(caja));
})();

/* buscador: ⌘K, Ctrl+K o / */
(() => {
  const dlg = $('#buscador');
  if (!dlg) return;
  const campo = $('input', dlg), lista = $('.resultados', dlg);
  let indice = null, sel = 0;
  const cargar = () => (indice ??= fetch('datos/indice.json').then((r) => r.json()).catch(() => []));
  const resaltar = (texto, terminos) => {
    let h = escapar(texto);
    terminos.forEach((t) => {
      const k = normal(texto).indexOf(t);
      if (k < 0 || !t) return;
      const trozo = escapar(texto.slice(k, k + t.length));
      h = h.replace(trozo, `<mark>${trozo}</mark>`);
    });
    return h;
  };
  const pintar = async () => {
    const datos = await cargar();
    const terminos = normal(campo.value).split(/\s+/).filter(Boolean);
    let actual;
    if (!terminos.length) actual = datos.filter((d) => d.k === 'pagina');
    else {
      actual = datos.map((d) => {
        const titulo = normal(d.t), todo = normal(`${d.t} ${d.p} ${d.x}`);
        if (!terminos.every((t) => todo.includes(t))) return null;
        const puntos = terminos.reduce((s, t) => s + (titulo.includes(t) ? 3 : 0) + (titulo.startsWith(t) ? 2 : 0), 0) + (d.k === 'recurso' ? 2 : 0);
        return { ...d, puntos };
      }).filter(Boolean).sort((a, b) => b.puntos - a.puntos).slice(0, 30);
    }
    sel = 0;
    if (!actual.length) { lista.innerHTML = `<li class="sin">Sin resultados para «${escapar(campo.value)}».</li>`; return; }
    const grupos = {};
    actual.forEach((d) => (grupos[d.p] ??= []).push(d));
    let n = 0;
    lista.innerHTML = Object.entries(grupos).map(([g, ds]) => `<li><p class="grupo">${escapar(terminos.length ? g : 'Páginas')}</p></li>` + ds.map((d) => {
      const k = n++;
      const icono = d.k === 'pagina' ? d.i || 'pagina' : d.k === 'recurso' ? (d.tipo === 'infografia' ? 'ojo' : 'libro') : 'numeral';
      return `<li><a href="${escapar(d.u)}" role="option" id="res-${k}" aria-selected="${k === 0}"${d.u.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${ICONO(icono)}<b>${resaltar(d.t, terminos)}</b><small>${escapar(d.x || d.p)}</small></a></li>`;
    }).join('')).join('');
    campo.setAttribute('aria-activedescendant', 'res-0');
  };
  const elegir = (k) => {
    const as = $$('a[role="option"]', lista);
    if (!as.length) return;
    sel = (k + as.length) % as.length;
    as.forEach((a, n) => a.setAttribute('aria-selected', n === sel));
    as[sel].scrollIntoView({ block: 'nearest' });
    campo.setAttribute('aria-activedescendant', as[sel].id);
  };
  const abrir = () => { if (dlg.open) return; dlg.showModal(); campo.select(); pintar(); };
  $$('[data-buscar]').forEach((b) => b.addEventListener('click', abrir));
  document.addEventListener('keydown', (e) => {
    const escribiendo = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); dlg.open ? dlg.close() : abrir(); }
    else if (e.key === '/' && !escribiendo && !dlg.open) { e.preventDefault(); abrir(); }
  });
  campo.addEventListener('input', pintar);
  campo.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); elegir(sel + 1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); elegir(sel - 1); }
    if (e.key === 'Enter') { const a = $$('a[role="option"]', lista)[sel]; if (a) { e.preventDefault(); dlg.close(); a.click(); } }
  });
  lista.addEventListener('click', (e) => { if (e.target.closest('a')) dlg.close(); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  if (!/Mac|iPhone|iPad/.test(navigator.platform)) $$('.tecla-mod').forEach((k) => (k.textContent = 'Ctrl K'));
})();

/* compartir la página */
$$('[data-compartir]').forEach((b) => b.addEventListener('click', async () => {
  const datos = { title: document.title, url: location.href.split('?')[0] };
  if (navigator.share) { try { await navigator.share(datos); } catch {} return; }
  try { await navigator.clipboard.writeText(datos.url); aviso('Enlace copiado'); } catch { prompt('Copia el enlace:', datos.url); }
}));
