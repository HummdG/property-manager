import { ImageResponse } from 'next/og'

export const alt = 'Impervia Estates — UAE Real Estate Brokerage'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
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
          backgroundColor: bg,
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

        {/* Corners */}
        <div style={{ position: 'absolute', top: '36px', left: '36px', width: '24px', height: '24px', borderTop: `2px solid ${gold}`, borderLeft: `2px solid ${gold}`, display: 'flex' }} />
        <div style={{ position: 'absolute', top: '36px', right: '36px', width: '24px', height: '24px', borderTop: `2px solid ${gold}`, borderRight: `2px solid ${gold}`, display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '36px', left: '36px', width: '24px', height: '24px', borderBottom: `2px solid ${gold}`, borderLeft: `2px solid ${gold}`, display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '36px', right: '36px', width: '24px', height: '24px', borderBottom: `2px solid ${gold}`, borderRight: `2px solid ${gold}`, display: 'flex' }} />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Region label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
            <div style={{ width: '52px', height: '1px', backgroundColor: 'rgba(184,150,90,0.5)', display: 'flex' }} />
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px', letterSpacing: '0.25em', color: gold }}>
              UNITED ARAB EMIRATES
            </span>
            <div style={{ width: '52px', height: '1px', backgroundColor: 'rgba(184,150,90,0.5)', display: 'flex' }} />
          </div>

          {/* IMPERVIA */}
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '104px', fontWeight: 'normal', color: goldPale, letterSpacing: '0.15em', lineHeight: '1' }}>
            IMPERVIA
          </div>

          {/* ESTATES */}
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 'normal', color: gold, letterSpacing: '0.5em', marginTop: '6px' }}>
            ESTATES
          </div>

          {/* Rule */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '32px 0 26px' }}>
            <div style={{ width: '68px', height: '1px', backgroundColor: 'rgba(184,150,90,0.38)', display: 'flex' }} />
            <div style={{ width: '6px', height: '6px', backgroundColor: gold, display: 'flex' }} />
            <div style={{ width: '68px', height: '1px', backgroundColor: 'rgba(184,150,90,0.38)', display: 'flex' }} />
          </div>

          {/* Tagline */}
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 'normal', color: 'rgba(242,232,213,0.65)', letterSpacing: '0.15em' }}>
            REAL ESTATE BROKERAGE · LEASING &amp; SALES
          </div>

          {/* New-standard badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px', border: '1px solid rgba(184,150,90,0.26)', padding: '6px 18px' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: gold, display: 'flex' }} />
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '12px', letterSpacing: '0.2em', color: goldLight }}>
              A NEW STANDARD · DUBAI
            </span>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: gold, display: 'flex' }} />
          </div>

        </div>
      </div>
    ),
    { ...size }
  )
}
