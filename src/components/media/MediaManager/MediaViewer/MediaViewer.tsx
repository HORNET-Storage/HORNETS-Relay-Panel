import React, { useState } from 'react';
import { Splide } from '@splidejs/react-splide';
import { MediaFile } from '../MediaManager'; // Assuming you already have this type
import * as S from './MediaViewer.styles';
import { useResponsive } from '@app/hooks/useResponsive';

type MediaViewerProps = {
  visible: boolean;
  onClose: () => void;
  file: MediaFile | null;
  files: MediaFile[];
};

const MediaViewer: React.FC<MediaViewerProps> = ({ visible, onClose, file, files }) => {
  const { is4k } = useResponsive();
  const [selectedIndex, setSelectedIndex] = useState(file ? files.indexOf(file) : 0);

  if (!file) return null;

  const splideOptions = {
    start: selectedIndex >= 0 ? selectedIndex : 0,
  };

  function getMediaTag(file: MediaFile) {
    if (file.type.startsWith('image')) {
      return <S.Image src={file.thumbnail} alt={file.name} />;
    }
    if (file.type.startsWith('video')) {
      return <S.Video controls src={file.path} />;
    }
    if (file.type.startsWith('audio')) {
      return <S.Audio controls src={file.path} />;
    }
    return <S.NotSupported $is4kScreen={is4k}>File type not supported</S.NotSupported>;
  }

  return (
    <S.Modal $is4kScreen={is4k} centered={true} open={visible} onCancel={onClose} footer={null} width={800}>
      <Splide options={splideOptions} aria-label="Media">
        {selectedIndex > 0
          ? // loop through files before the selected file
            files.slice(0, selectedIndex).map((file, index) => (
              <S.Slide key={`before-${file.path}-${index}`}>
                <S.MediaWrapper>
                  {getMediaTag(file)}
                  <S.MediaDetails $is4kScreen={is4k}>{file.name}</S.MediaDetails>
                </S.MediaWrapper>
              </S.Slide>
            ))
          : files.map((file, index) => (
              <S.Slide key={`all-${file.path}-${index}`}>
                <S.MediaWrapper>
                  {getMediaTag(file)}
                  <S.MediaDetails $is4kScreen={is4k}>{file.name}</S.MediaDetails>
                </S.MediaWrapper>
              </S.Slide>
            ))}
        <S.Slide key={`current-${file.path}`}>
          <S.MediaWrapper>
            {getMediaTag(file)}
            <S.MediaDetails $is4kScreen={is4k}>{file.name}</S.MediaDetails>
          </S.MediaWrapper>
        </S.Slide>
        {selectedIndex < files.length - 1
          ? files.slice(selectedIndex + 1).map((file, index) => (
              <S.Slide key={`after-${file.path}-${index}`}>
                <S.MediaWrapper>
                  {getMediaTag(file)}
                  <S.MediaDetails $is4kScreen={is4k}>{file.name}</S.MediaDetails>
                </S.MediaWrapper>
              </S.Slide>
            ))
          : null}
      </Splide>
    </S.Modal>
  );
};

export default MediaViewer;