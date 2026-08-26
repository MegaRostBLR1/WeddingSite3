import React from 'react';
import { Composition } from 'remotion';
import { WeddingReels } from './WeddingReels';
import { WeddingSalesReel } from './WeddingSalesReel';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="WeddingReels"
      component={WeddingReels}
      durationInFrames={600}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{}}
    />
    <Composition
      id="WeddingSalesReel"
      component={WeddingSalesReel}
      durationInFrames={540}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{}}
    />
  </>
);
