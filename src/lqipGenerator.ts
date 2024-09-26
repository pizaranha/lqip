import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

export async function generateLQIP(imagePath: string): Promise<string> {
    try {
        const outputPath = path.join(path.dirname(imagePath), `${path.basename(imagePath, path.extname(imagePath))}-lqip.jpg`);
        
        await sharp(imagePath)
            .resize(20) // Resize to a very small image
            .blur() // Apply a slight blur
            .toFormat('jpeg', { quality: 20 }) // Convert to JPEG with low quality
            .toFile(outputPath);

        // Read the file and convert to base64
        const buffer = fs.readFileSync(outputPath);
        const base64 = buffer.toString('base64');

        // Delete the temporary file
        fs.unlinkSync(outputPath);

        return `data:image/jpeg;base64,${base64}`;
    } catch (error: unknown) {
        console.error('Error in generateLQIP:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate LQIP: ${error.message}`);
        } else {
            throw new Error('Failed to generate LQIP: Unknown error');
        }
    }
}