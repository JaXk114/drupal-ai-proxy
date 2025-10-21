import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const TOKEN = process.env.HF_TOKEN;
const MODEL = "gpt2"; // public model that always works

app.post("/chat", async (req, res) => {
  try {
    const prompt = req.body.prompt || "";

const response = await fetch(`https://huggingface.co/api/inference/models/${MODEL}`, {

      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    console.log("Response status:", response.status);


    const text = await response.text();

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
