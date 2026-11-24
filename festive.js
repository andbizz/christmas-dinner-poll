/* Shared festive layer: links between the pages, light snow with a switch,
   Santa's sleigh as a small reward, and the deadline with its countdown.
   Every page works without this file; it only adds decoration. */
(function () {
  'use strict';

  var KEY = 'christmas-dinner-2027';
  var PAGES = [['./', 'Date poll'], ['santa.html', 'Secret Santa'], ['game.html', 'Gift game']];

  function media(query) {
    try { return !!(window.matchMedia && window.matchMedia(query).matches); } catch (ignore) { return false; }
  }

  function remembered(name) {
    try { return window.localStorage.getItem(KEY + ':' + name); } catch (ignore) { return null; }
  }

  function remember(name, value) {
    try { window.localStorage.setItem(KEY + ':' + name, value); } catch (ignore) {}
  }

  var calm = media('(prefers-reduced-motion: reduce)');

  /* ---------- snow ---------- */

  var snow = { on: false, canvas: null, ctx: null, flakes: [], frame: 0, last: 0, w: 0, h: 0 };
  var toggle = null;

  function flake(anywhere) {
    return {
      x: Math.random() * snow.w,
      y: anywhere ? Math.random() * snow.h : -6,
      r: 1.2 + Math.random() * 2.1,
      v: 16 + Math.random() * 28,
      drift: (Math.random() - 0.5) * 12,
      phase: Math.random() * 6.28
    };
  }

  function fitSnow() {
    if (!snow.canvas) return;
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    snow.w = window.innerWidth;
    snow.h = window.innerHeight;
    snow.canvas.width = Math.floor(snow.w * ratio);
    snow.canvas.height = Math.floor(snow.h * ratio);
    snow.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    var wanted = Math.max(16, Math.min(55, Math.round(snow.w * snow.h / 17000)));
    while (snow.flakes.length < wanted) snow.flakes.push(flake(true));
    snow.flakes.length = wanted;
  }

  function drawSnow(now) {
    if (!snow.on) return;
    var dt = snow.last ? Math.min(0.05, (now - snow.last) / 1000) : 0;
    snow.last = now;
    var ctx = snow.ctx;
    ctx.clearRect(0, 0, snow.w, snow.h);
    ctx.fillStyle = media('(prefers-color-scheme: dark)') ? 'rgba(255,255,255,0.72)' : 'rgba(104,136,163,0.5)';
    for (var i = 0; i < snow.flakes.length; i++) {
      var f = snow.flakes[i];
      f.phase += dt;
      f.y += f.v * dt;
      f.x += (f.drift + Math.sin(f.phase) * 9) * dt;
      if (f.y > snow.h + 6) snow.flakes[i] = f = flake(false);
      if (f.x < -6) f.x = snow.w + 6;
      if (f.x > snow.w + 6) f.x = -6;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, 6.2832);
      ctx.fill();
    }
    snow.frame = window.requestAnimationFrame(drawSnow);
  }

  function paintToggle() {
    if (!toggle) return;
    toggle.textContent = snow.on ? 'Snow: on' : 'Snow: off';
    toggle.setAttribute('aria-pressed', snow.on ? 'true' : 'false');
  }

  function setSnow(on, keep) {
    if (on && !snow.canvas) {
      var canvas = document.createElement('canvas');
      if (!canvas.getContext) return;
      canvas.className = 'snow';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.appendChild(canvas);
      snow.canvas = canvas;
      snow.ctx = canvas.getContext('2d');
    }
    snow.on = !!on;
    if (keep) remember('snow', snow.on ? 'on' : 'off');
    paintToggle();
    if (snow.frame) window.cancelAnimationFrame(snow.frame);
    snow.frame = 0;
    if (snow.on) {
      snow.last = 0;
      fitSnow();
      snow.frame = window.requestAnimationFrame(drawSnow);
    } else if (snow.ctx) {
      snow.ctx.clearRect(0, 0, snow.w, snow.h);
    }
  }

  /* ---------- Santa's sleigh ---------- */

  var SLEIGH =
    '<svg viewBox="0 0 320 96" xmlns="http://www.w3.org/2000/svg" focusable="false">' +
    '<defs><g id="festive-deer">' +
    '<ellipse cx="-21" cy="-3" rx="4" ry="3" fill="#8a5a2b"/>' +
    '<g stroke="#8a5a2b" stroke-width="3.4" stroke-linecap="round">' +
    '<line x1="11" y1="5" x2="21" y2="21"/><line x1="7" y1="6" x2="1" y2="23"/>' +
    '<line x1="-11" y1="5" x2="-22" y2="20"/><line x1="-7" y1="6" x2="-9" y2="23"/></g>' +
    '<ellipse cx="0" cy="0" rx="20" ry="9" fill="#8a5a2b"/>' +
    '<ellipse cx="16" cy="-8" rx="6" ry="11" transform="rotate(38 16 -8)" fill="#8a5a2b"/>' +
    '<ellipse cx="25" cy="-15" rx="8" ry="5.5" fill="#8a5a2b"/>' +
    '<circle cx="28" cy="-16" r="1.1" fill="#2b1b0c"/>' +
    '<path d="M21 -20 L17 -31 M19 -26 L13 -29 M24 -20 L25 -32 M25 -27 L30 -31" ' +
    'stroke="#5d3b18" stroke-width="2" stroke-linecap="round" fill="none"/>' +
    '</g></defs>' +
    '<g fill="#c9a227"><circle cx="14" cy="60" r="2.2"/><circle cx="5" cy="46" r="1.6"/>' +
    '<circle cx="20" cy="40" r="1.4"/></g>' +
    '<path d="M104 40 Q150 34 196 46 M104 40 Q176 24 252 42" stroke="#5d3b18" stroke-width="1.5" fill="none"/>' +
    '<use href="#festive-deer" x="206" y="52"/><use href="#festive-deer" x="262" y="46"/>' +
    '<circle cx="50" cy="34" r="15" fill="#7a4a1e"/>' +
    '<rect x="42" y="12" width="13" height="12" rx="1.5" fill="#2e7d5b"/>' +
    '<rect x="47" y="12" width="3" height="12" fill="#e3b23c"/>' +
    '<ellipse cx="80" cy="42" rx="15" ry="16" fill="#c62828"/>' +
    '<line x1="88" y1="40" x2="104" y2="40" stroke="#c62828" stroke-width="6" stroke-linecap="round"/>' +
    '<circle cx="84" cy="22" r="8.5" fill="#f2c9a0"/>' +
    '<path d="M76 24 Q84 40 93 24 Q84 30 76 24 Z" fill="#ffffff"/>' +
    '<path d="M76 18 Q84 -2 98 10 L92 18 Z" fill="#c62828"/>' +
    '<rect x="75" y="15" width="18" height="5" rx="2.5" fill="#ffffff"/>' +
    '<circle cx="98" cy="10" r="3.4" fill="#ffffff"/>' +
    '<path d="M30 54 Q26 38 44 40 L98 40 Q116 40 120 56 Q122 70 106 70 L46 70 Q32 70 30 54 Z" fill="#a3261d"/>' +
    '<path d="M36 52 L112 52" stroke="#e3b23c" stroke-width="2.5"/>' +
    '<path d="M24 82 L112 82 Q128 82 128 68" stroke="#c9a227" stroke-width="3.6" fill="none" stroke-linecap="round"/>' +
    '<path d="M50 70 L50 82 M98 70 L98 82" stroke="#c9a227" stroke-width="3"/>' +
    '</svg>';

  function sleigh() {
    if (calm || !document.body || document.querySelector('.sleigh')) return;
    var box = document.createElement('div');
    box.className = 'sleigh';
    box.setAttribute('aria-hidden', 'true');
    box.innerHTML = SLEIGH;                       // fixed drawing, no outside text
    document.body.appendChild(box);
    var remove = function () {
      if (box.parentNode) box.parentNode.removeChild(box);
    };
    box.addEventListener('animationend', function (event) {
      if (event.target === box) remove();
    });
    window.setTimeout(remove, 7000);
  }

  /* ---------- deadline and countdown ---------- */

  var deadline = { iso: '', node: null, timer: 0 };

  function lastMoment(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    if (!m) return null;
    var d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 23, 59, 59);
    return d.getMonth() === Number(m[2]) - 1 && d.getDate() === Number(m[3]) ? d : null;
  }

  function countdown(iso, now) {
    var end = lastMoment(iso);
    if (!end) return null;
    var label = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(end);
    var left = end.getTime() - now.getTime();
    if (left < 0) return { past: true, text: 'The deadline was ' + label + '.' };
    var days = Math.floor(left / 86400000);
    return {
      past: false,
      text: 'Deadline: ' + label + ' · ' +
        (days >= 2 ? days + ' days left' : days === 1 ? '1 day left' : 'today is the last day')
    };
  }

  function paintDeadline() {
    var info = countdown(deadline.iso, new Date());
    if (!info) {
      if (deadline.node) deadline.node.hidden = true;
      return;
    }
    if (!deadline.node) {
      var header = document.querySelector('header');
      if (!header) return;
      deadline.node = document.createElement('p');
      header.appendChild(deadline.node);
    }
    deadline.node.hidden = false;
    deadline.node.className = 'deadline' + (info.past ? ' past' : '');
    deadline.node.textContent = info.text;
  }

  function setDeadline(iso) {
    deadline.iso = typeof iso === 'string' ? iso : '';
    paintDeadline();
    if (!deadline.timer) deadline.timer = window.setInterval(paintDeadline, 60000);
  }

  window.Festive = { sleigh: sleigh, setDeadline: setDeadline, countdown: countdown };

  /* ---------- start: links between the pages and the snow switch ---------- */

  var main = document.querySelector('main');
  if (!main) return;

  var file = window.location.pathname.split('/').pop() || 'index.html';
  var bar = document.createElement('nav');
  bar.className = 'topbar';
  bar.setAttribute('aria-label', 'Pages');
  PAGES.forEach(function (page) {
    var link = document.createElement('a');
    link.href = page[0];
    link.textContent = page[1];
    if (page[0] === file || (page[0] === './' && file === 'index.html')) link.setAttribute('aria-current', 'page');
    bar.appendChild(link);
  });
  var spacer = document.createElement('span');
  spacer.className = 'spacer';
  bar.appendChild(spacer);
  toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'snow-toggle';
  toggle.addEventListener('click', function () { setSnow(!snow.on, true); });
  bar.appendChild(toggle);
  main.insertBefore(bar, main.firstChild);

  var oldLink = document.querySelector('p.nav');
  if (oldLink) oldLink.hidden = true;

  window.addEventListener('resize', function () { if (snow.on) fitSnow(); });

  var wish = remembered('snow');
  setSnow(wish ? wish === 'on' : !calm, false);
})();
