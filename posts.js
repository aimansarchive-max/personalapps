(() => {
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))
  const dateLabel = value => { const date = new Date(value); return Number.isNaN(date.valueOf()) ? '' : new Intl.DateTimeFormat(undefined,{year:'numeric',month:'long',day:'numeric'}).format(date) }
  const safeImage = value => { try { const url=new URL(value); return url.protocol==='https:'?url.href:'' } catch { return '' } }
  function videoEmbed(value,title) {
    try {
      const url=new URL(value); if(url.protocol!=='https:')return ''
      let id='',src=''
      if(url.hostname==='youtu.be'){id=url.pathname.slice(1).split('/')[0];src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`}
      else if(['youtube.com','www.youtube.com','m.youtube.com'].includes(url.hostname)){id=url.searchParams.get('v')||url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];src=id?`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`:''}
      else if(['vimeo.com','www.vimeo.com'].includes(url.hostname)){id=url.pathname.match(/^\/(\d+)/)?.[1];src=id?`https://player.vimeo.com/video/${encodeURIComponent(id)}`:''}
      return src?`<div class="post-video"><iframe src="${src}" title="${escape(title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`:''
    }catch{return ''}
  }
  const paragraphs = value => String(value||'').split(/\n\s*\n/).map(line=>line.trim()).filter(Boolean).map(line=>`<p>${escape(line).replace(/\n/g,'<br>')}</p>`).join('')
  async function load(){
    const list=document.querySelector('#posts-grid'), detail=document.querySelector('#post-content')
    if(!list&&!detail)return
    let posts=[]
    try{const response=await fetch('/api/posts',{cache:'no-store'});if(response.ok)posts=(await response.json()).posts||[]}catch{}
    if(list){document.querySelector('#posts-total').textContent=`${posts.length} ${posts.length===1?'note':'notes'}`;list.replaceChildren(...posts.map(post=>{const link=document.createElement('a');link.className='post-card';link.href=`post.html?slug=${encodeURIComponent(post.slug)}`;const image=safeImage(post.imageUrl);if(image){const img=document.createElement('img');img.src=image;img.alt=post.imageAlt||'';img.loading='lazy';link.append(img)}const meta=document.createElement('div');meta.className='post-card-meta';meta.textContent=[post.category,dateLabel(post.publishedAt)].filter(Boolean).join(' · ');const title=document.createElement('h2');title.textContent=post.title;const summary=document.createElement('p');summary.textContent=post.summary||'';const cta=document.createElement('span');cta.className='text-link';cta.textContent=post.videoUrl?'Read and watch ↗':'Read note ↗';link.append(meta,title,summary,cta);return link}));if(!posts.length)list.innerHTML='<p class="no-posts">No notes published yet. The archive is waiting for its first story.</p>'}
    if(detail){const slug=new URLSearchParams(location.search).get('slug');const post=posts.find(item=>item.slug===slug);if(!post){detail.innerHTML='<div class="post-not-found"><span class="label">NOTE NOT FOUND</span><h1>That page is still a blank page.</h1><a class="button" href="posts.html">Browse all posts ↗</a></div>';return}document.title=`${post.title} · Aiman’s Archive`;const meta=document.querySelector('meta[name="description"]');if(meta)meta.content=post.summary||post.title;detail.replaceChildren();const back=document.createElement('a');back.className='text-link post-back';back.href='posts.html';back.textContent='← All posts';const header=document.createElement('header');header.className='post-article-head';const kicker=document.createElement('span');kicker.className='label';kicker.textContent=[post.category,dateLabel(post.publishedAt)].filter(Boolean).join(' · ')||'FIELD NOTES';const title=document.createElement('h1');title.textContent=post.title;const summary=document.createElement('p');summary.className='post-summary';summary.textContent=post.summary||'';header.append(kicker,title,summary);detail.append(back,header);const image=safeImage(post.imageUrl);if(image){const img=document.createElement('img');img.className='post-cover-image';img.src=image;img.alt=post.imageAlt||'';img.loading='lazy';detail.append(img)}if(post.videoUrl){const video=document.createElement('div');video.innerHTML=videoEmbed(post.videoUrl,post.title);if(video.firstElementChild)detail.append(video.firstElementChild)}const body=document.createElement('article');body.className='post-body';body.innerHTML=paragraphs(post.body);detail.append(body);if(post.tags){const tags=document.createElement('p');tags.className='post-tags';tags.textContent=`Filed under: ${post.tags}`;detail.append(tags)}}
  }
  load()
})()
