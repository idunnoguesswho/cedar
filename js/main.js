/* =========================================================
   Dale's Custom Cedar Furniture - page behaviour
   1) Quote form  2) Photo viewer  3) Footer year
   No libraries needed. Everything is plain JavaScript.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     SETTINGS - the only part that normally needs editing
     ---------------------------------------------------------
     formEndpoint:
       ''  (empty)  -> DEMO MODE. The visitor's own email app opens with the
                       message filled in; they press Send. Works with no setup,
                       but depends on the visitor having an email app set up.
       'https://formspree.io/f/xxxxxxx' -> LIVE MODE. The form sends the message
                       to Dale's inbox directly, with no email app needed.
                       (Formspree or Web3Forms; see README.md for the steps.)
     To go live, paste the endpoint address here. */
  var CONFIG = {
    formEndpoint: '',
    toEmail: 'dl.thompson@shaw.ca',
    phone: '780-984-5917'
  };

  /* =========================================================
     1) QUOTE FORM
     ========================================================= */
  var form = document.getElementById('quote-form');
  var statusEl = document.getElementById('form-status');

  /* Show a message under the button. kind is 'ok' or 'err'. textContent (not innerHTML)
     is used on purpose so nothing a visitor types can ever be run as code. */
  function setStatus(message, kind) {
    statusEl.textContent = message;
    statusEl.className = 'form-status' + (kind ? ' ' + kind : '');
  }

  /* Mark a field as wrong and add a plain-English message right after it */
  function flag(input, message) {
    input.classList.add('invalid');
    input.setAttribute('aria-invalid', 'true');
    var note = document.createElement('p');
    note.className = 'field-error';
    note.textContent = message;
    note.dataset.error = 'true';
    // For the phone/email pair the message goes under the shared hint instead
    var anchor = input.closest('.field') || input;
    anchor.appendChild(note);
  }

  /* Remove all old error marks before checking again */
  function clearFlags() {
    form.querySelectorAll('[data-error]').forEach(function (n) { n.remove(); });
    form.querySelectorAll('.invalid').forEach(function (n) {
      n.classList.remove('invalid');
      n.removeAttribute('aria-invalid');
    });
  }

  /* Check the form. Returns true if OK. The browser's built-in validation is
     turned off (novalidate) so the wording here can be friendlier. */
  function validate() {
    clearFlags();
    var ok = true;
    var name = form.elements.name, phone = form.elements.phone;
    var email = form.elements.email, details = form.elements.details;
    var firstBad = null;

    function bad(input, msg) { flag(input, msg); ok = false; if (!firstBad) firstBad = input; }

    if (!name.value.trim()) bad(name, 'Please tell Dale your name.');

    var hasPhone = phone.value.trim().length > 0;
    var hasEmail = email.value.trim().length > 0;
    if (!hasPhone && !hasEmail) {
      bad(phone, 'Please add a phone number or an email so Dale can reach you.');
    } else if (hasEmail && !email.checkValidity()) {
      bad(email, 'That email address doesn\'t look right. Please check it.');
    }

    if (!details.value.trim()) bad(details, 'Please tell Dale a little about what you\'d like.');

    if (firstBad) firstBad.focus();
    return ok;
  }

  /* Gather the answers into one plain object */
  function collect() {
    return {
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      email: form.elements.email.value.trim(),
      interest: form.elements.type.value,
      details: form.elements.details.value.trim()
    };
  }

  /* Turn the answers into a readable email body */
  function toText(d) {
    return [
      'New price request from the website',
      '',
      'Name: ' + d.name,
      'Phone: ' + (d.phone || '(not given)'),
      'Email: ' + (d.email || '(not given)'),
      'Interested in: ' + d.interest,
      '',
      d.details
    ].join('\n');
  }

  /* DEMO MODE: open the visitor's email app with everything filled in */
  function sendByMailto(d) {
    var subject = 'Price request: ' + d.interest;
    window.location.href = 'mailto:' + CONFIG.toEmail +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(toText(d));
    setStatus('Your email app should now open with your message ready. Just press Send. ' +
      'If nothing opens, please call Dale at ' + CONFIG.phone + '.', 'ok');
  }

  /* LIVE MODE: send straight to the form service */
  function sendToService(d, button) {
    button.disabled = true;
    setStatus('Sending…', '');
    var payload = {
      name: d.name, phone: d.phone, email: d.email,
      interest: d.interest, message: d.details,
      _subject: 'Price request: ' + d.interest
    };
    // Formspree uses "email" as the reply-to address; leave it out if blank so it doesn't reject
    if (!payload.email) delete payload.email;

    fetch(CONFIG.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error('Service said ' + res.status);
      form.reset();
      setStatus('Thank you! Dale has your request and will get back to you soon.', 'ok');
    }).catch(function () {
      setStatus('Sorry, that didn\'t send. Please call Dale at ' + CONFIG.phone +
        ' or email ' + CONFIG.toEmail + '.', 'err');
    }).then(function () { button.disabled = false; });
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      setStatus('', '');

      // Bot trap: a real person never fills this in. Pretend success, send nothing.
      if (form.elements.company.value) {
        setStatus('Thank you!', 'ok');
        return;
      }
      if (!validate()) {
        setStatus('Please fix the items marked above.', 'err');
        return;
      }
      var data = collect();
      var button = form.querySelector('button[type="submit"]');
      if (CONFIG.formEndpoint) sendToService(data, button);
      else sendByMailto(data);
    });
  }

  /* =========================================================
     2) PHOTO VIEWER (tap a gallery photo to see it large)
     ========================================================= */
  var viewer = document.getElementById('viewer');
  var shots = Array.prototype.slice.call(document.querySelectorAll('.shot'));
  var current = 0;

  /* Put photo number i into the viewer */
  function show(i) {
    current = (i + shots.length) % shots.length;       // wraps around at both ends
    var btn = shots[current];
    var img = document.getElementById('viewer-img');
    img.src = btn.dataset.full;
    img.alt = btn.querySelector('img').alt;
    document.getElementById('viewer-cap').textContent = btn.dataset.caption;
  }

  if (viewer && typeof viewer.showModal === 'function') {
    shots.forEach(function (btn, i) {
      btn.addEventListener('click', function () { show(i); viewer.showModal(); });
    });
    viewer.querySelector('.viewer-close').addEventListener('click', function () { viewer.close(); });
    viewer.querySelector('.viewer-prev').addEventListener('click', function () { show(current - 1); });
    viewer.querySelector('.viewer-next').addEventListener('click', function () { show(current + 1); });
    // Clicking the dark area outside the photo closes it
    viewer.addEventListener('click', function (e) { if (e.target === viewer) viewer.close(); });
    // Arrow keys move between photos (Esc to close is built in)
    viewer.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  /* =========================================================
     3) FOOTER YEAR (so the copyright never goes stale)
     ========================================================= */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
