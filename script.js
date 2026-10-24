/* Shared interactions: theme, small-screen navigation, footer year, and tool filters. */
(() => {
  const root = document.documentElement
  const themeButtons = document.querySelectorAll('.theme-toggle')

  try {
    root.dataset.theme = localStorage.getItem('aiman-theme') || 'light'
  } catch {
    root.dataset.theme = 'light'
  }

  function updateThemeButton(button, theme) {
    const dark = theme === 'dark'
    button.setAttribute('aria-pressed', String(dark))
    button.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`)
    const label = button.querySelector('span:last-child')
    const icon = button.querySelector('span:first-child')
    if (label) label.textContent = dark ? 'Light' : 'Dark'
    if (icon) icon.textContent = dark ? '☀' : '☾'
  }

  themeButtons.forEach(button => {
    updateThemeButton(button, root.dataset.theme)
    button.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem('aiman-theme', root.dataset.theme)
      } catch {
        // The theme still works when browser storage is unavailable.
      }
      themeButtons.forEach(item => updateThemeButton(item, root.dataset.theme))
    })
  })

  const menuButton = document.querySelector('.menu-toggle')
  const menu = document.querySelector('.navlinks')
  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open')
      menuButton.setAttribute('aria-expanded', String(isOpen))
      menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu')
      menuButton.textContent = isOpen ? '×' : '☰'
    })
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menu.classList.remove('open')
      menuButton.setAttribute('aria-expanded', 'false')
      menuButton.setAttribute('aria-label', 'Open menu')
      menuButton.textContent = '☰'
    }))
  }

  document.querySelectorAll('[data-year]').forEach(item => {
    item.textContent = new Date().getFullYear()
  })

  const cards = [...document.querySelectorAll('[data-tool-grid] .tool-card')]
  if (cards.length) {
    let activeFilter = 'all'
    const search = document.querySelector('[data-search]')
    const count = document.querySelector('[data-count]')
    const empty = document.querySelector('[data-empty]')
    const filterButtons = document.querySelectorAll('[data-filter]')

    function filterCards() {
      const term = (search?.value || '').trim().toLowerCase()
      let visibleCount = 0
      cards.forEach(card => {
        const categories = card.dataset.categories.split(/\s+/)
        const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter)
        const matchesSearch = !term || card.textContent.toLowerCase().includes(term)
        const visible = matchesFilter && matchesSearch
        card.hidden = !visible
        if (visible) visibleCount += 1
      })
      if (count) count.textContent = visibleCount
      if (empty) empty.hidden = visibleCount !== 0
    }

    filterButtons.forEach(button => button.addEventListener('click', () => {
      activeFilter = button.dataset.filter
      filterButtons.forEach(item => {
        const selected = item === button
        item.classList.toggle('selected', selected)
        item.setAttribute('aria-pressed', String(selected))
      })
      filterCards()
    }))
    search?.addEventListener('input', filterCards)
  }

  const book = document.querySelector('[data-book]')
  if (book) {
    const pages = [...book.querySelectorAll('[data-page]')]
    const previousButton = document.querySelector('[data-previous]')
    const nextButton = document.querySelector('[data-next]')
    const pageNumber = document.querySelector('[data-page-number]')
    const progress = document.querySelector('[data-progress]')
    const soundButton = document.querySelector('[data-sound]')
    let currentPage = 0
    let isTurning = false
    let soundOn = true
    let audioContext

    function updateBookControls() {
      if (previousButton) previousButton.disabled = currentPage === 0 || isTurning
      if (nextButton) {
        nextButton.disabled = currentPage === pages.length - 1 || isTurning
        const label = nextButton.querySelector('span')
        if (label) label.textContent = currentPage === pages.length - 1 ? 'Finished' : currentPage === pages.length - 2 ? 'Finish book' : 'Turn page'
      }
      if (pageNumber) pageNumber.textContent = String(currentPage + 1).padStart(2, '0')
      if (progress) progress.style.width = `${((currentPage + 1) / pages.length) * 100}%`
      pages.forEach((page, index) => {
        page.setAttribute('aria-hidden', String(index !== currentPage))
        page.inert = index !== currentPage && !page.classList.contains('under-flip')
      })
    }

    async function playPageTurn() {
      if (!soundOn) return
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (!AudioContextClass) return
      try {
        audioContext ||= new AudioContextClass()
        if (audioContext.state === 'suspended') await audioContext.resume()
        const duration = 0.18
        const frameCount = Math.floor(audioContext.sampleRate * duration)
        const buffer = audioContext.createBuffer(1, frameCount, audioContext.sampleRate)
        const samples = buffer.getChannelData(0)
        for (let index = 0; index < frameCount; index += 1) {
          const fade = Math.sin((index / frameCount) * Math.PI) ** 2
          samples[index] = (Math.random() * 2 - 1) * fade
        }
        const paper = audioContext.createBufferSource()
        const filter = audioContext.createBiquadFilter()
        const volume = audioContext.createGain()
        paper.buffer = buffer
        filter.type = 'lowpass'
        filter.frequency.value = 1150
        volume.gain.setValueAtTime(0.0001, audioContext.currentTime)
        volume.gain.exponentialRampToValueAtTime(0.035, audioContext.currentTime + 0.025)
        volume.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration)
        paper.connect(filter).connect(volume).connect(audioContext.destination)
        paper.start()
        paper.stop(audioContext.currentTime + duration)
      } catch {
        // Page turning still works if a browser does not support generated audio.
      }
    }

    function turnPage(direction) {
      if (isTurning) return
      const nextIndex = currentPage + direction
      if (nextIndex < 0 || nextIndex >= pages.length) return
      isTurning = true
      updateBookControls()
      const leavingPage = pages[currentPage]
      const arrivingPage = pages[nextIndex]
      arrivingPage.hidden = false
      arrivingPage.inert = true
      arrivingPage.classList.add('under-flip')
      leavingPage.classList.add(direction > 0 ? 'turning-forward' : 'turning-back')
      playPageTurn()

      window.setTimeout(() => {
        leavingPage.hidden = true
        leavingPage.classList.remove('active', 'turning-forward', 'turning-back')
        leavingPage.inert = true
        arrivingPage.inert = false
        arrivingPage.classList.remove('under-flip')
        arrivingPage.classList.add('active', direction > 0 ? 'arriving-forward' : 'arriving-back')
        currentPage = nextIndex
        updateBookControls()
        window.setTimeout(() => {
          arrivingPage.classList.remove('arriving-forward', 'arriving-back')
          isTurning = false
          updateBookControls()
        }, 350)
      }, 520)
    }

    previousButton?.addEventListener('click', () => turnPage(-1))
    nextButton?.addEventListener('click', () => turnPage(1))
    soundButton?.addEventListener('click', () => {
      soundOn = !soundOn
      soundButton.setAttribute('aria-pressed', String(soundOn))
      soundButton.innerHTML = `<span aria-hidden="true">${soundOn ? '♫' : '♪'}</span> Page sound ${soundOn ? 'on' : 'off'}`
    })

    book.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        turnPage(1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        turnPage(-1)
      }
    })

    let touchStart = null
    book.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch') {
        touchStart = { x: event.clientX, y: event.clientY }
        book.setPointerCapture(event.pointerId)
      }
    })
    book.addEventListener('pointerup', event => {
      if (!touchStart || event.pointerType !== 'touch') return
      const deltaX = event.clientX - touchStart.x
      const deltaY = event.clientY - touchStart.y
      if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) turnPage(deltaX < 0 ? 1 : -1)
      touchStart = null
    })
    book.addEventListener('pointercancel', () => { touchStart = null })
    updateBookControls()
  }

  // Optional on-site Gemma chat, backed by a same-origin Cloudflare Pages Function.
  const chat = document.querySelector('.gemma-chat')
  const launcher = document.querySelector('.gemma-launcher')
  const closeButton = document.querySelector('.gemma-close')
  const chatForm = document.querySelector('[data-gemma-form]')
  const chatInput = document.querySelector('[data-gemma-input]')
  const chatLog = document.querySelector('[data-gemma-log]')
  const sendButton = document.querySelector('[data-gemma-send]')

  if (chat && launcher && closeButton && chatForm && chatInput && chatLog && sendButton) {
    const messages = []
    const setChatOpen = open => {
      chat.hidden = !open
      launcher.setAttribute('aria-expanded', String(open))
      if (open) chatInput.focus()
      else launcher.focus()
    }
    const addMessage = (role, content) => {
      const message = document.createElement('p')
      message.className = `gemma-message ${role}`
      message.textContent = content
      chatLog.append(message)
      chatLog.scrollTop = chatLog.scrollHeight
      return message
    }

    launcher.addEventListener('click', () => setChatOpen(chat.hidden))
    closeButton.addEventListener('click', () => setChatOpen(false))
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !chat.hidden) setChatOpen(false)
    })

    chatForm.addEventListener('submit', async event => {
      event.preventDefault()
      const text = chatInput.value.trim()
      if (!text || sendButton.disabled) return

      messages.push({ role: 'user', content: text })
      addMessage('user', text)
      chatInput.value = ''
      chatInput.disabled = true
      sendButton.disabled = true
      sendButton.textContent = 'Thinking…'
      const pending = addMessage('assistant', 'Thinking…')

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: messages.slice(-8) })
        })
        const responseText = await response.text()
        let data
        try {
          data = JSON.parse(responseText)
        } catch {
          throw new Error(`The chat service returned an unexpected page (HTTP ${response.status}). Please try again shortly.`)
        }
        if (!response.ok) throw new Error(data.error || 'The chat is temporarily unavailable.')
        if (typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('Gemma did not return a response. Please try again.')
        pending.textContent = data.reply
        messages.push({ role: 'assistant', content: data.reply })
      } catch (error) {
        pending.textContent = error.message || 'The chat is temporarily unavailable. Please try again later.'
      } finally {
        chatInput.disabled = false
        sendButton.disabled = false
        sendButton.textContent = 'Send ↗'
        chatInput.focus()
        chatLog.scrollTop = chatLog.scrollHeight
      }
    })
  }
})()

