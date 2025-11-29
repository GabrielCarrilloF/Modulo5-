document.addEventListener("DOMContentLoaded", function () {
  const API_URL = "https://olndh6z7eh.execute-api.us-east-1.amazonaws.com/prod";
  const FRONTEND_DOMAIN = "https://shorter.com";

  const shortenForm = document.getElementById("shortenForm");
  const urlInput = document.getElementById("urlInput");
  const resultContainer = document.getElementById("result");
  const shortUrlInput = document.getElementById("shortUrl");
  const copyBtn = document.getElementById("copyBtn");
  const goBtn = document.getElementById("goBtn");
  const shortUrlInputField = document.getElementById("shortUrlInput");
  const errorMsg = document.getElementById("errorMsg");
  const errorText = document.createElement("span");


  errorMsg.appendChild(errorText);
  function hideError() {
    errorMsg.classList.add("hidden");
    errorText.textContent = "";
  }
  function showError(message) {
    errorText.textContent = message;
    errorMsg.classList.remove("hidden");
  }
  shortenForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();

    const longUrl = urlInput.value.trim();
    if (!longUrl) {
      showError("❌ Ingresa una URL válida");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: longUrl })
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.message || "⚠️ Error al acortar");
        return;
      }

      const finalShortUrl = `${FRONTEND_DOMAIN}/short/${data.code}`;

      shortUrlInput.value = finalShortUrl;
      resultContainer.classList.remove("hidden");

    } catch (error) {
      showError("⚠️ Error de conexión con el servidor");
    }
  });
  copyBtn.addEventListener("click", () => {
    shortUrlInput.select();
    navigator.clipboard.writeText(shortUrlInput.value);

    const originalText = copyBtn.textContent;
    copyBtn.textContent = "¡Copiado! ✔️";
    copyBtn.style.backgroundColor = "#00cc66";

    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.style.backgroundColor = "";
    }, 1500);
  });

  goBtn.addEventListener("click", () => {
    hideError();

    const shortUrl = shortUrlInputField.value.trim();
    if (!shortUrl) return showError("⚠️ Ingresa un enlace acortado");

    try {
      const urlObj = new URL(shortUrl);
      const parts = urlObj.pathname.split("/");
      const code = parts.pop() || parts.pop();

      if (!code) {
        showError("❌ Enlace acortado inválido");
        return;
      }

      window.location.href = `/short/${code}`;

    } catch (error) {
      showError("⚠️ Formato de enlace incorrecto");
    }
  });

});
