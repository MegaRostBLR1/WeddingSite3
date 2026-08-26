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

const C = {
  olive: '#464b30',
  sage: '#a8ab7e',
  cream: '#f4efe4',
  gold: '#b9964f',
  ink: '#292b20',
  paper: '#ece7d9',
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const fade = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

const Grain = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      opacity: 0.055,
      backgroundImage:
        'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'180\' height=\'180\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'.7\'/%3E%3C/svg%3E")',
      mixBlendMode: 'multiply',
    }}
  />
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontFamily: 'Arial, sans-serif',
      fontSize: 21,
      letterSpacing: 5,
      textTransform: 'uppercase',
      color: C.gold,
    }}
  >
    {children}
  </div>
);

const Hook = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 180, stiffness: 85 } });
  const photoScale = interpolate(f, [0, 75], [1.16, 1.03], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: C.olive, color: C.cream, overflow: 'hidden' }}>
      <Img src={photo} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', scale: photoScale, opacity: 0.32, filter: 'sepia(.12) saturate(.75)' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(25,28,15,.12), rgba(25,28,15,.86))' }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 95 }}>
        <div style={{ opacity: fade(f, 0, 18), fontFamily: 'Arial, sans-serif', fontSize: 23, letterSpacing: 6, marginBottom: 55 }}>
          А если приглашение…
        </div>
        <div style={{ scale: s, fontFamily: 'Georgia, serif', fontSize: 82, lineHeight: 1.03 }}>
          хочется<br />открыть снова?
        </div>
        <div style={{ opacity: fade(f, 42, 65), marginTop: 55, fontFamily: 'Arial, sans-serif', fontSize: 20, letterSpacing: 4, color: C.sage }}>
          СВАДЕБНЫЙ САЙТ ДЛЯ ВАШЕЙ ПАРЫ
        </div>
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};

const Product = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phone = spring({ frame: f - 8, fps, config: { damping: 150, stiffness: 95 } });
  const rotate = interpolate(f, [0, 70], [4, -1], { extrapolateRight: 'clamp', easing: ease });
  const screenY = interpolate(f, [0, 70], [80, -35], { extrapolateRight: 'clamp', easing: ease });

  return (
    <AbsoluteFill style={{ background: C.paper, overflow: 'hidden' }}>
      <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 125 }}>
        <Label>Это не просто ссылка</Label>
        <div style={{ opacity: fade(f, 8, 25), fontFamily: 'Georgia, serif', fontSize: 62, color: C.ink, marginTop: 25, textAlign: 'center' }}>
          Это часть<br />вашего дня
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          width: 610,
          height: 1080,
          left: 235,
          top: 670,
          borderRadius: 70,
          background: '#191b14',
          padding: 18,
          boxShadow: '0 35px 90px rgba(41,43,32,.28)',
          scale: phone,
          rotate: `${rotate}deg`,
          translate: `0 ${interpolate(phone, [0, 1], [130, 0])}px`,
        }}
      >
        <div style={{ position: 'absolute', top: 32, left: 210, width: 190, height: 34, borderRadius: 30, background: '#0b0c09', zIndex: 3 }} />
        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 53, overflow: 'hidden', background: C.cream }}>
          <Img src={photo} style={{ position: 'absolute', top: screenY, left: 0, width: '100%', height: 560, objectFit: 'cover', scale: 1.12 }} />
          <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(25,27,17,.05), rgba(25,27,17,.72))' }} />
          <div style={{ position: 'absolute', top: 390, width: '100%', textAlign: 'center', color: C.cream, fontFamily: 'Georgia, serif', fontSize: 57, lineHeight: .9 }}>
            Анна<br /><span style={{ color: C.gold, fontSize: 43 }}>&amp;</span><br />Михаил
          </div>
          <div style={{ position: 'absolute', top: 575, width: '100%', textAlign: 'center', color: C.olive, fontFamily: 'Arial, sans-serif', fontSize: 18, letterSpacing: 4 }}>26 СЕНТЯБРЯ 2026</div>
          <div style={{ position: 'absolute', top: 650, left: 45, right: 45, height: 1, background: C.gold }} />
          <div style={{ position: 'absolute', top: 700, left: 55, right: 55, color: C.ink, fontFamily: 'Georgia, serif', fontSize: 32 }}>Наша история</div>
          <div style={{ position: 'absolute', top: 770, left: 55, right: 55, color: '#56584b', fontFamily: 'Arial, sans-serif', fontSize: 18, lineHeight: 1.5 }}>Встреча, которая изменила всё. И день, который хочется разделить с вами.</div>
        </div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

const Benefits = () => {
  const f = useCurrentFrame();
  const items = [
    ['01', 'Индивидуальный дизайн', 'Не шаблон. Визуальный стиль именно вашей свадьбы.'],
    ['02', 'Всё в одном месте', 'Дата, программа, локация, dress-code и история пары.'],
    ['03', 'RSVP без переписок', 'Гостям проще подтвердить присутствие прямо на сайте.'],
  ];
  return (
    <AbsoluteFill style={{ background: C.olive, color: C.cream, padding: '125px 85px' }}>
      <Label>Почему это работает</Label>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 66, lineHeight: 1.05, marginTop: 28, marginBottom: 75 }}>
        Красиво.<br />Удобно.<br />По-настоящему ваше.
      </div>
      {items.map(([n, title, text], i) => {
        const p = fade(f, 8 + i * 12, 28 + i * 12);
        return (
          <div key={n} style={{ opacity: p, translate: `${interpolate(p, [0, 1], [-35, 0])}px 0`, marginBottom: 35, borderTop: `1px solid rgba(244,239,228,.25)`, paddingTop: 25 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
              <span style={{ color: C.gold, fontFamily: 'Arial, sans-serif', fontSize: 18, letterSpacing: 3 }}>{n}</span>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 38 }}>{title}</span>
            </div>
            <div style={{ marginLeft: 55, marginTop: 10, fontFamily: 'Arial, sans-serif', fontSize: 20, lineHeight: 1.45, color: C.sage, maxWidth: 790 }}>{text}</div>
          </div>
        );
      })}
      <Grain />
    </AbsoluteFill>
  );
};

const Proof = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const image = interpolate(f, [0, 90], [1.08, 1], { extrapolateRight: 'clamp' });
  const card = spring({ frame: f - 12, fps, config: { damping: 170, stiffness: 90 } });
  return (
    <AbsoluteFill style={{ background: C.cream, overflow: 'hidden' }}>
      <Img src={photo} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 1120, objectFit: 'cover', scale: image }} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(244,239,228,0) 40%, rgba(244,239,228,.98) 70%)' }} />
      <div style={{ position: 'absolute', left: 85, right: 85, bottom: 165, scale: card, translate: `0 ${interpolate(card, [0, 1], [70, 0])}px` }}>
        <Label>Ваш день — в одном стиле</Label>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 63, color: C.ink, lineHeight: 1.02, marginTop: 22 }}>
          От первого экрана<br />до последнего гостя.
        </div>
        <div style={{ marginTop: 30, fontFamily: 'Arial, sans-serif', fontSize: 21, lineHeight: 1.5, color: '#55574c', maxWidth: 820 }}>
          Сайт становится продолжением оформления свадьбы — и остаётся у гостей как память.
        </div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

const CTA = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 160, stiffness: 75 } });
  return (
    <AbsoluteFill style={{ background: C.olive, color: C.cream }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 80 }}>
        <div style={{ scale: s, fontFamily: 'Georgia, serif', fontSize: 82, lineHeight: 1.02 }}>
          Создадим<br />ваше приглашение
        </div>
        <div style={{ opacity: fade(f, 18, 40), marginTop: 45, color: C.sage, fontFamily: 'Arial, sans-serif', fontSize: 22, letterSpacing: 4 }}>
          ИНДИВИДУАЛЬНЫЙ СВАДЕБНЫЙ САЙТ
        </div>
        <div style={{ opacity: fade(f, 35, 55), marginTop: 85, border: `1px solid ${C.gold}`, padding: '23px 52px', color: C.cream, fontFamily: 'Arial, sans-serif', fontSize: 21, letterSpacing: 3 }}>
          НАПИШИТЕ «СВАДЬБА»
        </div>
        <div style={{ opacity: fade(f, 45, 65), marginTop: 28, color: C.gold, fontFamily: 'Arial, sans-serif', fontSize: 18, letterSpacing: 2 }}>
          и получите примеры дизайна
        </div>
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};

export const WeddingSalesReel: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={75}><Hook /></Sequence>
    <Sequence from={75} durationInFrames={105}><Product /></Sequence>
    <Sequence from={180} durationInFrames={150}><Benefits /></Sequence>
    <Sequence from={330} durationInFrames={120}><Proof /></Sequence>
    <Sequence from={450} durationInFrames={90}><CTA /></Sequence>
  </AbsoluteFill>
);
