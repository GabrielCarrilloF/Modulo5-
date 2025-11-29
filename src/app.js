document.addEventListener("DOMContentLoaded", function () {
  const API_URL = "https://olndh6z7eh.execute-api.us-east-1.amazonaws.com/prod";

  const shortenForm = document.getElementById("shortenForm");
  const urlInput = document.getElementById("urlInput");
  const resultContainer = document.getElementById("result");
  const shortUrlInput = document.getElementById("shortUrl");
  const copyBtn = document.getElementById("copyBtn");
  const goBtn = document.getElementById("goBtn");
  const shortUrlInputField = document.getElementById("shortUrlInput");
  const errorMsg = document.getElementById("errorMsg");

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove("hidden");
  }
  function hideError() {
    errorMsg.classList.add("hidden");
    errorMsg.textContent = "";
  }

  // POST - Generar enlace corto
  shortenForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();

    const longUrl = urlInput.value.trim();
    if (!longUrl) return showError("❌ Ingresa una URL válida");

    try {
      const res = await fetch(`${API_URL}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: longUrl }) // 👈 CAMBIO CORRECTO!
      });

      const data = await res.json();
      if (!res.ok) return showError(data.message || "⚠️ Error al acortar");

      shortUrlInput.value = `${API_URL}/${data.code}`;
      resultContainer.classList.remove("hidden");

    } catch (error) {
      showError("⚠️ Error de conexión con el servidor");
    }
  });

  // GET - Recuperar y abrir enlace
  goBtn.addEventListener("click", async () => {
    hideError();

    const shortUrl = shortUrlInputField.value.trim();
    if (!shortUrl) return showError("⚠️ Ingresa un enlace acortado");

    try {
      const urlObj = new URL(shortUrl);
      const code = urlObj.pathname.replace("/", "").trim();

      const res = await fetch(`${API_URL}/${code}`);
      const data = await res.json();

      if (!res.ok) return showError(data.message || "❌ URL no encontrada");

      window.open(data.long_url, "_blank"); // 👈 Redirige 100% real

    } catch (error) {
      showError("⚠️ Enlace inválido");
    }
  });

  copyBtn.addEventListener("click", () => {
    shortUrlInput.select();
    navigator.clipboard.writeText(shortUrlInput.value);
    copyBtn.textContent = "¡Copiado! ✔️";
    setTimeout(() => (copyBtn.textContent = "Copiar"), 1500);
  });
});
