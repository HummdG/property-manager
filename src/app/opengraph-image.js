import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Impervia Estates — UAE Premium Property Management'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  let fontLight = null
  let fontRegular = null
  try {
    const [l, r] = await Promise.all([
      fetch('https://fonts.gstatic.com/s/cormorantgaramond/v21/co3YmX5slCNuHLi8bLeY9MK7whWMhyjYrk-KckzBqIFB.woff2').then((r) => r.arrayBuffer()),
      fetch('https://fonts.gstatic.com/s/cormorantgaramond/v21/co3YmX5slCNuHLi8bLeY9MK7whWMhyjornFLsS6V7w.woff2').then((r) => r.arrayBuffer()),
    ])
    fontLight = l
    fontRegular = r
  } catch (_) {}

  const hasFonts = fontLight && fontRegular
  const serif = hasFonts ? 'Cormorant Garamond' : 'Georgia, serif'

  const gold = '#B8965A'
  const goldLight = '#CBB07A'
  const goldPale = '#F2E8D5'
  const bg = '#0D1B2A'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: bg,
          position: 'relative',
        }}
      >
        {/* Outer border */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            bottom: '20px',
            border: '1px solid rgba(184,150,90,0.35)',
            display: 'flex',
          }}
        />

        {/* Inner border */}
        <div
          style={{
            position: 'absolute',
            top: '30px',
            left: '30px',
            right: '30px',
            bottom: '30px',
            border: '1px solid rgba(184,150,90,0.14)',
            display: 'flex',
          }}
        />

        {/* Corner — top left */}
        <div style={{ position: 'absolute', top: '36px', left: '36px', width: '24px', height: '24px', borderTop: `2px solid ${gold}`, borderLeft: `2px solid ${gold}`, display: 'flex' }} />
        {/* Corner — top right */}
        <div style={{ position: 'absolute', top: '36px', right: '36px', width: '24px', height: '24px', borderTop: `2px solid ${gold}`, borderRight: `2px solid ${gold}`, display: 'flex' }} />
        {/* Corner — bottom left */}
        <div style={{ position: 'absolute', bottom: '36px', left: '36px', width: '24px', height: '24px', borderBottom: `2px solid ${gold}`, borderLeft: `2px solid ${gold}`, display: 'flex' }} />
        {/* Corner — bottom right */}
        <div style={{ position: 'absolute', bottom: '36px', right: '36px', width: '24px', height: '24px', borderBottom: `2px solid ${gold}`, borderRight: `2px solid ${gold}`, display: 'flex' }} />

        {/* Content column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Region label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
            <div style={{ width: '52px', height: '1px', background: 'rgba(184,150,90,0.5)', display: 'flex' }} />
            <span style={{ fontFamily: serif, fontSize: '13px', letterSpacing: '0.28em', color: gold, textTransform: 'uppercase' }}>
              United Arab Emirates
            </span>
            <div style={{ width: '52px', height: '1px', background: 'rgba(184,150,90,0.5)', display: 'flex' }} />
          </div>

          {/* IMPERVIA */}
          <div style={{ fontFamily: serif, fontSize: '104px', fontWeight: 300, color: goldPale, letterSpacing: '0.18em', lineHeight: '1' }}>
            IMPERVIA
          </div>

          {/* ESTATES */}
          <div style={{ fontFamily: serif, fontSize: '24px', fontWeight: 300, color: gold, letterSpacing: '0.52em', textTransform: 'uppercase', marginTop: '4px' }}>
            ESTATES
          </div>

          {/* Ornamental rule */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '32px 0 26px' }}>
            <div style={{ width: '68px', height: '1px', background: 'rgba(184,150,90,0.38)', display: 'flex' }} />
            <div style={{ width: '6px', height: '6px', borderRadius: '1px', background: gold, display: 'flex' }} />
            <div style={{ width: '68px', height: '1px', background: 'rgba(184,150,90,0.38)', display: 'flex' }} />
          </div>

          {/* Tagline */}
          <div style={{ fontFamily: serif, fontSize: '21px', fontWeight: 400, color: 'rgba(242,232,213,0.62)', letterSpacing: '0.17em', textTransform: 'uppercase' }}>
            Premium Property Management
          </div>

          {/* RERA badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px', border: '1px solid rgba(184,150,90,0.26)', padding: '6px 18px' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: gold, display: 'flex' }} />
            <span style={{ fontFamily: serif, fontSize: '12px', letterSpacing: '0.22em', color: goldLight, textTransform: 'uppercase' }}>
              RERA Licensed
            </span>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: gold, display: 'flex' }} />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: hasFonts
        ? [
            { name: 'Cormorant Garamond', data: fontLight, style: 'normal', weight: 300 },
            { name: 'Cormorant Garamond', data: fontRegular, style: 'normal', weight: 400 },
          ]
        : [],
    }
  )
}
