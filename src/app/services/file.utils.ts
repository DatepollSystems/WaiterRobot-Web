/**
 * Converts a Base64 string to a File object and triggers its download.
 *
 * @param base64 - The Base64-encoded string representing the file data.
 * @param fileName - The desired name for the downloaded file (e.g., "document.pdf").
 * @param mimeType - (Optional) The MIME type of the file. Defaults to 'application/octet-stream'.
 * @returns A Promise that resolves when the download is initiated.
 */
export async function base64ToFileAndDownload(base64: string, fileName: string, mimeType: string = 'application/pdf'): Promise<void> {
  try {
    // Convert Base64 string to a Blob
    const blob: Blob = base64ToBlob(base64, mimeType);

    // Create a File from the Blob
    const file: File = new File([blob], fileName, {type: mimeType});

    // Trigger the download
    triggerDownload(file);

    console.log(`Download initiated for ${fileName}`);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}

/**
 * Converts a Base64 string to an array buffer.
 *
 * @param base64 - The Base64-encoded string.
 * @returns A ByteArray representing the binary data.
 */
export function base64ToArrayBuffer(base64: string): Uint8Array {
  // Decode the Base64 string
  const byteCharacters: string = atob(base64);

  // Create an array of byte values
  const byteNumbers: number[] = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  // Convert byte numbers to a Uint8Array
  return new Uint8Array(byteNumbers);
}

/**
 * Converts a Base64 string to a Blob.
 *
 * @param base64 - The Base64-encoded string.
 * @param mimeType - The MIME type of the data.
 * @returns A Blob representing the binary data.
 */
export function base64ToBlob(base64: string, mimeType: string): Blob {
  // Convert byte numbers to a Uint8Array
  const byteArray = base64ToArrayBuffer(base64);

  // Create and return the Blob
  return new Blob([byteArray], {type: mimeType});
}

/**
 * Triggers the download of a File or Blob object.
 *
 * @param file - The File or Blob to be downloaded.
 */
export function triggerDownload(file: File | Blob, fileName?: string): void {
  // Create an object URL for the file
  const url: string = URL.createObjectURL(file);

  // Create a temporary anchor element
  const anchor: HTMLAnchorElement = document.createElement('a');
  anchor.href = url;
  anchor.download = file instanceof File ? file.name : (fileName ?? 'download');

  // Append the anchor to the body
  document.body.appendChild(anchor);

  // Programmatically click the anchor to trigger the download
  anchor.click();

  // Remove the anchor from the document
  document.body.removeChild(anchor);

  // Revoke the object URL to free up memory
  URL.revokeObjectURL(url);
}
