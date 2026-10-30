// Temas, explicaciones y generadores de ejercicios del Portal Victoria.
// Sin librerías: se carga en el navegador y también en node (para portal/prueba.mjs).
(function () {
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  // correcta + hasta 3 distractores distintos, revueltos
  const opciones = (ok, malas, n = 4) => {
    ok = String(ok);
    const m = shuffle([...new Set(malas.map(String))].filter((x) => x !== ok)).slice(0, n - 1);
    return shuffle([ok, ...m]);
  };

  // ---------- números con letras (0 a 1000) ----------
  const U = ['cero','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve','veinte','veintiuno','veintidós','veintitrés','veinticuatro','veinticinco','veintiséis','veintisiete','veintiocho','veintinueve'];
  const D = ['','','','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'];
  const C = ['','ciento','doscientos','trescientos','cuatrocientos','quinientos','seiscientos','setecientos','ochocientos','novecientos'];
  function letras(n) {
    if (n === 1000) return 'mil';
    if (n === 100) return 'cien';
    const c = Math.floor(n / 100), r = n % 100, s = [];
    if (c) s.push(C[c]);
    if (r || !c) {
      if (r < 30) s.push(U[r]);
      else { const d = Math.floor(r / 10), u = r % 10; s.push(D[d] + (u ? ' y ' + U[u] : '')); }
    }
    return s.join(' ');
  }

  // ---------- romanos (1 a 100) ----------
  const RV = [[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
  const partesRomano = (n) => { const p = []; for (const [v, r] of RV) while (n >= v) { p.push([r, v]); n -= v; } return p; };
  const romano = (n) => partesRomano(n).map((p) => p[0]).join('');
  const explicaRomano = (n) => {
    const p = partesRomano(n);
    return `<b>${romano(n)}</b> → ${p.map(([r]) => r).join(' + ')} → ${p.map(([r, v]) => (r.length === 2 ? `(${v})` : v)).join(' + ')} = <b>${n}</b>` +
      (p.some(([r]) => r.length === 2) ? '<br>Recuerda: si una letra chica va <i>antes</i> de una grande, se resta (IV = 5 − 1 = 4, IX = 10 − 1 = 9, XL = 50 − 10 = 40).' : '');
  };

  const ORD = ['','primero','segundo','tercero','cuarto','quinto','sexto','séptimo','octavo','noveno','décimo','undécimo (décimo primero)','duodécimo (décimo segundo)'];
  const FRAC = { 2:'medio', 3:'tercio', 4:'cuarto', 5:'quinto', 6:'sexto', 8:'octavo', 10:'décimo' };
  const fraccionLetras = (k, d) => `${k === 1 ? 'un' : letras(k)} ${FRAC[d]}${k > 1 ? 's' : ''}`;

  // ---------- dibujos ----------
  function caja(a, b, op) {
    const w = 3, fila = (x) => [...String(x).padStart(w, ' ')].map((c) => `<td>${c.trim()}</td>`).join('');
    return `<table class="col"><tr><td></td>${fila(a)}</tr><tr><td>${op}</td>${fila(b)}</tr><tr class="ln"><td></td>${'<td></td>'.repeat(w)}</tr></table>`;
  }
  function fracSVG(d, k) {
    const cols = d <= 5 ? d : d / 2, rows = d <= 5 ? 1 : 2, s = 44;
    const on = new Set(shuffle([...Array(d).keys()]).slice(0, k));
    let r = '';
    for (let i = 0; i < d; i++) r += `<rect x="${(i % cols) * s}" y="${Math.floor(i / cols) * s}" width="${s}" height="${s}" fill="${on.has(i) ? '#3b6fd4' : '#fff'}" stroke="#333" stroke-width="2"/>`;
    return `<svg class="frac" viewBox="-2 -2 ${cols * s + 4} ${rows * s + 4}" width="${cols * s + 4}" role="img" aria-label="${k} de ${d} partes pintadas">${r}</svg>`;
  }

  function pasosSuma(a, b) {
    const da = String(a).padStart(3, '0'), db = String(b).padStart(3, '0'), nom = ['Unidades', 'Decenas', 'Centenas'];
    let lleva = 0; const out = [];
    for (let i = 2, k = 0; i >= 0; i--, k++) {
      const x = +da[i], y = +db[i], s = x + y + lleva;
      let t = `<b>${nom[k]}:</b> ${x} + ${y}${lleva ? ' + 1 que llevaba' : ''} = ${s}`;
      if (s >= 10 && k < 2) { t += ` → escribo ${s % 10} y llevo 1`; lleva = 1; } else { t += ` → escribo ${s}`; lleva = 0; }
      out.push(t);
    }
    return out.join('<br>');
  }
  function pasosResta(a, b) {
    const da = [...String(a)].map(Number).reverse(), db = [...String(b).padStart(3, '0')].map(Number).reverse(), nom = ['Unidades', 'Decenas', 'Centenas'];
    let presta = 0; const out = [];
    for (let k = 0; k < 3; k++) {
      const x = da[k] - presta, y = db[k];
      let t = `<b>${nom[k]}:</b> `;
      if (presta) t += `(${da[k]} − 1 que presté = ${x}) `;
      if (x < y) { t += `a ${x} no le puedo quitar ${y}: pido prestado 1 a la izquierda → ${x + 10} − ${y} = ${x + 10 - y}`; presta = 1; }
      else { t += `${x} − ${y} = ${x - y}`; presta = 0; }
      out.push(t);
    }
    return out.join('<br>');
  }

  // ---------- bancos de palabras y oraciones ----------
  const ORACIONES = [
    ['La viuda pobre','dio una ofrenda'],['José','fue vendido como esclavo'],['Las personas','observaban lo sucedido'],
    ['La arena en la playa','estaba mojada'],['Rodrigo y André','tienen muchos amigos'],['La señora de bolso café','compró todas las bufandas'],
    ['Mi perro Cuki','salta en el jardín'],['Victoria','lee un libro de cuentos'],['Los niños del colegio','juegan pelota en el recreo'],
    ['Mamá','cocinará una deliciosa cena'],['David','venció al gigante Goliat'],['Noé','construyó un arca enorme'],
    ['El gato gris','duerme en el sofá'],['Mis abuelos','viven en Antigua Guatemala'],['La maestra','escribe en el pizarrón'],
    ['Las gallinas de la granja','pusieron muchos huevos'],['El volcán de Agua','se ve desde la ciudad'],['Lucía y su hermana','montan bicicleta'],
  ];
  const TILDES = {
    agudaCon: ['francés','ladrón','sofá','café','camión','ratón','jamás','papá','sillón','avión','también','compás'],
    agudaSin: ['cazador','barril','libertad','reloj','papel','comer','ciudad','feliz','pared','nariz'],
    graveCon: ['azúcar','tórax','hábil','árbol','lápiz','fácil','césped','débil','cárcel','móvil'],
    graveSin: ['examen','cabeza','salvavidas','casa','mesa','joven','lunes','zapato','ventana','origen'],
  };
  const SIGNOS = {
    pregunta: ['Cómo te sentirías si encontraras una moneda','Dónde está mi mochila','Cuántos años tienes','Quieres jugar conmigo','Qué hora es','Cómo te llamas'],
    exclama: ['Qué feliz se puso al encontrarla','Eres el ganador','Qué rico huele el pastel','Cuidado con el perro','Feliz cumpleaños','Qué bonito día'],
    punto: ['La mujer perdió una moneda','Buscó la moneda por todos lados','Hoy es jueves','Mi hermano come fruta'],
  };
  const AUMENT = [['mujer','mujerona'],['perro','perrazo'],['ángel','angelote'],['camisa','camisota'],['gallina','gallinota'],['zapato','zapatote'],['casa','casota'],['libro','librote'],['cabeza','cabezota'],['mano','manota'],['gato','gatote'],['lago','lagote']];
  const DIMIN = { mujer:'mujercita', perro:'perrito', 'ángel':'angelito', camisa:'camisita', gallina:'gallinita', zapato:'zapatito', casa:'casita', libro:'librito', cabeza:'cabecita', mano:'manita', gato:'gatito', lago:'laguito' };

  const sinTilde = (s) => s.normalize('NFD').replace(/́/g, '').normalize('NFC');
  const AC = { a:'á', e:'é', i:'í', o:'ó', u:'ú' };
  function variantesTilde(w) {
    const base = sinTilde(w), v = new Set([base]);
    [...base].forEach((c, i) => { if (AC[c]) v.add(base.slice(0, i) + AC[c] + base.slice(i + 1)); });
    v.delete(w);
    return [...v];
  }

  // ---------- generadores ----------
  const OPS = { suma: 'Suma ➕', resta: 'Resta ➖', mult: 'Multiplicación ✖️', div: 'División ➗' };
  function problema() {
    const t = pick(['suma', 'suma', 'resta', 'resta', 'mult', 'mult', 'div', 'div', 'div']);
    let txt, res, expr, pista;
    if (t === 'suma') {
      const a = rnd(5, 40), b = rnd(5, 30), c = rnd(2, 12), tres = Math.random() < 0.4;
      txt = pick([`Los niños compraron ${a} helados de mango y ${b} de fresa${tres ? ` y ${c} de coco` : ''}. ¿Cuántos helados compraron en total?`,
        `En la granja hay ${a} gallinas blancas y ${b} gallinas cafés${tres ? ` y ${c} negras` : ''}. ¿Cuántas gallinas hay en total?`,
        `Victoria leyó ${a} páginas el lunes y ${b} el martes${tres ? ` y ${c} el miércoles` : ''}. ¿Cuántas páginas leyó en total?`]);
      res = a + b + (tres ? c : 0); expr = `${a} + ${b}${tres ? ` + ${c}` : ''}`; pista = 'dice “en total”: juntamos todo';
    } else if (t === 'resta') {
      const a = rnd(20, 90), b = rnd(5, a - 5);
      txt = pick([`Lucía tenía ${a} stickers y regaló ${b}. ¿Cuántos stickers le quedan?`,
        `En el bus iban ${a} personas y se bajaron ${b}. ¿Cuántas personas quedan en el bus?`,
        `Una panadería hizo ${a} panes y vendió ${b}. ¿Cuántos panes le quedan?`]);
      res = a - b; expr = `${a} − ${b}`; pista = 'dice “le quedan”: se quita una parte';
    } else if (t === 'mult') {
      const a = rnd(2, 9), b = rnd(2, 9);
      txt = pick([`En un gallinero ${a} gallinas pusieron ${b} huevos cada una. ¿Cuántos huevos pusieron entre todas?`,
        `Hay ${a} cajas con ${b} crayones cada una. ¿Cuántos crayones hay en total?`,
        `Ramiro compró ${a} bolsas con ${b} canicas cada una. ¿Cuántas canicas tiene?`]);
      res = a * b; expr = `${a} × ${b}`; pista = 'cada grupo tiene lo mismo y se repite: es una suma rápida';
    } else {
      const b = rnd(2, 9), q = rnd(2, 9), a = b * q;
      txt = pick([`Fernando quiere guardar ${a} hojas en ${b} fólderes, igual en cada uno. ¿Cuántas hojas van en cada fólder?`,
        `En un zoológico quieren poner ${a} canarios en ${b} jaulas, igual en cada una. ¿Cuántos canarios van en cada jaula?`,
        `Mamá reparte ${a} galletas entre ${b} niños por igual. ¿Cuántas galletas le tocan a cada niño?`]);
      res = q; expr = `${a} ÷ ${b}`; pista = 'hay que repartir en partes iguales';
    }
    const explica = `Es <b>${OPS[t]}</b> porque ${pista}.<br>${expr} = <b>${res}</b>`;
    if (Math.random() < 0.5) return { texto: `${txt}<br><br><b>¿Qué operación tengo que hacer?</b>`, opciones: opciones(OPS[t], Object.values(OPS)), respuesta: OPS[t], explica };
    return { texto: `${txt}<br><br><b>Escribe la respuesta (el número):</b>`, respuesta: String(res), explica };
  }

  const GEN = {
    division() {
      const k = rnd(1, 3), b = rnd(2, 9), q = rnd(1, 10), a = b * q;
      if (k === 1) return { texto: `<span class="grande">${a} ÷ ${b} = ?</span>`, respuesta: String(q),
        explica: `Piensa en la tabla del ${b}: ¿${b} × cuánto da ${a}?<br>${b} × ${q} = ${a}, entonces <b>${a} ÷ ${b} = ${q}</b>` };
      if (k === 2) {
        let q = rnd(2, 9); while (q === b) q = rnd(2, 9);
        const a = b * q, partes = { dividendo: a, divisor: b, cociente: q }, nombre = pick(Object.keys(partes));
        return { texto: `<span class="grande">${a} ÷ ${b} = ${q}</span><br>¿Cómo se llama el número <b>${partes[nombre]}</b>?`,
          opciones: opciones(nombre, ['dividendo', 'divisor', 'cociente', 'residuo']), respuesta: nombre,
          explica: `${a} es el <b>dividendo</b> (lo que reparto), ${b} es el <b>divisor</b> (entre cuántos reparto) y ${q} es el <b>cociente</b> (cuánto le toca a cada uno).` };
      }
      const qq = rnd(2, 9), r = rnd(1, b - 1 || 1), aa = b * qq + (b > 1 ? r : 0), rr = aa - b * qq;
      return { texto: `Reparte <b>${aa}</b> dulces entre <b>${b}</b> niños por igual. Le tocan ${qq} a cada uno.<br>¿Cuántos dulces <b>sobran</b> (el residuo)?`, respuesta: String(rr),
        explica: `${b} × ${qq} = ${b * qq}. De ${aa} quito ${b * qq}: ${aa} − ${b * qq} = <b>${rr}</b>. Eso que sobra es el <b>residuo</b>.` };
    },
    problemas: problema,
    romanos() {
      const n = Math.random() < 0.7 ? rnd(1, 60) : rnd(61, 100), k = rnd(1, 3);
      const cerca = [n + 1, n - 1, n + 10, n - 10, n + 5, n - 5].filter((x) => x >= 1 && x <= 100);
      if (k === 1) return { texto: `¿Cuánto vale <span class="grande">${romano(n)}</span>?`, opciones: opciones(n, cerca), respuesta: String(n), explica: explicaRomano(n) };
      if (k === 2) return { texto: `¿Cómo se escribe <span class="grande">${n}</span> en números romanos?`, opciones: opciones(romano(n), [...cerca.map(romano), 'I'.repeat(n % 10 || 4) + 'X'.repeat(Math.min(3, Math.floor(n / 10)))]), respuesta: romano(n), explica: explicaRomano(n) };
      return { texto: `Escribe con letras: <span class="grande">${romano(n)}</span> = ?`, opciones: opciones(letras(n), cerca.map(letras)), respuesta: letras(n), explica: explicaRomano(n) + `<br>Con letras: <b>${letras(n)}</b>` };
    },
    ordinales() {
      const n = rnd(1, 12), malos = [n - 1, n + 1, n + 2, n - 2].filter((x) => x >= 1 && x <= 12);
      if (Math.random() < 0.6) return { texto: `Escribe con letras: <span class="grande">${n}º</span>`, opciones: opciones(ORD[n], malos.map((x) => ORD[x])), respuesta: ORD[n], explica: `${n}º se lee <b>${ORD[n]}</b>. Los ordinales dicen la <b>posición</b>: primero, segundo, tercero…` };
      return { texto: `¿Qué número es <b>${ORD[n]}</b>?`, opciones: opciones(`${n}º`, malos.map((x) => `${x}º`)), respuesta: `${n}º`, explica: `<b>${ORD[n]}</b> = ${n}º` };
    },
    equivalencias() {
      const F = [['1 docena','objetos',12],['media docena','objetos',6],['1 centímetro','milímetros',10],['1 metro','decímetros',10],['1 metro','centímetros',100],['1 libra','onzas',16],['1 hora','minutos',60],['1 minuto','segundos',60],['1 semana','días',7],['1 año','meses',12],['1 decena','unidades',10],['1 centena','unidades',100]];
      const [q, u, v] = pick(F);
      if (q.startsWith('1 ') && Math.random() < 0.35) {
        const k = rnd(2, 3), nom = q.slice(2), pl = nom.endsWith('n') ? nom + 'es' : nom + 's';
        return { texto: `<span class="grande">${k} ${pl} = ___ ${u}</span>`, respuesta: String(k * v), explica: `${q} = ${v} ${u}. Entonces ${k} ${pl} = ${Array(k).fill(v).join(' + ')} = <b>${k * v}</b>` };
      }
      return { texto: `<span class="grande">${q} = ___ ${u}</span>`, respuesta: String(v), explica: `${q} = <b>${v}</b> ${u}` };
    },
    columnas() {
      if (Math.random() < 0.5) {
        let a, b; do { a = rnd(100, 799); b = rnd(12, 199); } while (a % 10 + b % 10 < 10 || a + b > 999);
        return { texto: `Resuelve la suma:${caja(a, b, '+')}`, respuesta: String(a + b), explica: pasosSuma(a, b) + `<br>Resultado: <b>${a + b}</b>` };
      }
      let a, b; do { a = rnd(200, 999); b = rnd(12, a - 50); } while (a % 10 >= b % 10);
      return { texto: `Resuelve la resta:${caja(a, b, '−')}`, respuesta: String(a - b), explica: pasosResta(a, b) + `<br>Resultado: <b>${a - b}</b>` };
    },
    fracciones() {
      const d = pick([2, 3, 4, 5, 6, 8, 10]);
      if (Math.random() < 0.5) {
        const k = rnd(1, d - 1), malas = [`${d}/${k}`, `${k}/${d - k}`, `${Math.min(k + 1, d)}/${d}`, `${Math.max(k - 1, 1)}/${d}`];
        return { texto: `¿Qué fracción está pintada?<br>${fracSVG(d, k)}`, opciones: opciones(`${k}/${d} (${fraccionLetras(k, d)})`, malas.map((m) => { const [x, y] = m.split('/').map(Number); return FRAC[y] ? `${m} (${fraccionLetras(x, y)})` : m; })), respuesta: `${k}/${d} (${fraccionLetras(k, d)})`,
          explica: `Hay <b>${d}</b> partes en total (abajo, el denominador) y <b>${k}</b> pintadas (arriba, el numerador): <b>${k}/${d}</b> = ${fraccionLetras(k, d)}.` };
      }
      const dd = pick([4, 5, 6, 8, 10]), n = rnd(2, 3), ts = [];
      let left = dd - 1; for (let i = 0; i < n; i++) { const t = rnd(1, Math.max(1, left - (n - i - 1))); ts.push(t); left -= t; }
      const s = ts.reduce((x, y) => x + y, 0);
      return { texto: `<span class="grande">${ts.map((t) => `${t}/${dd}`).join(' + ')} = ?/${dd}</span><br>Escribe el número de arriba:`, respuesta: String(s),
        explica: `Si abajo es igual (${dd}), solo sumo los de arriba: ${ts.join(' + ')} = ${s}. Abajo queda ${dd}.<br>Resultado: <b>${s}/${dd}</b> (${fraccionLetras(s, dd)})` };
    },
    multiplicacion() {
      if (Math.random() < 0.5) {
        const V = [['La multiplicación es la suma rápida de ___ iguales.','sumandos'],['Cuando multiplicamos un número por 0, el producto es ___.','cero'],['Para encontrar el triple de un número, se multiplica por ___.','tres'],['Para encontrar el doble de un número, se multiplica por ___.','dos'],['Los números que se multiplican se llaman ___.','factores'],['Al resultado de una multiplicación se le llama ___.','producto']];
        const [t, r] = pick(V);
        return { texto: t, opciones: opciones(r, ['factores', 'producto', 'sumandos', 'diferencia', 'dos', 'cero', 'tres', 'total', 'uno']), respuesta: r,
          explica: `En <b>4 × 3 = 12</b>: 4 y 3 son los <b>factores</b>, 12 es el <b>producto</b>. 4 × 3 es la suma rápida de 4 + 4 + 4 (<b>sumandos</b> iguales). Por 0 siempre da <b>cero</b>; el doble es × <b>dos</b> y el triple, × <b>tres</b>.` };
      }
      const a = rnd(2, 9), b = rnd(2, 10), p = a * b, k = rnd(1, 3);
      if (k === 1) return { texto: `<span class="grande">${a} × ___ = ${p}</span>`, respuesta: String(b), explica: `Cuento en la tabla del ${a} hasta llegar a ${p}: ${a} × ${b} = ${p}. El factor que falta es <b>${b}</b>.` };
      if (k === 2) return { texto: `<span class="grande">___ × ${a} = ${p}</span>`, respuesta: String(b), explica: `${b} × ${a} = ${p}. El factor que falta es <b>${b}</b>.` };
      return { texto: `<span class="grande">${a} × ${b} = ___</span>`, respuesta: String(p), explica: `${a} × ${b} = <b>${p}</b>` };
    },
    letras() {
      const n = Math.random() < 0.8 ? rnd(101, 999) : pick([500, 600, 700, 800, 900, 1000, 909]);
      const ok = letras(n);
      if (Math.random() < 0.3) return { texto: `Escribe con números: <b>${ok}</b>`, respuesta: String(n), explica: `<b>${ok}</b> = ${n}` };
      const MAL = { quinientos: ['quinicientos','cincocientos'], seiscientos: ['seisientos','seiscentos'], setecientos: ['sietecientos','setesientos'], ochocientos: ['ochosientos','ochacientos'], novecientos: ['nuevecientos','novesientos'], doscientos: ['dosientos','doscentos'], trescientos: ['tresientos','trecientos'], cuatrocientos: ['cuatrosientos','cuatrocentos'], ciento: ['siento','cientos'], ochenta: ['ocheta'], setenta: ['sietenta'], noventa: ['nueventa'] };
      const malas = [];
      for (const [bien, ms] of Object.entries(MAL)) if (ok.includes(bien)) ms.forEach((m) => malas.push(ok.replace(bien, m)));
      if (malas.length < 3) malas.push(letras(n + 10 > 999 ? n - 10 : n + 10), letras(n - 1));
      return { texto: `¿Cuál está bien escrito? <span class="grande">${n}</span>`, opciones: opciones(ok, malas), respuesta: ok,
        explica: `Se escribe <b>${ok}</b>.<br>Cuidado: quinientos (no “quinicientos”), seiscientos (con <b>sc</b>), setecientos, ochocientos, novecientos.` };
    },
    sujeto() {
      const [s, p] = pick(ORACIONES), frase = `${s} ${p}.`, pal = s.split(' '), palP = p.split(' ');
      const explica = `<span class="suj">${s}</span> <span class="pred">${p}</span>.<br>Sujeto: ¿<i>quién</i> ${palP[0]}? → <b>${s}</b>. Predicado: lo que se dice del sujeto. Empieza con el verbo → <b>${p}</b>.`;
      if (Math.random() < 0.5) return { texto: `${frase}<br><br>¿Cuál es el <b>SUJETO</b>?`, opciones: opciones(s, [p, pal[pal.length - 1], palP.slice(1).join(' ') || palP[0]]), respuesta: s, explica };
      return { texto: `${frase}<br><br>¿Cuál es el <b>PREDICADO</b>?`, opciones: opciones(p, [s, palP[0], pal[pal.length - 1]]), respuesta: p, explica };
    },
    tildes() {
      const tipo = pick(Object.keys(TILDES)), w = pick(TILDES[tipo]), aguda = tipo.startsWith('aguda');
      const fin = /[nsaeiou]$/.test(sinTilde(w));
      const regla = aguda ? `Es <b>aguda</b> (suena fuerte la última sílaba). Las agudas llevan tilde si terminan en <b>n, s o vocal</b>.` : `Es <b>grave</b> (suena fuerte la penúltima sílaba). Las graves llevan tilde si <b>NO</b> terminan en n, s o vocal.`;
      return { texto: `¿Cuál está bien escrita?`, opciones: opciones(w, variantesTilde(w), 3), respuesta: w,
        explica: `${regla}<br>“${sinTilde(w)}” termina en “${sinTilde(w).slice(-1)}” → ${(aguda === fin) ? 'sí lleva tilde' : 'no lleva tilde'}: <b>${w}</b>` };
    },
    signos() {
      const tipo = pick(Object.keys(SIGNOS)), s = pick(SIGNOS[tipo]);
      const ok = tipo === 'pregunta' ? `¿${s}?` : tipo === 'exclama' ? `¡${s}!` : `${s}.`;
      return { texto: `¿Cuál está bien escrita?`, opciones: opciones(ok, [`${s}?`, `${s}!`, `¿${s}?`, `¡${s}!`, `${s}.`]), respuesta: ok,
        explica: tipo === 'punto' ? `Solo cuenta algo, no pregunta ni grita: termina con punto. <b>${ok}</b>` : `En español los signos se ponen <b>al inicio y al final</b>: ${tipo === 'pregunta' ? '¿ … ? para preguntar' : '¡ … ! para emocionarse'}.<br><b>${ok}</b>` };
    },
    aumentativos() {
      const [b, a] = pick(AUMENT), malas = [DIMIN[b], a.replace('z', 's'), a.endsWith('ote') ? a.slice(0, -3) + 'ito' : a.slice(0, -1) + 'e', b + 'sota'];
      return { texto: `¿Cuál es el <b>aumentativo</b> de <span class="grande">${b}</span>?`, opciones: opciones(a, malas), respuesta: a,
        explica: `El aumentativo hace la palabra <b>grande</b>: -ote, -ota, -azo, -ona. ${b} → <b>${a}</b>.<br>Ojo: se escribe con <b>z</b> (perrazo, mujerzota), no con s. Y -ito/-ita es diminutivo (pequeño).` };
    },
  };

  const TEMAS = [
    { id: 'division', materia: 'mate', nombre: 'La división', emoji: '🍬', urge: true, video: 'videos/division.mp4',
      aprende: `<p><b>Dividir es repartir en partes iguales.</b></p><p>🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬 12 dulces entre 3 niños → a cada uno le tocan <b>4</b>.</p><p class="grande">12 ÷ 3 = 4</p><table class="tabla"><tr><td><b>12</b></td><td>dividendo</td><td>lo que reparto</td></tr><tr><td><b>3</b></td><td>divisor</td><td>entre cuántos</td></tr><tr><td><b>4</b></td><td>cociente</td><td>cuánto le toca a cada uno</td></tr><tr><td><b>?</b></td><td>residuo</td><td>lo que sobra</td></tr></table><p><b>Truco:</b> usa la tabla de multiplicar. Para 12 ÷ 3 me pregunto: ¿3 × cuánto da 12? → 3 × 4 = 12 → la respuesta es 4.</p><p><b>Cuando sobra:</b> 14 ÷ 3 → 3 × 4 = 12, y de 14 a 12 sobran 2 → residuo 2.</p>` },
    { id: 'problemas', materia: 'mate', nombre: 'Problemas: ¿qué operación?', emoji: '🧩', urge: true, video: 'videos/problemas.mp4',
      aprende: `<p>Antes de hacer cuentas, <b>lee el problema dos veces</b> y busca las palabras pista:</p><table class="tabla"><tr><td>➕ Suma</td><td>“en total”, “juntos”, “entre todos tienen”</td></tr><tr><td>➖ Resta</td><td>“le quedan”, “regaló”, “perdió”, “se bajaron”</td></tr><tr><td>✖️ Multiplicación</td><td>“cada uno tiene ___” y se repite: 4 gallinas con 6 huevos <i>cada una</i></td></tr><tr><td>➗ División</td><td>“repartir”, “igual en cada uno”: 81 hojas en 9 fólderes</td></tr></table><p>Ejemplo: <i>Fernando quiere guardar 81 hojas en 9 fólderes.</i> Es repartir → 81 ÷ 9 = <b>9</b> hojas en cada fólder.</p><p><b>Siempre escribe:</b> operación ✍️ y respuesta con palabras: “Debe colocar 9 hojas en cada fólder”.</p>` },
    { id: 'romanos', materia: 'mate', nombre: 'Números romanos', emoji: '🏛️', urge: true, video: 'videos/romanos.mp4',
      aprende: `<table class="tabla grande-t"><tr><td>I</td><td>V</td><td>X</td><td>L</td><td>C</td></tr><tr><td>1</td><td>5</td><td>10</td><td>50</td><td>100</td></tr></table><p><b>Regla 1, se suman:</b> XVI = 10 + 5 + 1 = 16</p><p><b>Regla 2, chico antes de grande se resta:</b> IV = 4 · IX = 9 · XL = 40 · XC = 90</p><p><b>Regla 3:</b> nunca más de 3 iguales seguidas. III = 3, pero el 4 es IV.</p><p>Ejemplos del examen: <b>XXVIII</b> = 10 + 10 + 5 + 1 + 1 + 1 = <b>28</b> (veintiocho). <b>LIX</b> = 50 + 9 = <b>59</b> (cincuenta y nueve).</p>` },
    { id: 'ordinales', materia: 'mate', nombre: 'Números ordinales', emoji: '🥇', urge: true,
      aprende: `<p>Los ordinales dicen la <b>posición</b> en una fila: quién llegó primero, segundo…</p><table class="tabla"><tr><td>1º primero</td><td>2º segundo</td><td>3º tercero</td></tr><tr><td>4º cuarto</td><td>5º quinto</td><td>6º sexto</td></tr><tr><td>7º séptimo</td><td>8º octavo</td><td>9º noveno</td></tr><tr><td>10º décimo</td><td>11º undécimo (décimo primero)</td><td>12º duodécimo (décimo segundo)</td></tr></table>` },
    { id: 'equivalencias', materia: 'mate', nombre: 'Equivalencias', emoji: '📏', urge: true,
      aprende: `<table class="tabla"><tr><td>1 docena</td><td>12 objetos</td></tr><tr><td>media docena</td><td>6 objetos</td></tr><tr><td>1 centímetro</td><td>10 milímetros</td></tr><tr><td>1 metro</td><td>10 decímetros</td></tr><tr><td>1 metro</td><td>100 centímetros</td></tr><tr><td>1 libra</td><td>16 onzas</td></tr><tr><td>1 hora</td><td>60 minutos</td></tr><tr><td>1 semana</td><td>7 días</td></tr><tr><td>1 año</td><td>12 meses</td></tr></table><p>2 docenas = 12 + 12 = <b>24</b>.</p>` },
    { id: 'columnas', materia: 'mate', nombre: 'Sumas y restas llevando', emoji: '➕', urge: true,
      aprende: `<p><b>Siempre se empieza por la derecha</b> (las unidades).</p><p><b>Suma 658 + 32:</b><br>Unidades: 8 + 2 = 10 → escribo 0 y <b>llevo 1</b><br>Decenas: 5 + 3 + 1 que llevaba = 9<br>Centenas: 6 → <b>690</b></p><p><b>Resta 342 − 27:</b><br>Unidades: a 2 no le puedo quitar 7 → <b>pido prestado</b> 1 al 4: 12 − 7 = 5<br>Decenas: el 4 quedó en 3: 3 − 2 = 1<br>Centenas: 3 → <b>315</b></p>` },
    { id: 'fracciones', materia: 'mate', nombre: 'Fracciones', emoji: '🍕', urge: true,
      aprende: `<p>${'🟦🟦🟦⬜⬜⬜⬜⬜'} → <b>3/8</b> (tres octavos)</p><p><b>Arriba (numerador):</b> partes pintadas. <b>Abajo (denominador):</b> partes en total.</p><p><b>Sumar con el mismo número abajo:</b> sumo solo los de arriba y el de abajo se queda igual.<br>4/8 + 2/8 + 1/8 = <b>7/8</b></p><p>Nombres: medios, tercios, cuartos, quintos, sextos, octavos, décimos.</p>` },
    { id: 'multiplicacion', materia: 'mate', nombre: 'Palabras de la multiplicación', emoji: '✖️',
      aprende: `<p class="grande">4 × 3 = 12</p><p>4 y 3 son los <b>factores</b>. 12 es el <b>producto</b>.</p><p>Multiplicar es la suma rápida de <b>sumandos</b> iguales: 4 × 3 = 4 + 4 + 4.</p><p>Cualquier número × 0 = <b>cero</b>. El <b>doble</b> es × 2; el <b>triple</b>, × 3.</p>` },
    { id: 'letras', materia: 'mate', nombre: 'Números con letras', emoji: '✍️',
      aprende: `<table class="tabla"><tr><td>100 cien</td><td>200 doscientos</td><td>300 trescientos</td></tr><tr><td>400 cuatrocientos</td><td>500 <b>quinientos</b></td><td>600 <b>seiscientos</b></td></tr><tr><td>700 <b>setecientos</b></td><td>800 <b>ochocientos</b></td><td>900 <b>novecientos</b></td></tr></table><p>Ojo: quinientos (no “quinicientos”), seiscientos (con <b>sc</b>), ochenta (con <b>n</b>).</p><p>515 = quinientos quince · 983 = novecientos ochenta y tres</p>` },
    { id: 'sujeto', materia: 'leng', nombre: 'Sujeto y predicado', emoji: '🧑', urge: true,
      aprende: `<p>Toda oración tiene dos partes:</p><p><span class="suj">La viuda pobre</span> <span class="pred">dio una ofrenda.</span></p><p><b>Sujeto</b> (azul): de <b>quién</b> se habla. Pregunta: ¿<i>Quién</i> dio una ofrenda? → La viuda pobre. Pueden ser <b>varias palabras</b>.</p><p><b>Predicado</b> (verde): lo que se dice del sujeto. <b>Empieza con el verbo</b> (dio) y sigue hasta el final.</p><p>Otro: <span class="suj">La señora de bolso café</span> <span class="pred">compró todas las bufandas.</span></p>` },
    { id: 'tildes', materia: 'leng', nombre: 'Tildes: agudas y graves', emoji: '✏️', urge: true,
      aprende: `<p><b>Paso 1:</b> di la palabra despacio y busca la sílaba que suena <b>más fuerte</b>.</p><p><b>Aguda:</b> la fuerte es la <b>última</b> (ca-<b>fé</b>, re-<b>loj</b>). Lleva tilde si termina en <b>n, s o vocal</b> → café, ladrón, francés. Reloj no.</p><p><b>Grave:</b> la fuerte es la <b>penúltima</b> (<b>ár</b>-bol, <b>ca</b>-sa). Lleva tilde si <b>NO</b> termina en n, s o vocal → árbol, azúcar, tórax. Examen y cabeza no.</p>` },
    { id: 'signos', materia: 'leng', nombre: 'Signos ¿? ¡!', emoji: '❓', urge: true,
      aprende: `<p>En español los signos van <b>al inicio y al final</b>:</p><p class="grande">¿Cómo te llamas?</p><p class="grande">¡Eres el ganador!</p><p>Si solo cuento algo, termina con punto: <i>La mujer perdió una moneda.</i></p>` },
    { id: 'aumentativos', materia: 'leng', nombre: 'Aumentativos', emoji: '🐘',
      aprende: `<p>El aumentativo hace la palabra <b>grande</b>: <b>-ote, -ota, -azo, -ona</b>.</p><p>perro → perr<b>azo</b> · camisa → camis<b>ota</b> · ángel → angel<b>ote</b> · mujer → mujer<b>ona</b></p><p>Se escribe con <b>z</b>, no con s: perrazo, mujerzota.</p><p>-ito / -ita es lo contrario: <b>diminutivo</b> (pequeño).</p>` },
  ];
  TEMAS.forEach((t) => { t.gen = GEN[t.id]; });

  const L = { TEMAS, letras, romano, opciones };
  if (typeof module !== 'undefined') module.exports = L; else window.L = L;
})();
