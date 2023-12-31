import { HfInference } from "@huggingface/inference";

const HF_TOKEN = "hf_...";

const inference = new HfInference(HF_TOKEN);

/**
 * Performs image-to-text conversion using the specified image URL and model name.
 * @param imageUrl The URL of the image to convert to text.
 * @param modelName The name of the model to use for image captioning. Defaults to "nlpconnect/vit-gpt2-image-captioning".
 * @returns A promise that resolves to the result of the image-to-text conversion.
 */
async function performImageToText(
  imageUrl: string,
  modelName: string = "nlpconnect/vit-gpt2-image-captioning",
) {
  const imageToTextResult = await inference.imageToText({
    data: await (await fetch(imageUrl)).blob(),
    model: modelName,
  });

  return imageToTextResult;
}
