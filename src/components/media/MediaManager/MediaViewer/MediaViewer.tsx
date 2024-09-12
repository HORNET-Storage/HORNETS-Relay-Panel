import React, { useState } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { MediaFile } from '../MediaManager'; // Assuming you already have this type
import * as S from './MediaViewer.styles';
type MediaViewerProps = {
  visible: boolean;
  onClose: () => void;
  file: MediaFile | null;
  files: MediaFile[];
};

function getMediaTag(file: MediaFile) {
  if (file.type.startsWith('image')) {
    return <S.Image src={file.thumbnail} alt={file.name}/>;
  }
  if (file.type.startsWith('video')) {
    return <S.Video controls src={file.path}  />;
  }
  if (file.type.startsWith('audio')) {
    return <S.Audio controls src={file.path}  />;
  }
  return <S.NotSupported>File type not supported</S.NotSupported>;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ visible, onClose, file, files }) => {
  if (!file) return null;

  const [selectedIndex, setSelectedIndex] = useState(files.indexOf(file));

  return (
    <S.Modal centered={true} open={visible} onCancel={onClose} footer={null} width={800}>
      <Splide aria-label="Media">
        {selectedIndex > 0
          ? // loop through files before the selected file
            // and render a SplideSlide for each file
            files.slice(0, selectedIndex).map((file) => (
              <S.Slide>
                <S.MediaWrapper>{getMediaTag(file)}</S.MediaWrapper>
              </S.Slide>
            ))
          : //loop through all files if file is not apart of files for some reason
            files.map((file) => (
              <S.Slide>
                <S.MediaWrapper>{getMediaTag(file)}</S.MediaWrapper>
              </S.Slide>
            ))}
        <S.Slide>
          <S.MediaWrapper>{getMediaTag(file)}</S.MediaWrapper>
        </S.Slide>
        {selectedIndex < files.length - 1
          ? // loop through files after the selected file
            // and render a SplideSlide for each file
            files.slice(selectedIndex + 1).map((file) => (
              <S.Slide>
                <S.MediaWrapper>{getMediaTag(file)}</S.MediaWrapper>
              </S.Slide>
            ))
          : null}
      </Splide>
    </S.Modal>
  );
};

export default MediaViewer;