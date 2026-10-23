<!----
Aiman's Archive

A simple personal website to document:

learnings
failures and lessons
useful AI tools
personal growth notes
Project structure

index.html — main page structure
style.css — all styling and layout
script.js — dark/light theme toggle logic
How to edit sections

Open index.html and find the sections you want to change.

About section
Find this part:

<section id="about" class="section"> <div class="container"> <h2>About</h2> <p class="lead"> I’m building this archive to document... </p> </div> </section>

Replace the text inside the paragraph with your own introduction.

Learnings section
Find this block:

<section id="learnings" class="section alt"> <div class="container"> <h2>Learnings</h2> <div class="card-grid"> <article class="card"> <span class="tag">Productivity</span> <h3>Small systems beat big motivation.</h3> <p>...</p> </article> </div> </div> </section>

Edit:

the title
the tag
the paragraph text
You can keep adding more cards by copying the same article block.

Failures / lessons section
Find the timeline section:
<!-----
<section id="failures" class="section"> <div class="container"> <h2>Failures & Lessons</h2>


<div class="timeline">  <div class="item">    <div class="date">2025</div>    <div class="content">      <h3>Trying to do too much at once</h3>      <p>...</p>    </div>  </div></div>
<div class="timeline">
  <div class="item">
    <div class="date">2025</div>
    <div class="content">
      <h3>Trying to do too much at once</h3>
      <p>...</p>
    </div>
  </div>
</div> 
---->
</div> </section>

Replace the date, heading, and paragraph with your own failure story.

AI Tools section
Find:

<section id="tools" class="section alt"> <div class="container"> <h2>Useful AI Tools</h2>


<div class="tool-list">  <a href="https://chat.openai.com/" target="_blank" rel="noreferrer">    <div class="tool-card">      <h3>ChatGPT</h3>      <p>...</p>    </div>  </a></div>
<div class="tool-list">
  <a href="https://chat.openai.com/" target="_blank" rel="noreferrer">
    <div class="tool-card">
      <h3>ChatGPT</h3>
      <p>...</p>
    </div>
  </a>
</div>
<div class="tool-list">
  <a href="https://chat.openai.com/" target="_blank" rel="noreferrer">
    <div class="tool-card">
      <h3>ChatGPT</h3>
      <p>...</p>
    </div>
  </a>
</div>
</div> </section>

Change:

tool name
description
external link
How to change colors / design

Open style.css and edit the variables near the top:

:root {
--bg: #f5f1ea;
--panel: #fffdf9;
--text: #1d1b18;
--muted: #5e5a54;
--accent: #2c63e6;
}

You can change:

page background
text color
accent color
card colors
How to run the site locally

Open index.html directly in the browser, or use a simple local server.

Example with VS Code:

install Live Server extension
right-click index.html
click Open with Live Server
How to upload to GitHub

Initialize Git:
git init

Add files:
git add .

Commit:
git commit -m "Initial commit"

Create a GitHub repo and push:
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main

Notes

This project is designed to be simple and easy to edit manually with basic HTML and CSS knowledge. --->
