/**
 * Converts a Blob into an image URL.
 *
 * @param blob - The Blob to convert.
 * @returns The URL representing the Blob object.
 * 
 * const imgUrl = blobToImgUrl(blob);
    const imgElement = document.createElement('img');
    imgElement.src = imgUrl;
    document.body.appendChild(imgElement);
 */
function blobToImgUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
}