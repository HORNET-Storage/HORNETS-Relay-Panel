// src/components/relay-settings/sections/MediaSection/MediaSection.tsx

import React from 'react';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { CollapsibleSection } from '../../shared/CollapsibleSection/CollapsibleSection';
import { MediaTypeList } from './components/MediaTypeList';
import { MediaToggle } from './components/MediaToggle';

export interface MediaSectionProps {
  mode: string;
  photos: {
    selected: string[];
    isActive: boolean;
    onChange: (values: string[]) => void;
    onToggle: (checked: boolean) => void;
  };
  videos: {
    selected: string[];
    isActive: boolean;
    onChange: (values: string[]) => void;
    onToggle: (checked: boolean) => void;
  };
  audio: {
    selected: string[];
    isActive: boolean;
    onChange: (values: string[]) => void;
    onToggle: (checked: boolean) => void;
  };
}

const imageFormats = [
  { ext: 'jpeg', mime: 'image/jpeg' },
  { ext: 'png', mime: 'image/png' },
  { ext: 'gif', mime: 'image/gif' },
  { ext: 'bmp', mime: 'image/bmp' },
  { ext: 'tiff', mime: 'image/tiff' },
  { ext: 'raw', mime: 'image/raw' },
  { ext: 'svg', mime: 'image/svg+xml' },
  { ext: 'webp', mime: 'image/webp' },
  { ext: 'pdf', mime: 'application/pdf' },
  { ext: 'eps', mime: 'image/eps' },
  { ext: 'psd', mime: 'image/vnd.adobe.photoshop' },
  { ext: 'ai', mime: 'application/postscript' }
];

const videoFormats = [
  { ext: 'avi', mime: 'video/avi' },
  { ext: 'mp4', mime: 'video/mp4' },
  { ext: 'mov', mime: 'video/mov' },
  { ext: 'wmv', mime: 'video/wmv' },
  { ext: 'mkv', mime: 'video/mkv' },
  { ext: 'flv', mime: 'video/flv' },
  { ext: 'mpeg', mime: 'video/mpeg' },
  { ext: '3gp', mime: 'video/3gpp' },
  { ext: 'webm', mime: 'video/webm' },
  { ext: 'ogg', mime: 'video/ogg' }
];

const audioFormats = [
  { ext: 'mp3', mime: 'audio/mpeg' },
  { ext: 'wav', mime: 'audio/wav' },
  { ext: 'ogg', mime: 'audio/ogg' },
  { ext: 'flac', mime: 'audio/flac' },
  { ext: 'aac', mime: 'audio/aac' },
  { ext: 'wma', mime: 'audio/x-ms-wma' },
  { ext: 'm4a', mime: 'audio/mp4' },
  { ext: 'opus', mime: 'audio/opus' },
  { ext: 'm4b', mime: 'audio/m4b' },
  { ext: 'midi', mime: 'audio/midi' }
];

export const MediaSection: React.FC<MediaSectionProps> = ({
  mode,
  photos,
  videos,
  audio,
}) => {
  const getHeader = (type: string) => 
    mode !== 'smart' ? `Blacklisted ${type} Extensions` : `${type} Extensions`;

  return (
    <>
      <CollapsibleSection header={getHeader('Photo')}>
        <S.Card>
          <MediaToggle
            isActive={photos.isActive}
            onChange={photos.onToggle}
            mode={mode}
          />
          <MediaTypeList
            formats={imageFormats}
            selectedFormats={photos.selected}
            onChange={photos.onChange}
            isActive={photos.isActive}
            mode={mode}
          />
        </S.Card>
      </CollapsibleSection>

      <CollapsibleSection header={getHeader('Video')}>
        <S.Card>
          <MediaToggle
            isActive={videos.isActive}
            onChange={videos.onToggle}
            mode={mode}
          />
          <MediaTypeList
            formats={videoFormats}
            selectedFormats={videos.selected}
            onChange={videos.onChange}
            isActive={videos.isActive}
            mode={mode}
          />
        </S.Card>
      </CollapsibleSection>

      <CollapsibleSection header={getHeader('Audio')}>
        <S.Card>
          <MediaToggle
            isActive={audio.isActive}
            onChange={audio.onToggle}
            mode={mode}
          />
          <MediaTypeList
            formats={audioFormats}
            selectedFormats={audio.selected}
            onChange={audio.onChange}
            isActive={audio.isActive}
            mode={mode}
          />
        </S.Card>
      </CollapsibleSection>
    </>
  );
};

export default MediaSection;