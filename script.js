let threads = JSON.parse(localStorage.getItem("threads") || "[]");
let anonCounter = 1;

function generateAnonId() {
  return "Анон #" + Math.floor(1000 + Math.random() * 9000);
}

function renderThreads() {
  const container = document.getElementById("threads");
  container.innerHTML = "";

  threads.forEach((thread, index) => {
    const threadDiv = document.createElement("div");
    threadDiv.className = "thread";
    threadDiv.innerHTML = `
      <h3>${escapeHTML(thread.title)}</h3>
      <div class="post" id="post-${thread.id}">
        <p><strong>${thread.author}</strong>:</p>
        <p>${parseQuotes(thread.content)}</p>
        ${thread.image ? `<img src="${thread.image}" width="200"/>` : ""}
        <div class="actions">
          <button onclick="quote('${thread.id}')">Цитировать</button>
        </div>
      </div>
      <div class="replies">
        ${thread.replies.map((reply, i) => `
          <div class="post" id="post-${thread.id}-${i}">
            <p><strong>${reply.author}</strong>:</p>
            <p>${parseQuotes(reply.text)}</p>
            <div class="actions">
              <button onclick="quote('${thread.id}-${i}')">Цитировать</button>
            </div>
          </div>
        `).join("")}
      </div>
      <textarea placeholder="Ответ..." onkeydown="if(event.key==='Enter'){reply(${index}, this.value); this.value=''; return false;}"></textarea>
    `;
    container.appendChild(threadDiv);
  });
}

function createThread() {
  const title = document.getElementById("thread-title").value;
  const content = document.getElementById("thread-content").value;
  const file = document.getElementById("thread-image").files[0];
  const reader = new FileReader();
  const id = Date.now(); // используем как уникальный ID

  const thread = {
    id,
    title,
    content,
    author: generateAnonId(),
    image: null,
    replies: []
  };

  reader.onload = () => {
    thread.image = reader.result;
    threads.unshift(thread);
    saveAndRender();
  };

  if (file) reader.readAsDataURL(file);
  else {
    threads.unshift(thread);
    saveAndRender();
  }
}

function reply(index, text) {
  threads[index].replies.push({
    author: generateAnonId(),
    text
  });
  saveAndRender();
}

function quote(postId) {
  const textarea = document.querySelector("textarea");
  textarea.value += `>>${postId}\n`;
  textarea.focus();
}

function parseQuotes(text) {
  return escapeHTML(text).replace(/&gt;&gt;([\d\-]+)/g, (match, id) => {
    return `<a href="#post-${id}" onclick="document.getElementById('post-${id}')?.scrollIntoView({behavior:'smooth'});">${match}</a>`;
  });
}

function escapeHTML(text) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function saveAndRender() {
  localStorage.setItem("threads", JSON.stringify(threads));
  renderThreads();
}
function changeTheme(name) {
  document.body.className = name;
  localStorage.setItem("theme", name);
}
window.onload = () => {
  const saved = localStorage.getItem("theme") || "purple";
  document.body.className = saved;
  document.getElementById("theme-select").value = saved;
  renderThreads();
};
ы

renderThreads();
