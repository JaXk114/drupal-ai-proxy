import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const TOKEN = process.env.HF_TOKEN;
const MODEL = "tiiuae/falcon-7b-instruct";




app.post("/chat", async (req, res) => {
  try {
    const prompt = req.body.prompt || "";

    const r = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    const text = await r.text();
    let outputText = "";

    // Try to parse Hugging Face response safely
    try {
      const parsed = JSON.parse(text);

      if (Array.isArray(parsed) && parsed[0]?.generated_text) {
        outputText = parsed[0].generated_text;
      } else if (parsed?.generated_text) {
        outputText = parsed.generated_text;
      } else if (parsed?.[0]?.[0]?.generated_text) {
        outputText = parsed[0][0].generated_text;
      } else {
        // fallback: stringify whatever we got
        outputText = JSON.stringify(parsed);
      }
    } catch {
      // fallback: raw text
      outputText = text;
    }

    res.json({ reply: outputText });
  } catch (err) {
    res.status(500).json({ reply: "Error: " + err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
