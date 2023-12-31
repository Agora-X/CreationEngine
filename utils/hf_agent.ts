import { HfAgent, LLMFromHub, defaultTools } from "@huggingface/agents";

const HF_TOKEN = "hf_...";

const agent = new HfAgent(HF_TOKEN, LLMFromHub(HF_TOKEN), [...defaultTools]);

/**
 * Runs the hf_agent function with the given prompt.
 * @param prompt - The prompt to be passed to the agent.
 * @returns An object containing the response from the agent.
 */

async function hf_agent(prompt: string) {
  // Run the code directly
  const response = await agent.run(prompt);
  console.log(response);

  return { response };
}
