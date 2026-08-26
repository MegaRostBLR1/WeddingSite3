import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const photo =
  'https://dvxrhkgloakisnvqoxgl.supabase.co/storage/v1/object/sign/images/inputs/1787488650260_eghegghmp.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80NWE1YWU1ZS0xNzg4LTRiMWYtYWM5OC1hMjgwNmQ2OTM4ZWMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvaW5wdXRzLzE3ODc0ODg2NTAyNjBfZWdoZWdnaG1wLmpwZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODc0ODg2NTksImV4cCI6MTgxOTAyNDY1OX0.mELfBUZhqHccH6OOQ9M1oN5iD9hnZFzTKjkD8o6PRCw';

const olive = '#464b30';
const sage = '#a8ab7e';
const cream = '#f4efe4';
const gold = '#b9964f';
const ink = '#292b20';

const fade = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const Scene: React.FC<React.PropsWithChildren<{ background?: string }>> = ({
  children,
  background = cream,
}) => (
  <AbsoluteFill style={{ background, color: ink, fontFamily: 'Georgia, serif' }}>
    {children}
  </AbsoluteFill>
);

const Grain: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      opacity: 0.08,
      backgroundImage:
        'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 180 180\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'.55\'/%3E%3C/svg%3E")',
      mixBlendMode: 'multiply',
    }}
  />
);

const Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title = spring({ frame, fps, config: { damping: 180, stiffness: 80 } });
  const bgScale = interpolate(frame, [0, 150], [1.05, 1], { extrapolateRight: 'clamp' });

  return (
    <Scene background={olive}>
      <Img
        src={photo}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          scale: bgScale, opacity: 0.22, filter: 'sepia(0.15) saturate(0.7)',
        }}
      />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(20,24,12,.12), rgba(20,24,12,.78))' }} />
      <div style={{ position: 'absolute', inset: 90, border: `1px solid rgba(244,239,228,.3)` }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 100 }}>
        <div style={{ opacity: fade(frame, 5, 28), color: sage, fontFamily: 'Arial, sans-serif', fontSize: 28, letterSpacing: 9, textTransform: 'uppercase', marginBottom: 45 }}>
          Мы женимся
        </div>
        <div style={{ opacity: title, translate: `0 ${interpolate(title, [0, 1], [50, 0])}px` }}>
          <div style={{ color: cream, fontSize: 104, lineHeight: 0.95 }}>Анна</div>
          <div style={{ color: gold, fontSize: 76, fontStyle: 'italic', margin: '18px 0' }}>&amp;</div>
          <div style={{ color: cream, fontSize: 104, lineHeight: 0.95 }}>Михаил</div>
        </div>
        <div style={{ opacity: fade(frame, 45, 75), marginTop: 70, color: cream, fontFamily: 'Arial, sans-serif', fontSize: 26, letterSpacing: 5 }}>
          26 СЕНТЯБРЯ 2026
        </div>
      </AbsoluteFill>
      <Grain />
    </Scene>
  );
};

const Quote: React.FC = () => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [0, 35], [0, 420], { extrapolateRight: 'clamp' });
  return (
    <Scene>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ width: line, height: 1, background: gold, marginBottom: 65 }} />
        <div style={{ opacity: fade(frame, 10, 40), fontSize: 67, fontStyle: 'italic', lineHeight: 1.15, maxWidth: 820 }}>
          Два сердца —<br />одна судьба
        </div>
        <div style={{ opacity: fade(frame, 45, 70), marginTop: 50, fontFamily: 'Arial, sans-serif', fontSize: 22, letterSpacing: 5, color: olive }}>
          НАШ ДЕНЬ
        </div>
      </AbsoluteFill>
      <Grain />
    </Scene>
  );
};

const Story: React.FC = () => {
  const frame = useCurrentFrame();
  const imageScale = interpolate(frame, [0, 150], [1.12, 1], { extrapolateRight: 'clamp' });
  return (
    <Scene>
      <div style={{ position: 'absolute', top: 100, left: 90, right: 90, fontFamily: 'Arial, sans-serif', color: olive, fontSize: 20, letterSpacing: 5 }}>
        НАША ИСТОРИЯ
      </div>
      <div style={{ position: 'absolute', top: 210, left: 90, width: 900, height: 850, overflow: 'hidden', opacity: fade(frame, 0, 35) }}>
        <Img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover', scale: imageScale }} />
      </div>
      <div style={{ position: 'absolute', left: 120, right: 120, bottom: 120, padding: 45, background: 'rgba(244,239,228,.94)', opacity: fade(frame, 50, 80), translate: `0 ${interpolate(frame, [50, 80], [60, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px` }}>
        <div style={{ fontSize: 48, color: olive, marginBottom: 18 }}>Пять лет назад</div>
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 24, lineHeight: 1.55 }}>
          Случайная встреча изменила нашу жизнь навсегда. Теперь мы хотим разделить самый важный день с вами.
        </div>
      </div>
      <Grain />
    </Scene>
  );
};

const Timeline: React.FC = () => {
  const frame = useCurrentFrame();
  const events = [
    ['15:00', 'Сбор гостей'],
    ['16:00', 'Церемония'],
    ['17:00', 'Банкет'],
    ['20:30', 'Первый танец'],
    ['22:30', 'Торт и финал'],
  ];
  const progress = interpolate(frame, [10, 125], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Scene>
      <div style={{ position: 'absolute', top: 100, left: 90, fontFamily: 'Arial, sans-serif', color: olive, fontSize: 20, letterSpacing: 5 }}>ПЛАН ДНЯ</div>
      <div style={{ position: 'absolute', top: 185, left: 90, fontSize: 70 }}>Программа</div>
      <div style={{ position: 'absolute', top: 390, left: 170, width: 3, height: 1080, background: '#ddd8c9' }} />
      <div style={{ position: 'absolute', top: 390, left: 170, width: 3, height: 1080 * progress, background: gold }} />
      {events.map(([time, label], index) => {
        const y = 390 + index * 210;
        const p = fade(frame, 20 + index * 15, 45 + index * 15);
        return (
          <div key={time} style={{ position: 'absolute', top: y - 25, left: 140, opacity: p, translate: `${interpolate(p, [0, 1], [-30, 0])}px 0` }}>
            <div style={{ position: 'absolute', left: 17, top: 25, width: 29, height: 29, borderRadius: '50%', background: p > 0.8 ? gold : cream, border: `2px solid ${gold}` }} />
            <div style={{ marginLeft: 90, fontFamily: 'Arial, sans-serif', color: gold, fontSize: 24, letterSpacing: 3 }}>{time}</div>
            <div style={{ marginLeft: 90, fontSize: 42, marginTop: 8 }}>{label}</div>
          </div>
        );
      })}
      <Grain />
    </Scene>
  );
};

const Details: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps: 30, config: { damping: 180 } });
  const swatches = [olive, '#a8ab7e', cream, '#d4b878', '#5d6340'];
  return (
    <Scene background="#ece7d9">
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 100 }}>
        <div style={{ opacity: fade(frame, 0, 25), color: olive, fontFamily: 'Arial, sans-serif', fontSize: 20, letterSpacing: 5 }}>ДРЕСС-КОД</div>
        <div style={{ opacity: fade(frame, 15, 45), fontSize: 67, marginTop: 40 }}>Палитра нашего дня</div>
        <div style={{ display: 'flex', gap: 28, marginTop: 90, scale }}>
          {swatches.map((color, i) => <div key={i} style={{ width: 100, height: 100, borderRadius: '50%', background: color, border: i === 2 ? '1px solid #d8d2bf' : 'none' }} />)}
        </div>
        <div style={{ opacity: fade(frame, 65, 95), marginTop: 75, fontFamily: 'Arial, sans-serif', fontSize: 24, lineHeight: 1.5, maxWidth: 780 }}>
          Олива · шалфей · сливки · золото · хвоя
        </div>
        <div style={{ opacity: fade(frame, 85, 115), marginTop: 100, color: olive, fontSize: 32 }}>Усадьба «Оливковая роща»</div>
      </AbsoluteFill>
      <Grain />
    </Scene>
  );
};

const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 150, stiffness: 70 } });
  return (
    <Scene background={olive}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ scale: s, color: cream, fontSize: 82, lineHeight: 1 }}>Анна &amp; Михаил</div>
        <div style={{ opacity: fade(frame, 25, 55), marginTop: 50, color: gold, fontFamily: 'Arial, sans-serif', fontSize: 24, letterSpacing: 5 }}>26 СЕНТЯБРЯ 2026</div>
        <div style={{ opacity: fade(frame, 45, 80), marginTop: 120, padding: '24px 55px', border: `1px solid ${gold}`, color: cream, fontFamily: 'Arial, sans-serif', fontSize: 22, letterSpacing: 3 }}>ПОСМОТРЕТЬ ПРИГЛАШЕНИЕ</div>
      </AbsoluteFill>
      <Grain />
    </Scene>
  );
};

export const WeddingReels: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={150}><Hero /></Sequence>
    <Sequence from={150} durationInFrames={75}><Quote /></Sequence>
    <Sequence from={225} durationInFrames={135}><Story /></Sequence>
    <Sequence from={360} durationInFrames={150}><Timeline /></Sequence>
    <Sequence from={510} durationInFrames={60}><Details /></Sequence>
    <Sequence from={570} durationInFrames={30}><Final /></Sequence>
  </AbsoluteFill>
);
