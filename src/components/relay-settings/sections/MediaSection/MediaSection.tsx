// src/components/relay-settings/sections/MediaSection/MediaSection.tsx

import React from 'react';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { CollapsibleSection } from '../../shared/CollapsibleSection/CollapsibleSection';
import { MediaTypeList } from './components/MediaTypeList';
import { MediaToggle } from './components/MediaToggle';
import { FileSizeLimitInput } from './components/FileSizeLimitInput';

export interface MediaSectionProps {
  photos: {
    selected: string[];
    isActive: boolean;
    maxSizeMB: number;
    onChange: (values: string[]) => void;
    onToggle: (checked: boolean) => void;
    onMaxSizeChange: (size: number) => void;
  };
  videos: {
    selected: string[];
    isActive: boolean;
    maxSizeMB: number;
    onChange: (values: string[]) => void;
    onToggle: (checked: boolean) => void;
    onMaxSizeChange: (size: number) => void;
  };
  audio: {
    selected: string[];
    isActive: boolean;
    maxSizeMB: number;
    onChange: (values: string[]) => void;
    onToggle: (checked: boolean) => void;
    onMaxSizeChange: (size: number) => void;
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
  photos,
  videos,
  audio,
}) => {
  return (
    <>
      <CollapsibleSection header="Photo Extensions">
        <S.Card>
          <MediaToggle
            isActive={photos.isActive}
            onChange={photos.onToggle}
          />
          <MediaTypeList
            formats={imageFormats}
            selectedFormats={photos.selected}
            onChange={photos.onChange}
            isActive={photos.isActive}
          />
          <FileSizeLimitInput
            label="Maximum Photo Size"
            value={photos.maxSizeMB}
            onChange={photos.onMaxSizeChange}
            min={1}
            max={1000}
            disabled={!photos.isActive}
          />
        </S.Card>
      </CollapsibleSection>

      <CollapsibleSection header="Video Extensions">
        <S.Card>
          <MediaToggle
            isActive={videos.isActive}
            onChange={videos.onToggle}
          />
          <MediaTypeList
            formats={videoFormats}
            selectedFormats={videos.selected}
            onChange={videos.onChange}
            isActive={videos.isActive}
          />
          <FileSizeLimitInput
            label="Maximum Video Size"
            value={videos.maxSizeMB}
            onChange={videos.onMaxSizeChange}
            min={1}
            max={5000}
            disabled={!videos.isActive}
          />
        </S.Card>
      </CollapsibleSection>

      <CollapsibleSection header="Audio Extensions">
        <S.Card>
          <MediaToggle
            isActive={audio.isActive}
            onChange={audio.onToggle}
          />
          <MediaTypeList
            formats={audioFormats}
            selectedFormats={audio.selected}
            onChange={audio.onChange}
            isActive={audio.isActive}
          />
          <FileSizeLimitInput
            label="Maximum Audio Size"
            value={audio.maxSizeMB}
            onChange={audio.onMaxSizeChange}
            min={1}
            max={500}
            disabled={!audio.isActive}
          />
        </S.Card>
      </CollapsibleSection>
    </>
  );
};

export default MediaSection;
