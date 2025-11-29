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

  function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove("hidden");
  }

  function hideError() {
    errorMsg.classList.add("hidden");
    errorMsg.textContent = "";
  }

  // ➤ ENVIAR URL ORIGINAL → OBTENER URL CORTA
  shortenForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();

    const longUrl = urlInput.value.trim();
    if (!longUrl) {
      showError("⚠️ Ingresa una URL válida");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: longUrl }) // 👈 tu API requiere "url"
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.message || "❌ No se pudo acortar");
        return;
      }

      // Mostrar el enlace corto que devuelve tu API ✔
      shortUrlInput.value = data.short_url;
      resultContainer.classList.remove("hidden");

    } catch (err) {
      showError("❌ Error al conectar con el servidor");
    }
  });

  // ➤ COPIAR EL LINK CORTO
  copyBtn.addEventListener("click", () => {
    shortUrlInput.select();
    navigator.clipboard.writeText(shortUrlInput.value);
    copyBtn.textContent = "¡Copiado! ✔";
    setTimeout(() => (copyBtn.textContent = "Copiar"), 1500);
  });

  // ➤ PEGAN URL CORTA → CONSULTAR EN API → ABRIR URL REAL
  goBtn.addEventListener("click", async () => {
    hideError();

    const shortUrl = shortUrlInputField.value.trim();
    if (!shortUrl) {
      showError("⚠️ Ingresa una URL acortada");
      return;
    }

    try {
      // Extraemos el código del final del enlace
      const urlObj = new URL(shortUrl);
      const code = urlObj.pathname.replace("/", "");

      const res = await fetch(`${API_URL}/${code}`);
      const data = await res.json();

      if (!res.ok) {
        showError("❌ Enlace no encontrado en el acortador");
        return;
      }

      // Abrir la URL real que devolvió la API ✔
      window.open(data.long_url, "_blank");

    } catch (err) {
      showError("⚠️ Formato de enlace incorrecto");
    }
  });

});
