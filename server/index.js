import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
import { generatePropertiesData } from "./ai/mapAiService.js";


const app = express();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
    res.json({
        ok: true,
        service: "generate-properties-api",
    });
});

app.post("/api/generate-properties", async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || typeof prompt !== "string") {
            return res.status(400).json({
                message: "Prompt is required",
            });
        }

        const response = await client.responses.create({
            model: "gpt-4.1-mini",
            input: `
        Generate 6 real estate properties for this request:

        "${prompt}"

        Return ONLY raw JSON array. No markdown. No explanation.

        Each item must have:
        id, title, type, city, address, price, beds, baths, area, rating,
        featured, lat, lng, tags, image, description.

        Example:
        [
            {
                "id": 1,
                "title": "Modern Family House",
                "type": "House",
                "city": "Austin",
                "address": "West Lake Hills, Austin, TX",
                "price": 685000,
                "beds": 4,
                "baths": 3,
                "area": 2450,
                "rating": 4.9,
                "featured": true,
                "lat": 30.297,
                "lng": -97.801,
                "tags": ["family", "quiet", "schools"],
                "image": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
                "description": "Spacious family home with open-plan living."
            }
        ]
        `,
        });

        const rawText = response.output_text;

        let properties;

        try {
            properties = JSON.parse(rawText);
        } catch (parseError) {
            console.error("AI returned invalid JSON:", rawText);

            return res.status(400).json({
                message: "AI returned invalid JSON",
                rawText,
            });
        }

        if (!Array.isArray(properties)) {
            return res.status(400).json({
                message: "AI response is not an array",
                rawText,
            });
        }

        res.json({ properties });
    } catch (error) {
        console.error("OpenAI error:", error);

        res.status(500).json({
            message: "Failed to generate properties",
            error: error.message,
        });
    }
});
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});