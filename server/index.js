import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
import { generateMapData } from "./ai/mapAiService.js";


const app = express();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
    res.json({
        ok: true,
        service: "store-locator-api",
    });
});

app.post("/api/map-query", async (req, res) => {
    try {
        const question = req.body?.question;

        if (!question || typeof question !== "string" || !question.trim()) {
            return res.status(400).json({
                error: "Question is required",
            });
        }

        if (question.length > 500) {
            return res.status(400).json({
                error: "Question is too long",
            });
        }

        const data = await generatePropertiesData({
            client,
            question: prompt,
        });

        res.json(data);

    } catch (error) {
        console.error("AI map query failed:", error);

        res.status(500).json({
            error: "Failed to generate map data",
        });
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});