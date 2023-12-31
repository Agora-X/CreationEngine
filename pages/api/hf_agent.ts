import { NextApiRequest, NextApiResponse } from "next";
import { HfAgent, LLMFromHub, defaultTools } from "@huggingface/agents";

const HF_TOKEN = process.env.HF_TOKEN;

const agent = new HfAgent(HF_TOKEN, LLMFromHub(HF_TOKEN), [...defaultTools]);

/**
 * Handles the HTTP request to the HF agent API endpoint.
 *
 * @param req - The NextApiRequest object representing the incoming request.
 * @param res - The NextApiResponse object representing the outgoing response.
 * @returns A Promise that resolves to void.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { prompt } = req.body as {
      prompt: string;
    };

    // Validate the input
    if (!prompt) {
      res.statusCode = 400;
      res.send({ error: "The 'prompt' field is required." });
      return;
    }

    // Generate the code and run it
    const messages = await agent.run(prompt);

    // Check the type of the data
    if (typeof messages === "string") {
      // Send text data
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.send(messages);
    } else if (Buffer.isBuffer(messages)) {
      // Send binary data (image, video, audio)
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/octet-stream");
      res.send(messages);
    } else {
      // Send JSON data
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(messages);
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.send({ error: "An error occurred while processing the prompt" });
  }
}
