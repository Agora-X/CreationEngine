import { HfInference } from '@huggingface/inference'

const hf = new HfInference('your access token')


/**
 * Converts text to audio using the specified model.
 * @param prompt The text to convert to audio.
 * @param modelName The name of the model to use for conversion. Default is "espnet/kan-bayashi_ljspeech_vits".
 * @returns The audio response.
 * @throws {Error} If there is an error during the conversion process.
 */
async function textToAudio(
    prompt: string,
    modelName: string = "espnet/kan-bayashi_ljspeech_vits",
) {
    try {
        const response = await hf.textToSpeech({
            model: modelName,
            inputs: prompt
        });
        return response;
    } catch (error: any) {
        throw new Error("Error converting text to audio: " + error.message);
    }
}