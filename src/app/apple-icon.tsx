import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Image metadata
export const size = {
    width: 180,
    height: 180,
};

export const contentType = 'image/png';

// Image generation
export default async function AppleIcon() {
    // Read the image file
    const imageData = await readFile(
        join(process.cwd(), 'src/assets/me.png')
    );
    const base64Image = `data:image/png;base64,${imageData.toString('base64')}`;

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #8aadf4 0%, #c6a0f6 100%)',
                    borderRadius: '20%',
                }}
            >
                <img
                    src={base64Image}
                    alt="Apple Icon"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '20%',
                    }}
                />
            </div>
        ),
        {
            ...size,
        }
    );
}
