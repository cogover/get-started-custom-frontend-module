import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Missing #app element");

// This template is static. Use textContent, not innerHTML, for untrusted data.
app.innerHTML = `
  <main class="card">
    <p class="eyebrow">Cogover Custom Module</p>
    <h1>Hello from your first frontend module</h1>
    <p>This page was built with TypeScript and deployed on Cogover.</p>
  </main>
`;
