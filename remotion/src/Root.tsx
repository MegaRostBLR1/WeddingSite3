import React from 'react';
import { AbsoluteFill, Composition, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const HERO = 'https://dvxrhkgloakisnvqoxgl.supabase.co/storage/v1/object/sign/images/inputs/1787488651534_vu8b8xrul.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80NWE1YWU1ZS0xNzg4LTRiMWYtYWM5OC1hMjgwNmQ2OTM4ZWMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvaW5wdXRzLzE3ODc0ODg2NTE1MzRfdnU4Yjh4cnVsLmpwZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODc0ODg2NTEsImV4cCI6MTgxOTAyNDY1OX0.vzFiYzyVreO2joLRlg7fXd6SKHRU_YxaPjds3AzyHnQ';
const RINGS = 'https://dvxrhkgloakisnvqoxgl.supabase.co/storage/v1/object/sign/images/inputs/1787488650260_eghegghmp.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80NWE1YWU1ZS0xNzg4LTRiMWYtYWM5OC1hMjgwNmQ2OTM4ZWMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvaW5wdXRzLzE3ODc0ODg2NTAyNjBfZWdoZWdnaG1wLmpwZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODc0ODg2NTksImV4cCI6MTgxOTAyNDY1OX0.mELfBUZhqHccH6OOQ9M1oN5iD9hnZFzTKjkD8o6PRCw';

const colors = { paper: '#faf7ef', cream: '#f4efe4', olive: '#7c8354', deep: '#464b30', gold: '#d4b878', ink: '#4a4a3d' };

const Fade = ({ from, to, start, duration, children }: { from: number; to: number; start: number; duration: number; children: React.ReactNode }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [start, start + duration], [from, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const Scene = ({ children, background = colors.cream }: { children: React.ReactNode; background?: string }) => (
  <AbsoluteFill style={{ background, color: colors.deep, fontFamily: 'Georgia, serif' }}>{children}</AbsoluteFill>
);

const ImageBackdrop = ({ src, zoom = 1 }: { src: string; zoom?: number }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 150], [1, zoom], { extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ overflow: 'hidden' }}><Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})` }} /></AbsoluteFill>;
};

const Reel = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const heroIn = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const titleY = interpolate(heroIn, [0, 1], [70, 0]);
  const line = interpolate(frame, [45, 75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cardScale = spring({ frame: Math.max(0, frame - 310), fps, config: { damping: 16, stiffness: 85 } });

  return <AbsoluteFill style={{ background: colors.cream }}>
    <Fade from={0} to={1} start={0} duration={24}>
      <ImageBackdrop src={HERO} zoom={1.08} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(40,45,25,.18), rgba(40,45,25,.62))' }} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 70 }}>
        <div style={{ transform: `translateY(${titleY}px)`, color: colors.paper }}>
          <div style={{ fontSize: 27, letterSpacing: 11, textTransform: 'uppercase', color: colors.gold, marginBottom: 30 }}>Мы женимся</div>
          <div style={{ fontSize: 105, lineHeight: 1.02, fontWeight: 500 }}>Анна <span style={{ color: colors.gold, fontStyle: 'italic' }}>&</span> Михаил</div>
          <div style={{ width: 100, height: 1, background: colors.gold, margin: '34px auto', transform: `scaleX(${line})` }} />
          <div style={{ fontSize: 31, letterSpacing: 6, textTransform: 'uppercase' }}>26 сентября 2026</div>
          <div style={{ fontSize: 27, marginTop: 18, fontStyle: 'italic', opacity: .9 }}>Два сердца — одна судьба</div>
        </div>
      </AbsoluteFill>
    </Fade>

    <Fade from={0} to={1} start={145} duration={20}>
      <Scene background={colors.paper}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: 75 }}>
          <div style={{ fontSize: 23, letterSpacing: 8, textTransform: 'uppercase', color: colors.olive, marginBottom: 25 }}>Наш день</div>
          <div style={{ fontSize: 72, textAlign: 'center', lineHeight: 1.05 }}>Приглашаем вас<br /><i>разделить с нами</i><br />этот момент</div>
          <div style={{ width: 90, height: 1, background: colors.gold, margin: '35px 0' }} />
          <div style={{ fontSize: 28, color: colors.ink, textAlign: 'center', lineHeight: 1.6 }}>Тёплый свет · оливковые ветви<br />и самые близкие люди</div>
        </AbsoluteFill>
      </Scene>
    </Fade>

    <Fade from={0} to={1} start={290} duration={20}>
      <Scene background={colors.cream}>
        <ImageBackdrop src={RINGS} zoom={1.06} />
        <AbsoluteFill style={{ background: 'rgba(250,247,239,.76)' }} />
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: 70 }}>
          <div style={{ background: 'rgba(250,247,239,.94)', border: `1px solid ${colors.gold}`, padding: 60, width: '82%', textAlign: 'center', transform: `scale(${.94 + cardScale * .06})`, boxShadow: '0 30px 80px rgba(70,75,48,.18)' }}>
            <div style={{ fontSize: 22, letterSpacing: 7, textTransform: 'uppercase', color: colors.gold }}>Программа</div>
            <div style={{ fontSize: 61, margin: '22px 0 38px' }}>26 сентября</div>
            <div style={{ display: 'grid', gap: 25, textAlign: 'left', fontFamily: 'Arial, sans-serif' }}>
              {['15:00  Сбор гостей', '16:00  Церемония', '17:00  Банкет', '20:30  Первый танец', '22:30  Торт и финал'].map((item) => {
                const [time, ...rest] = item.split('  ');
                return <div key={item} style={{ display: 'flex', gap: 25, alignItems: 'baseline' }}><span style={{ color: colors.gold, fontSize: 24, minWidth: 70 }}>{time}</span><span style={{ fontSize: 25, color: colors.ink }}>{rest.join(' ')}</span></div>;
              })}
            </div>
          </div>
        </AbsoluteFill>
      </Scene>
    </Fade>

    <Fade from={0} to={1} start={455} duration={25}>
      <Scene background={colors.deep}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 65, color: colors.paper }}>
          <div style={{ fontSize: 24, letterSpacing: 8, textTransform: 'uppercase', color: colors.gold }}>Ждём вас</div>
          <div style={{ fontSize: 86, margin: '28px 0 22px', lineHeight: 1 }}>Анна <i>&</i> Михаил</div>
          <div style={{ width: 100, height: 1, background: colors.gold, margin: '0 auto 32px' }} />
          <div style={{ fontSize: 31, lineHeight: 1.55 }}>Усадьба «Оливковая роща»<br /><span style={{ fontSize: 24, opacity: .8 }}>26 сентября 2026</span></div>
          <div style={{ marginTop: 65, fontSize: 22, letterSpacing: 4, textTransform: 'uppercase', opacity: .8 }}>С любовью, Анна и Михаил</div>
        </AbsoluteFill>
      </Scene>
    </Fade>
  </AbsoluteFill>;
};

export const RemotionRoot = () => (
  <Composition id="WeddingReel" component={Reel} durationInFrames={600} fps={30} width={1080} height={1920} />
);
