(() => {
  const $ = (s, root=document) => root.querySelector(s)
  const loginView = $('#login-view'), dashboard = $('#dashboard-view'), toast = $('#toast')
  const api = async (path, options={}) => {
    const response = await fetch(`/api/crm/${path}`, { credentials: 'same-origin', ...options, headers: { 'content-type': 'application/json', ...(options.headers || {}) } })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`)
    return data
  }
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))
  function notify(message) { toast.textContent=message; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),2600) }
  function showError(target, error) { if(target) target.textContent=error.message || 'Something went wrong.' }
  async function start() {
    try { const session=await api('session'); if(session.authenticated) {loginView.hidden=true;dashboard.hidden=false;await refreshAll()} else loginView.hidden=false }
    catch(error) { loginView.hidden=false; $('#login-message').textContent=error.message.includes('not configured') ? 'CRM setup is not finished yet. Add the Cloudflare D1 binding and login secrets from the setup guide.' : error.message }
  }
  $('#login-form').addEventListener('submit', async event => {
    event.preventDefault(); const form=new FormData(event.currentTarget); const message=$('#login-message'); message.textContent='Signing in…'
    try { await api('login',{method:'POST',body:JSON.stringify({email:form.get('email'),password:form.get('password')})});loginView.hidden=true;dashboard.hidden=false;await refreshAll() }
    catch(error){showError(message,error)}
  })
  $('#logout').addEventListener('click',async()=>{try{await api('logout',{method:'POST'});dashboard.hidden=true;loginView.hidden=false;$('#login-message').textContent='You are signed out.'}catch(e){notify(e.message)}})
  document.querySelectorAll('.crm-tabs button').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.crm-tabs button').forEach(b=>b.classList.toggle('active',b===button));document.querySelectorAll('[data-view]').forEach(panel=>panel.hidden=panel.dataset.view!==button.dataset.panel)}))
  async function refreshAll(){await Promise.all([loadDashboard(),loadContacts(),loadTasks(),loadContent()])}
  async function loadDashboard(){const d=await api('dashboard');$('#stats').innerHTML=[['Contacts',d.counts.contacts],['New enquiries',d.counts.new],['Qualified',d.counts.qualified],['Open follow-ups',d.counts.tasks]].map(([label,value])=>`<div class="crm-stat"><span>${label}</span><strong>${value}</strong></div>`).join('')}
  async function loadContacts(){const query=encodeURIComponent($('#contact-search').value.trim());const d=await api(`contacts?q=${query}`);const tbody=$('#contacts-body');tbody.innerHTML=d.contacts.map(c=>`<tr><td><strong>${escapeHtml(c.name)}</strong><span>${escapeHtml(c.email)}</span><span>${escapeHtml(c.created_at)}</span></td><td>${escapeHtml(c.subject||'Website enquiry')}<div class="crm-subtle">${escapeHtml(c.message)}</div></td><td><select data-status="${c.id}" aria-label="Status for ${escapeHtml(c.name)}"><option value="new">New</option><option value="contacted">Contacted</option><option value="qualified">Qualified</option><option value="won">Won</option><option value="archived">Archived</option></select></td><td><input type="date" data-followup="${c.id}" aria-label="Follow-up date for ${escapeHtml(c.name)}" value="${escapeHtml((c.follow_up_at||'').slice(0,10))}"></td></tr>`).join('');d.contacts.forEach(c=>{const s=$(`[data-status="${c.id}"]`);if(s)s.value=c.status});$('#contacts-empty').hidden=Boolean(d.contacts.length);tbody.querySelectorAll('[data-status],[data-followup]').forEach(el=>el.addEventListener('change',async()=>{const id=el.dataset.status||el.dataset.followup;const row=el.closest('tr');const payload={status:row.querySelector('[data-status]').value,follow_up_at:row.querySelector('[data-followup]').value||null};try{await api(`contacts/${id}`,{method:'PATCH',body:JSON.stringify(payload)});notify('Contact updated.');await loadDashboard()}catch(e){notify(e.message)}}))}
  async function loadTasks(){const d=await api('tasks');const list=$('#tasks-list');list.innerHTML=d.tasks.map(t=>`<label class="task-row ${t.done?'done':''}"><input type="checkbox" data-task="${t.id}" ${t.done?'checked':''}><span>${escapeHtml(t.title)}${t.contact_name?` <small>· ${escapeHtml(t.contact_name)}</small>`:''}</span><small>${escapeHtml(t.due_at||'No due date')}</small></label>`).join('')||'<p class="crm-empty">No follow-ups yet. Future you says thanks.</p>';list.querySelectorAll('[data-task]').forEach(cb=>cb.addEventListener('change',async()=>{try{await api(`tasks/${cb.dataset.task}`,{method:'PATCH',body:JSON.stringify({done:cb.checked})});await loadTasks();await loadDashboard()}catch(e){notify(e.message)}}))}
  async function loadContent(){const d=await api('content');for(const key of ['hero_title','hero_description','home_quote']){const field=$(`[name="${key}"]`);if(field)field.value=d.content[key]||''}}
  $('#contact-search').addEventListener('input',()=>{clearTimeout(window.crmSearchTimer);window.crmSearchTimer=setTimeout(()=>loadContacts().catch(e=>notify(e.message)),200)})
  $('#task-form').addEventListener('submit',async event=>{event.preventDefault();const form=new FormData(event.currentTarget);try{await api('tasks',{method:'POST',body:JSON.stringify({title:form.get('title'),due_at:form.get('due_at')||null})});event.currentTarget.reset();notify('Follow-up added.');await loadTasks();await loadDashboard()}catch(e){notify(e.message)}})
  $('#content-form').addEventListener('submit',async event=>{event.preventDefault();const data=Object.fromEntries(new FormData(event.currentTarget));const msg=$('#content-message');msg.textContent='Saving…';try{await api('content',{method:'PUT',body:JSON.stringify(data)});msg.textContent='Saved. Your public homepage will pick up the updated copy.';notify('Website copy saved.')}catch(e){showError(msg,e)}})
  start()
})()
