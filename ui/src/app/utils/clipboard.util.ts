/**
 * Copies text to the system clipboard.
 * Uses the modern Clipboard API with fallback logging.
 * 
 * @param text - The text to copy to clipboard
 * @returns Promise that resolves when copy succeeds or rejects on failure
 */
export async function copyToClipboard(text: string): Promise<void> {
    try {
        await navigator.clipboard.writeText(text);
    } catch (error) {
        console.error('Error al copiar al portapapeles:', error);
        throw error;
    }
}
