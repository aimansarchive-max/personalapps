export const SITE_DEFAULTS = {
  site: {
    brand: 'aiman’s archive', brandMark: 'a', tagline: 'Notes from figuring it out. Filed under: ongoing.', email: 'query@aimansarchive.xyz',
    navHome:'Home', navLearning:'Learnings', navResources:'Resources', navAbout:'About', navContact:'Say hello',
    ticker1:'LEARNING IN PUBLIC',ticker2:'TOOLS WITH CAVEATS',ticker3:'PHILOSOPHY, LIGHTLY ROASTED',
    facebook: 'https://www.facebook.com/1aimanhusen', instagram: 'https://www.instagram.com/1aimanhusen',
    paper: '#f5f3ec', ink: '#20231f', green: '#315947', lime: '#d8f36c'
  },
  home: {
    kicker: 'A personal archive of figuring it out', title: 'I learned a thing.\nThen forgot it.\nSo I wrote it down.',
    description: 'Lessons learned, tools tested, and philosophical conclusions reached with absolutely insufficient evidence. Browse freely. The confidence is part of the joke.',
    quote: 'You don’t need a five-year plan. A Tuesday plan would already be pretty impressive.', quoteByline: '— notes from the ongoing experiment',
    sectionTitle:'Make the confusion somewhat useful.', sectionNote:'A field guide to the experiment of being a person with Wi-Fi.', contactLabel:'Have a thought, tool, or correction?', contactHeadline:'Send it into the archive.',
    primaryButton:'Read the notes',secondaryButton:'Meet the archivist',heroCaption:'Currently collecting useful mistakes',
    collections: [
      { title: 'Things I’ve learned', description: 'Small systems, unfinished thoughts, and lessons I learned the hard way.', link: 'Read the log ↗' },
      { title: 'Tools I’ve tried', description: 'A practical guide to AI helpers, their uses, and their many limitations.', link: 'Open the toolbox ↗' },
      { title: 'Philosophy, lightly roasted', description: 'Loose thoughts about life. No credentials, several opinions.', link: 'Meet Aiman ↗' }
    ]
  },
  learning: {
    kicker: 'A tiny field guide / made by Aiman', title: 'How I built\nthis website.', coverTitle:'How I built\nthis website', coverDescription:'A small story about ideas, pixels, code, and learning in public.', coverAuthor:'AIMAN HUSEN · 2026',
    description: 'Eight pages about turning a vague idea into Aiman’s Archive—with plain HTML, CSS, a little JavaScript, and an unreasonable number of browser tabs.',
    stamp: 'TURN A PAGE. LEARN A THING.',
    afterTitle:'What I learned building a responsive website',afterDescription:'This interactive guide covers planning a personal website, structuring pages with semantic HTML, styling responsive layouts with CSS, adding book and navigation interactions with JavaScript, and preparing pages for search engines. It also explains the small set of files behind Aiman Archive.',
    chapters: [
      { kicker:'01 / THE SPARK', title:'Start with a\nreason to care.', body1:'I wanted a place to keep the things I learn: useful notes, honest experiments, AI tools, and the occasional life theory that sounds convincing after midnight.', body2:'The brief was simple: make it personal, make it useful, and make it sound like a human wrote it. Preferably this human.', note:'A grand strategy? No. A notebook with a URL? Exactly.' },
      { kicker:'02 / THE FOUNDATION', title:'Four pages.\nZero framework.', body1:'Each page is a regular HTML file. Shared navigation and footer make the site feel connected; plain links keep every page easy to open, edit, and understand.', body2:'No component library hiding behind the curtain. It’s all readable source files—like a recipe card, except the recipe has a footer.', note:'The files are the architecture. Fancy diagram optional.' },
      { kicker:'03 / THE SKELETON', title:'HTML gives\nideas a shape.', body1:'Semantic elements make the page legible to people and browsers: a header, navigation, main content, sections, links, and a footer.', body2:'Then the content goes in. A headline, the archive’s notes, the tool cards. The most advanced part was deciding what to say. Naturally.', note:'Readable markup is a gift to future-you. Accept it.' },
      { kicker:'04 / THE PERSONALITY', title:'CSS makes it\nfeel like mine.', body1:'A little color palette, a few type styles, roomy spacing, and some abstract illustrations give the archive its own character. Soft paper colors meet forest green and a small hit of lime.', body2:'Responsive rules rearrange the layout for smaller screens. The design should be comfortable on a phone, not a desktop squeezed into a phone costume.', note:'Good spacing: invisible. Bad spacing: somehow the whole meeting.' },
      { kicker:'05 / A LITTLE INTERACTION', title:'JavaScript does\na few small jobs.', body1:'Vanilla JavaScript powers the mobile menu, remembers the light or dark theme, updates the year, and filters the tool directory.', body2:'And here, it turns the pages of this little book. Nothing needs a giant framework to open a menu. The menu is not running a space program.', note:'Use just enough code to make the useful thing happen.' },
      { kicker:'06 / TEST, THEN SHARE', title:'Check the small\nscreens too.', body1:'I preview each page, follow every link, try the menu and theme switch, and check the layout at phone widths. The goal: no sideways scrolling and no mysterious disappearing buttons.', body2:'When the files are ready, a static host like Cloudflare Pages can publish them. Push an edit, let the host serve the updated site. Internet: a series of folders with excellent marketing.', note:'Preview. Notice. Adjust. Repeat until it feels right.' },
      { kicker:'07 / THE LAST PAGE (FOR NOW)', title:'Turns out, you\ncan just make it.', body1:'The big lesson: a website is not a mysterious object bestowed upon the chosen. It’s a set of files, some thoughtful choices, and a willingness to fix the bits that look odd.', body2:'Start small. Keep the code understandable. Make it yours. And maybe close a few tabs before starting another project.', note:'End of this chapter. Next chapter: editing it.' }
    ]
  },
  resources: {
    kicker:'A slightly opinionated directory', title:'Useful tools.\nNo magic tricks.',
    description:'A field guide to apps that can help you learn, research, make, code, and create presentation slides. Each entry includes a practical idea and a link to its official home.',
    disclaimerTitle:'Useful assistant. Not an oracle.',
    disclaimer:'These are suggested ways to try each tool, not promises that every feature is available on every plan or in every country. Software enjoys character development. Check each official site for current features, pricing, and privacy controls. Treat generated answers as a starting point, especially when the stakes are higher than choosing a font.',
    tools: [
      { name:'ChatGPT', mark:'◎', color:'mint', category:'General assistant', categories:'learn create', description:'A flexible assistant for questions, explanations, drafts, brainstorming, coding, and working with files or images.', tryFor:'Turn a confusing topic into a short lesson, then ask for a quiz and explain what you got wrong.', access:'Free access; features and limits vary', url:'https://chatgpt.com/', linkText:'Official site ↗' },
      { name:'Claude', mark:'✳', color:'peach', category:'Writing & analysis', categories:'learn create code', description:'An AI assistant for writing, analysis, coding, and working through long or complex material.', tryFor:'Give it a document and ask for the argument, the assumptions, and the parts that need a fact-check.', access:'Free and paid plans; limits vary', url:'https://claude.ai/', linkText:'Official site ↗' },
      { name:'Perplexity', mark:'⌕', color:'lilac', category:'Web research', categories:'research learn', description:'A web-focused answer and research tool with sources you can follow up on.', tryFor:'Get a quick landscape of a topic, open the citations, and read original sources before repeating anything.', access:'Free core use; paid options available', url:'https://www.perplexity.ai/', linkText:'Official site ↗' },
      { name:'NotebookLM', mark:'▤', color:'sage', category:'Source-based study', categories:'research learn', description:'A research and study assistant that works from documents, notes, and links you provide.', tryFor:'Add your own reading list, then ask questions that need answers grounded in those materials.', access:'Availability and limits may vary', url:'https://notebooklm.google.com/', linkText:'Official site ↗' },
      { name:'Google Gemini', mark:'✦', color:'butter', category:'Google AI assistant', categories:'learn create research', description:'Google’s assistant for writing, learning, planning, research, and supported Google experiences.', tryFor:'Ask it to explain a concept in different ways or organize ideas already living in your Google workflow.', access:'Free and paid options; features vary', url:'https://gemini.google.com/', linkText:'Official site ↗' },
      { name:'Gamma', mark:'Γ', color:'peach', category:'AI presentations', categories:'create', description:'Turn a prompt, outline, or notes into a designed presentation, then edit it and export it for PowerPoint.', tryFor:'Paste a topic and audience, ask for a concise 8–10 slide deck, then fact-check the claims and polish the slides.', access:'Free plan: up to 10 slides per prompt; exports include Gamma branding', url:'https://gamma.app/', linkText:'Create slides ↗' },
      { name:'Duck.ai', mark:'D', color:'mint', category:'Private AI chat', categories:'learn research', description:'Chat with several third-party AI models through DuckDuckGo’s privacy-focused chat service.', tryFor:'Ask two models to explain the same idea in plain language, then compare their answers and check important claims.', access:'Free access; available models and limits vary', url:'https://duck.ai/', linkText:'Open Duck.ai ↗' },
      { name:'GitHub Copilot', mark:'</>', color:'ink', category:'Coding assistant', categories:'code', description:'Coding help in GitHub and supported development environments, from suggestions to chat and agent workflows.', tryFor:'Ask for an explanation of unfamiliar code or a first draft of a small function; review and run every change.', access:'Free and paid plans; features vary', url:'https://github.com/features/copilot', linkText:'Official site ↗' },
      { name:'Midjourney', mark:'✺', color:'rose', category:'Image generation', categories:'create', description:'A tool for generating and iterating on images from text prompts, useful for visual exploration.', tryFor:'Explore a visual direction with a few prompt variations, then refine the composition deliberately.', access:'Paid plans; check current options', url:'https://www.midjourney.com/', linkText:'Official site ↗' },
      { name:'Your own judgment', mark:'🧠', color:'butter', category:'The human part', categories:'learn research', description:'Not technically an AI product. Still the most important tool in this directory, annoyingly enough.', tryFor:'Check important claims against trustworthy sources. Understand data settings before sharing sensitive information.', access:'Works offline. Mostly.', url:'https://www.nist.gov/itl/ai-risk-management-framework', linkText:'AI risk guide ↗' }
    ]
  },
  about: {
    kicker:'A human, not a productivity framework', title:'Hello, I’m Aiman.\nStill learning.',
    description:'This archive is a home for useful discoveries, interesting tools, mistakes with a lesson hiding inside, and thoughts that refuse to stay in my head.',
    visualCaption:'CURIOUS BY NATURE · CONFUSED WITH CONFIDENCE',
    heading:'I take notes so the lessons have somewhere to live.',
    bio1:'I’m Aiman, and I made this site to collect what I’m learning about creativity, technology, and trying to do things with a little more intention. It’s part notebook, part toolbox, and part evidence that I opened another tab to look something up.',
    bio2:'I like tools that make hard things easier, ideas that survive a second look, and plans that leave room to change. I’m not an expert at being alive. I’m just keeping unusually detailed notes.',
    bio3:'Expect practical experiments, honest caveats, and philosophy served with more sarcasm than certainty.',
    values:[
      { eyebrow:'01 / STAY CURIOUS', title:'Ask a better question.', description:'There is usually more to learn just past the first answer.' },
      { eyebrow:'02 / MAKE A DRAFT', title:'Messy counts as progress.', description:'Done is a place you can improve from. Perfect is mostly a screensaver.' },
      { eyebrow:'03 / KEEP YOUR JUDGMENT', title:'Tools are still tools.', description:'Helpful, impressive, sometimes wrong. Use your brain; it came with the account.' }
    ],
    quote:'You can’t be everything before your time.', quoteByline:'— Aiman’s paraphrase of Billy Joel’s “Vienna”',
    contactHeading:'Say hello. I actually read these.',contactDescription:'Share a correction, useful resource, or thought that arrived while you were avoiding something else.'
  },
  seo: {
    home:{title:'Aiman Archive: Personal Learning Notes, AI Tools and Ideas',description:'Explore a personal archive of learning notes, practical AI tool guides, creative experiments, and honest reflections on figuring things out.'},
    learning:{title:'How I Built This Website: HTML, CSS and JavaScript',description:'Read an illustrated, interactive eight-page guide to building Aiman Archive with responsive HTML, CSS, and vanilla JavaScript.'},
    resources:{title:'AI Tools Directory: Practical Uses and Official Links',description:'Explore AI tools for writing, research, learning, image creation, coding, and presentation slides. See practical use ideas and official links.'},
    about:{title:'About Aiman: A Personal Archive of Learning',description:'Meet Aiman and explore ideas behind this personal archive of practical learning, creative experiments, AI tools, and lightly roasted philosophy.'}
  }
}
