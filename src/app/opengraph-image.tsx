import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'

// Route segment config
export const runtime = 'nodejs'

// Image metadata
export const alt = 'Ruslan Lapiniak - Full Stack Developer CV'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
    // Font
    // We can load a font here if needed, but for simplicity we'll use system fonts or fetch one.
    // For robustness in this environment, I'll rely on default sans-serif but style it well.

    const imageData = await readFile(join(process.cwd(), 'src/assets/me.png'))
    const base64Image = `data:image/png;base64,${imageData.toString('base64')}`

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#1e1e2e', // Catppuccin Mocha Base
                    color: '#cdd6f4', // Catppuccin Text
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        paddingLeft: '80px',
                        width: '65%',
                    }}
                >
                    <div
                        style={{
                            fontSize: 64,
                            fontWeight: 900,
                            color: '#a6d189', // Green Accent
                            marginBottom: 20,
                            display: 'flex',
                        }}
                    >
                        Ruslan Lapiniak
                    </div>
                    <div
                        style={{
                            fontSize: 36,
                            color: '#bac2de', // Subtext
                            marginBottom: 40,
                            display: 'flex',
                        }}
                    >
                        Full Stack Developer & DevOps Engineer
                    </div>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <div style={{ padding: '10px 20px', background: '#313244', borderRadius: '50px', fontSize: 24, display: 'flex' }}>React</div>
                        <div style={{ padding: '10px 20px', background: '#313244', borderRadius: '50px', fontSize: 24, display: 'flex' }}>Next.js</div>
                        <div style={{ padding: '10px 20px', background: '#313244', borderRadius: '50px', fontSize: 24, display: 'flex' }}>Python</div>
                        <div style={{ padding: '10px 20px', background: '#313244', borderRadius: '50px', fontSize: 24, display: 'flex' }}>DevOps</div>
                    </div>
                </div>

                <div
                    style={{
                        width: '35%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #a6d189 0%, #81c8be 100%)',
                    }}
                >
                    <img
                        src={base64Image}
                        width="250"
                        height="250"
                        style={{
                            borderRadius: '50%',
                            border: '8px solid #1e1e2e',
                            objectFit: 'cover',
                        }}
                    />
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
