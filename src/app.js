const API_URL = "https://olndh6z7eh.execute-api.us-east-1.amazonaws.com/prod";
const FRONTEND_DOMAIN =
  "https://shorten.com";

document.getElementById("shortenForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const urlInput = document.getElementById("urlInput").value;
  const errorMsg = document.getElementById("errorMsg");
  const resultDiv = document.getElementById("result");
  const shortUrlInput = document.getElementById("shortUrl");

  errorMsg.classList.add("hidden");
  resultDiv.classList.add("hidden");

  try {
    const response = await fetch(`${API_URL}/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: urlInput }), 
    });

    
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      errorMsg.textContent = data.message || "Error al acortar URL";
      errorMsg.classList.remove("hidden");
      return;
    }

    const data = await response.json();

    
    const shortUrl = `${FRONTEND_DOMAIN}/short/${data.code}`;

    shortUrlInput.value = shortUrl;
    resultDiv.classList.remove("hidden");
  } catch (error) {
    console.error("Fetch error:", error);
    errorMsg.textContent = "Error de red. Intenta de nuevo";
    errorMsg.classList.remove("hidden");
  }
});

document.getElementById("copyBtn").addEventListener("click", () => {
  const input = document.getElementById("shortUrl");
  input.select();
  input.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("¡Copiado!");
});
