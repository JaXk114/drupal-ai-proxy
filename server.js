import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const TOKEN = process.env.HF_TOKEN;
const MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

app.post("/chat", async (req, res) => {
  try {
    const prompt = req.body.prompt || "";
    const r = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const data = await r.text();

    // ✅ Always return valid JSON
    try {
      const parsed = JSON.parse(data);
      res.json(parsed);
    } catch {
      res.json({ output: data });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(10000, () => console.log("Proxy running on port 10000"));
