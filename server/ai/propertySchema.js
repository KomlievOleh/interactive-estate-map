import { z } from "zod";

export const propertyJsonSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        properties: {
            type: "array",
            minItems: 1,
            maxItems: 12,
            items: {
                type: "object",
                additionalProperties: false,
                properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    type: {
                        type: "string",
                        enum: ["House", "Apartment", "Townhouse", "Villa", "Studio"],
                    },
                    city: { type: "string" },
                    address: { type: "string" },
                    price: { type: "number" },
                    beds: { type: "number" },
                    baths: { type: "number" },
                    area: { type: "number" },
                    rating: { type: "number" },
                    featured: { type: "boolean" },
                    lat: { type: "number" },
                    lng: { type: "number" },
                    tags: {
                        type: "array",
                        items: { type: "string" },
                    },
                    image: { type: "string" },
                    description: { type: "string" },
                },
                required: [
                    "id",
                    "title",
                    "type",
                    "city",
                    "address",
                    "price",
                    "beds",
                    "baths",
                    "area",
                    "rating",
                    "featured",
                    "lat",
                    "lng",
                    "tags",
                    "image",
                    "description",
                ],
            },
        },
    },
    required: ["properties"],
};

const propertySchema = z.object({
    id: z.string(),
    title: z.string(),
    type: z.enum(["House", "Apartment", "Townhouse", "Villa", "Studio"]),
    city: z.string(),
    address: z.string(),
    price: z.number(),
    beds: z.number(),
    baths: z.number(),
    area: z.number(),
    rating: z.number(),
    featured: z.boolean(),
    lat: z.number(),
    lng: z.number(),
    tags: z.array(z.string()),
    image: z.string(),
    description: z.string(),
});

export const propertyResponseZodSchema = z.object({
    properties: z.array(propertySchema),
});