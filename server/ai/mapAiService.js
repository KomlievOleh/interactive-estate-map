import {
    propertyJsonSchema,
    propertyResponseZodSchema,
} from "./propertySchema.js";
import { getCachedValue, setCachedValue } from "./cache.js";

const MODELS = ["gpt-4o-mini", "gpt-4o"];

const MAX_RETRIES_PER_MODEL = 2;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeQuestion(question) {
    return question.trim().toLowerCase().replace(/\s+/g, " ");
}

function getSystemPrompt() {
    return `
        You convert user real estate requests into JSON for a React + Leaflet real estate app.

        Return only JSON matching the schema.

        Rules:
        - Generate realistic real estate properties for the user request.
        - Return properties in the exact format required by the app.
        - Every property must have valid lat and lng coordinates.
        - Coordinates must match the city/address area realistically.
        - Property type must be one of: House, Apartment, Townhouse, Villa, Studio.
        - Price must be a realistic number in USD.
        - beds, baths, area must be realistic numbers.
        - rating must be from 1 to 5.
        - featured must be boolean.
        - tags must be lowercase strings in snake_case or simple lowercase words.
        - image must be a usable image URL.
        - Use Unsplash image URLs when possible.
        - IDs must be stable lowercase strings or numbers depending on the schema.
        - Descriptions should be concise and sales-oriented.
        - Do not include markdown.
        - Do not include explanations.
        `;
}

async function callOpenAIWithModel(client, model, question) {
    const response = await client.responses.create({
        model,
        input: [
            {
                role: "system",
                content: getSystemPrompt(),
            },
            {
                role: "user",
                content: question,
            },
        ],
        text: {
            format: {
                type: "json_schema",
                name: "real_estate_properties_response",
                strict: true,
                schema: propertyJsonSchema,
            },
        },
        store: false,
    });

    const jsonText = response.output_text;
    const parsed = JSON.parse(jsonText);

    return propertyResponseZodSchema.parse(parsed);
}

function sanitizeProperty(property, index) {
    const safeType = ["House", "Apartment", "Townhouse", "Villa", "Studio"].includes(
        property.type
    )
        ? property.type
        : "House";

    const safeTags = Array.isArray(property.tags)
        ? [
            ...new Set(
                property.tags
                    .map((tag) =>
                        String(tag)
                            .trim()
                            .toLowerCase()
                            .replace(/\s+/g, "_")
                    )
                    .filter(Boolean)
            ),
        ]
        : [];

    return {
        id: property.id || `property_${index + 1}`,
        title: String(property.title || "Untitled Property").trim(),
        type: safeType,
        city: String(property.city || "").trim(),
        address: String(property.address || "").trim(),
        price: Math.max(0, Number(property.price) || 0),
        beds: Math.max(0, Number(property.beds) || 0),
        baths: Math.max(0, Number(property.baths) || 0),
        area: Math.max(0, Number(property.area) || 0),
        rating: Math.max(1, Math.min(5, Number(property.rating) || 4.5)),
        featured: Boolean(property.featured),
        lat: Math.max(-90, Math.min(90, Number(property.lat) || 0)),
        lng: Math.max(-180, Math.min(180, Number(property.lng) || 0)),
        tags: safeTags,
        image:
            String(property.image || "").trim() ||
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
        description: String(property.description || "").trim(),
    };
}

function sanitizeResult(data) {
    const properties = Array.isArray(data.properties)
        ? data.properties.map(sanitizeProperty)
        : [];

    return {
        ...data,
        properties,
    };
}

export async function generatePropertiesData({ client, question }) {
    const normalizedQuestion = normalizeQuestion(question);
    const cacheKey = `properties-query:${normalizedQuestion}`;

    const cached = getCachedValue(cacheKey);
    if (cached) return cached;

    let lastError = null;

    for (const model of MODELS) {
        for (let attempt = 1; attempt <= MAX_RETRIES_PER_MODEL; attempt++) {
            try {
                const data = await callOpenAIWithModel(client, model, question);
                const sanitized = sanitizeResult(data);

                setCachedValue(cacheKey, sanitized);
                return sanitized;
            } catch (error) {
                lastError = error;

                const delay = 300 * attempt;
                await sleep(delay);
            }
        }
    }

    throw lastError;
}