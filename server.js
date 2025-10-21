import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const TOKEN = process.env.HF_TOKEN;
const MODEL = "distilgpt2"; // ✅ lightweight and always active

app.post("/chat", async (req, res) => {
  try {
    const prompt = req.body.prompt || "";
    const r = await fetch(`https://huggingface.co/api/models/${MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "drupal-ai-proxy/1.0"
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    const text = await r.text();
    console.log("Response status:", r.status);

    let output;
    try {
      const parsed = JSON.parse(text);
      output =
        parsed?.[0]?.generated_text ||
        parsed?.generated_text ||
        JSON.stringify(parsed);
    } catch {
      output = text;
    }

    res.json({ reply: output });
  } catch (err) {
    res.status(500).json({ reply: "Error: " + err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
