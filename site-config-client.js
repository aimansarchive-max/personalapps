(() => {
  const text = (selector, value, root = document) => {
    const node = root.querySelector(selector)
    if (node && typeof value === 'string') node.textContent = value
    return node
  }
  const setHref = (node, href) => {
    if (!node || typeof href !== 'string') return
    try {
      const url = new URL(href, location.href)
      if (['http:', 'https:', 'mailto:'].includes(url.protocol)) node.href = url.href
    } catch {}
  }
  const apply = config => {
    if (!config) return
    const { site = {}, home = {}, learning = {}, resources = {}, about = {}, seo = {} } = config
    document.querySelectorAll('.brand-type').forEach(node => { node.textContent = site.brand || 'aiman’s archive' })
    document.querySelectorAll('.brand-mark').forEach(node => { node.textContent = site.brandMark || 'a' })
    document.querySelectorAll('.footer-top > div:first-child > p').forEach(node => { node.textContent = site.tagline || '' })
    const labels = { 'index.html':site.navHome, 'learnings.html':site.navLearning, 'resources.html':site.navResources, 'about.html':site.navAbout }
    document.querySelectorAll('.navlinks a, .footer-links a').forEach(node => {
      const path = node.getAttribute('href')?.split('#')[0]?.split('/').pop()
      if (labels[path]) node.textContent = labels[path]
      if (node.classList.contains('nav-cta') || node.href.startsWith('mailto:')) {
        setHref(node, `mailto:${site.email || 'query@aimansarchive.xyz'}`)
        if (node.classList.contains('nav-cta')) node.firstChild.textContent = `${site.navContact || 'Say hello'} `
      }
    })
    document.querySelectorAll('.footer-links a').forEach(node => {
      if (/Facebook/i.test(node.textContent)) setHref(node, site.facebook)
      if (/Instagram/i.test(node.textContent)) setHref(node, site.instagram)
      if (/Email/i.test(node.textContent)) setHref(node, `mailto:${site.email || 'query@aimansarchive.xyz'}`)
    })
    document.querySelectorAll('a[href^="mailto:"]').forEach(node => setHref(node, `mailto:${site.email || 'query@aimansarchive.xyz'}`))
    const theme = document.getElementById('site-theme-overrides') || document.head.appendChild(Object.assign(document.createElement('style'), { id:'site-theme-overrides' }))
    const color = value => /^#[0-9a-f]{6}$/i.test(value || '') ? value : null
    const palette = { '--paper':color(site.paper), '--ink':color(site.ink), '--green':color(site.green), '--lime':color(site.lime) }
    theme.textContent = `:root:not([data-theme="dark"]){${Object.entries(palette).filter(([,v])=>v).map(([k,v])=>`${k}:${v}`).join(';')}}`
    const isHome = /(?:^|\/)index\.html$/.test(location.pathname) || location.pathname.endsWith('/')
    const isLearning = /learnings\.html$/.test(location.pathname)
    const isResources = /resources\.html$/.test(location.pathname)
    const isAbout = /about\.html$/.test(location.pathname)
    const intro = document.querySelector('.page-intro')
    const setIntro = (data, includeStamp) => {
      if (!intro || !data) return
      text('.eyebrow', data.kicker, intro)
      text('h1', data.title, intro)
      text(':scope > p', data.description, intro)
      if (includeStamp) text('.hero-stamp', data.stamp, intro)
    }
    if (isHome) {
      const hero = document.querySelector('.hero-copy')
      text('.eyebrow', home.kicker, hero)
      text('h1', home.title, hero)
      text(':scope > p', home.description, hero)
      const buttons = hero?.querySelectorAll('.hero-actions a') || []
      if (buttons[0]) { buttons[0].firstChild.textContent = `${home.primaryButton || 'Read the notes'} `; setHref(buttons[0], 'learnings.html') }
      if (buttons[1]) { buttons[1].textContent = home.secondaryButton || 'Meet the archivist'; setHref(buttons[1], 'about.html') }
      text('.hero-caption', home.heroCaption, hero)
      const tickers = [...document.querySelectorAll('.ticker span')]
      ;[site.ticker1, site.ticker2, site.ticker3].forEach((value,i)=>{ if (tickers[i] && value) tickers[i].textContent=value })
      const cards = [...document.querySelectorAll('.collection-card')]
      ;(home.collections || []).forEach((item,i)=>{const card=cards[i]; if(!card)return;text('h3',item.title,card);text('p',item.description,card);text('.collection-link',item.link,card)})
      text('.section-head h2', home.sectionTitle, document)
      text('.section-note', home.sectionNote, document)
      text('.quote-inner blockquote', `“${home.quote || ''}”`)
      text('.quote-byline', home.quoteByline)
      text('.contact-strip .label', home.contactLabel)
      text('.contact-strip h2', home.contactHeadline)
    }
    if (isLearning) {
      setIntro(learning, true)
      const cover = document.querySelector('.book-cover')
      if (cover) { text('h2', learning.coverTitle, cover); text('.cover-copy > p', learning.coverDescription, cover); text('.cover-author', learning.coverAuthor, cover) }
      ;(learning.chapters || []).forEach((chapter,i)=>{
        const page = document.querySelector(`.book-page[data-page="${i+2}"]`)
        if (!page) return
        text('.page-kicker', chapter.kicker, page); text('.page-words h2', chapter.title, page)
        const paragraphs = page.querySelectorAll('.page-words > p')
        if (paragraphs[0]) paragraphs[0].textContent = chapter.body1 || ''
        if (paragraphs[1]) paragraphs[1].textContent = chapter.body2 || ''
        text('.margin-note', chapter.note, page)
      })
      text('.small-cta h2', learning.afterTitle)
      text('.small-cta > p', learning.afterDescription)
    }
    if (isResources) {
      setIntro(resources)
      text('.note .label', resources.disclaimerTitle)
      const noteCopy = document.querySelector('.note-copy')
      if (noteCopy) {
        const paragraphs = noteCopy.querySelectorAll('p')
        if (paragraphs[0]) paragraphs[0].textContent = resources.disclaimer || ''
        if (paragraphs[1]) paragraphs[1].hidden = true
      }
      const grid = document.querySelector('.tool-grid')
      if (grid && Array.isArray(resources.tools)) {
        grid.replaceChildren(...resources.tools.map(tool => {
          const card=document.createElement('article'); card.className='tool-card'; card.dataset.categories=(tool.categories||'').toLowerCase()
          const top=document.createElement('div');top.className='card-top';const mark=document.createElement('span');mark.className=`tool-mark ${/^(mint|peach|lilac|sage|butter|ink|rose)$/.test(tool.color)?tool.color:'mint'}`;mark.textContent=tool.mark||'✳';mark.setAttribute('aria-hidden','true');const category=document.createElement('span');category.className='category';category.textContent=tool.category||'';top.append(mark,category)
          const heading=document.createElement('h2');heading.textContent=tool.name||'AI resource';const desc=document.createElement('p');desc.className='desc';desc.textContent=tool.description||''
          const usage=document.createElement('div');usage.className='usage';const bold=document.createElement('b');bold.textContent='Try it for';usage.append(bold,document.createTextNode(tool.tryFor||''))
          const bottom=document.createElement('div');bottom.className='card-bottom';const access=document.createElement('span');access.className='access';access.textContent=tool.access||'';const link=document.createElement('a');link.className='official';link.textContent=tool.linkText||'Official site ↗';setHref(link,tool.url);link.target='_blank';link.rel='noopener noreferrer';bottom.append(access,link);card.append(top,heading,desc,usage,bottom);return card
        }))
        document.dispatchEvent(new Event('site-tools-updated'))
      }
    }
    if (isAbout) {
      setIntro(about)
      const content=document.querySelector('.about-text')
      text('.about-text h2',about.heading,content)
      const bio=content?.querySelectorAll('p') || []
      ;[about.bio1,about.bio2,about.bio3].forEach((value,i)=>{if(bio[i]&&value)bio[i].textContent=value})
      text('.about-visual > p', about.visualCaption)
      const values=document.querySelector('.values-grid')
      if(values&&Array.isArray(about.values)) values.replaceChildren(...about.values.map((item,i)=>{const article=document.createElement('article');const eyebrow=document.createElement('span');eyebrow.textContent=item.eyebrow||`0${i+1}`;const h=document.createElement('h3');h.textContent=item.title||'';const p=document.createElement('p');p.textContent=item.description||'';article.append(eyebrow,h,p);return article}))
      text('.quote-inner blockquote', `“${about.quote || ''}”`)
      text('.quote-byline', about.quoteByline)
      text('#contact h2', about.contactHeading)
      text('#contact > div > p', about.contactDescription)
    }
    const pageKey=isHome?'home':isLearning?'learning':isResources?'resources':isAbout?'about':null
    if (pageKey && seo[pageKey]) {
      document.title=seo[pageKey].title
      const description=document.querySelector('meta[name="description"]')
      if(description)description.content=seo[pageKey].description
    }
  }
  fetch('/api/content',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(data=>data?.config&&apply(data.config)).catch(()=>{})
})()
