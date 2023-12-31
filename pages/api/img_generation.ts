import { NextApiRequest, NextApiResponse } from "next";
import { HfInference } from "@huggingface/inference";
import LRUCache from "lru-cache";

const HF_TOKEN = process.env.HF_TOKEN;

const inference = new HfInference(HF_TOKEN);

// Create a cache with a maximum size of 100 items
const cache = new LRUCache<string, string>({ max: 100 });

/**
 * Handles the API request for generating an image based on a given prompt.
 * @param req - The NextApiRequest object representing the incoming request.
 * @param res - The NextApiResponse object representing the outgoing response.
 * @returns A Promise that resolves to void.
 *
 *
 * Example usage:
 * >>>
 *
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { prompt } = req.body as {
      prompt: string;
    };

    // Check if the image is in the cache
    const cachedImage = cache.get(prompt);
    if (cachedImage) {
      res.statusCode = 200;
      res.send(cachedImage);
      return;
    }

    const img = await inference.textToImage({
      model: "stabilityai/stable-diffusion-2",
      inputs: prompt,
    });

    // Convert the Blob to a Buffer
    const buffer = Buffer.from(await img.arrayBuffer());

    // Store the image in the cache
    cache.set(prompt, buffer.toString("base64"));

    res.statusCode = 200;
    res.send(buffer.toString("base64"));
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.send({ error: "An error occurred while generating the image." });
  }
}
