const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

// 🔥 ADD YOUR GEMINI API KEY HERE
const genAI = new GoogleGenerativeAI("AQ.Ab8RN6KsAZCGKstXPnCbsdTsPexAxHoJwkLB6g-zPZVkznVdKQ");

app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // convert image buffer → base64
    const imageBase64 = file.buffer.toString("base64");

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
    You are an agriculture AI expert.

    Analyze the plant leaf image and respond ONLY in this format:

    Disease: <name>
    Solution: <short solution>

    Keep it simple and farmer-friendly.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: file.mimetype,
          data: imageBase64
        }
      }
    ]);

    const text = result.response.text();

    // 🔥 extract disease + solution
    let disease = "Unknown";
    let solution = "No suggestion available";

    const diseaseMatch = text.match(/Disease:\s*(.*)/i);
    const solutionMatch = text.match(/Solution:\s*(.*)/i);

    if (diseaseMatch) disease = diseaseMatch[1];
    if (solutionMatch) solution = solutionMatch[1];

    res.json({ disease, solution });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini error" });
  }
});

app.listen(5000, () => {
  console.log("🚀 Gemini AI server running on http://localhost:5000");
});