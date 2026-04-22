import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Impervia Estates — UAE Premium Property Management'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  let fontData = null
  try {
    fontData = await fetch(
      'https://fonts.gstatic.com/s/cormorantgaramond/v21/co3YmX5slCNuHLi8bLeY9MK7whWMhyjYrk-KckzBqIFB.woff2'
    ).then((r) => r.arrayBuffer())
  } catch (_) {}

  const gold = '#B8965A'
  const goldLight = '#CBB07A'
  const goldPale = '#F2E8D5'
  const bg = '#0D1B2A'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: bg,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glow — top left */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            left: '-80px',
            width: '560px',
            height: '560px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(184,150,90,0.10) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        {/* Ambient glow — bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-60px',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(184,150,90,0.07) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Outer border frame */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            bottom: '20px',
            border: `1px solid rgba(184,150,90,0.35)`,
            display: 'flex',
          }}
        />

        {/* Inner border frame */}
        <div
          style={{
            position: 'absolute',
            top: '30px',
            left: '30px',
            right: '30px',
            bottom: '30px',
            border: `1px solid rgba(184,150,90,0.15)`,
            display: 'flex',
          }}
        />

        {/* Corner marks — top left */}
        <div style={{ position: 'absolute', top: '38px', left: '38px', width: '28px', height: '28px', borderTop: `1.5px solid ${gold}`, borderLeft: `1.5px solid ${gold}`, display: 'flex' }} />
        {/* Corner marks — top right */}
        <div style={{ position: 'absolute', top: '38px', right: '38px', width: '28px', height: '28px', borderTop: `1.5px solid ${gold}`, borderRight: `1.5px solid ${gold}`, display: 'flex' }} />
        {/* Corner marks — bottom left */}
        <div style={{ position: 'absolute', bottom: '38px', left: '38px', width: '28px', height: '28px', borderBottom: `1.5px solid ${gold}`, borderLeft: `1.5px solid ${gold}`, display: 'flex' }} />
        {/* Corner marks — bottom right */}
        <div style={{ position: 'absolute', bottom: '38px', right: '38px', width: '28px', height: '28px', borderBottom: `1.5px solid ${gold}`, borderRight: `1.5px solid ${gold}`, display: 'flex' }} />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0px',
          }}
        >
          {/* Region label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '36px',
            }}
          >
            <div style={{ width: '56px', height: '1px', background: `rgba(184,150,90,0.55)`, display: 'flex' }} />
            <span
              style={{
                fontFamily: fontData ? 'Cormorant Garamond' : 'Georgia, serif',
                fontSize: '13px',
                letterSpacing: '0.28em',
                color: gold,
                textTransform: 'uppercase',
              }}
            >
              United Arab Emirates
            </span>
            <div style={{ width: '56px', height: '1px', background: `rgba(184,150,90,0.55)`, display: 'flex' }} />
          </div>

          {/* IMPERVIA */}
          <div
            style={{
              fontFamily: fontData ? 'Cormorant Garamond' : 'Georgia, serif',
              fontSize: '108px',
              fontWeight: 300,
              color: goldPale,
              letterSpacing: '0.18em',
              lineHeight: 1,
              textTransform: 'uppercase',
            }}
          >
            IMPERVIA
          </div>

          {/* ESTATES */}
          <div
            style={{
              fontFamily: fontData ? 'Cormorant Garamond' : 'Georgia, serif',
              fontSize: '26px',
              fontWeight: 300,
              color: gold,
              letterSpacing: '0.55em',
              textTransform: 'uppercase',
              marginTop: '6px',
            }}
          >
            ESTATES
          </div>

          {/* Ornamental rule */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '36px 0 28px',
            }}
          >
            <div style={{ width: '72px', height: '1px', background: `rgba(184,150,90,0.4)`, display: 'flex' }} />
            <div
              style={{
                width: '6px',
                height: '6px',
                background: 'transparent',
                border: `1px solid ${gold}`,
                transform: 'rotate(45deg)',
                display: 'flex',
              }}
            />
            <div style={{ width: '72px', height: '1px', background: `rgba(184,150,90,0.4)`, display: 'flex' }} />
          </div>

          {/* Tagline */}
          <div
            style={{
              fontFamily: fontData ? 'Cormorant Garamond' : 'Georgia, serif',
              fontSize: '22px',
              fontWeight: 400,
              color: `rgba(242,232,213,0.65)`,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Premium Property Management
          </div>

          {/* RERA badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '22px',
              border: `1px solid rgba(184,150,90,0.28)`,
              padding: '7px 18px',
            }}
          >
            <div
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: gold,
                display: 'flex',
              }}
            />
            <span
              style={{
                fontFamily: fontData ? 'Cormorant Garamond' : 'Georgia, serif',
                fontSize: '12px',
                letterSpacing: '0.22em',
                color: goldLight,
                textTransform: 'uppercase',
              }}
            >
              RERA Licensed
            </span>
            <div
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: gold,
                display: 'flex',
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: 'Cormorant Garamond', data: fontData, style: 'normal', weight: 300 }]
        : [],
    }
  )
}
