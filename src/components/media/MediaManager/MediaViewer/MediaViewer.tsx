import React, { useState, useEffect } from 'react';
import { Splide } from '@splidejs/react-splide';
import { MediaFile } from '../MediaManager';
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
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Update the selected index when the file changes
  useEffect(() => {
    if (file && files.length > 0) {
      const index = files.findIndex(f => f.id === file.id);
      setSelectedIndex(index >= 0 ? index : 0);
    }
  }, [file, files]);

  if (!file) return null;

  const splideOptions = {
    start: selectedIndex,
    rewind: true,
    perPage: 1,
    perMove: 1,
    gap: '1rem',
    pagination: files.length > 1,
    arrows: files.length > 1,
  };

  function getMediaTag(file: MediaFile) {
    // Ensure we have a valid URL before trying to display media
    const validSrc = file.path && file.path.trim() !== '' ? file.path : (file.thumbnail || '');
    
    if (!validSrc) {
      return <S.NotSupported $is4kScreen={is4k}>Media source not available</S.NotSupported>;
    }

    if (file.type.startsWith('image')) {
      return <S.Image src={validSrc} alt={file.name} onError={(e) => {
        // If image fails to load, show error text
        e.currentTarget.style.display = 'none';
        e.currentTarget.parentElement?.appendChild(
          Object.assign(document.createElement('div'), {
            textContent: 'Image failed to load',
            style: 'color: var(--text-light-color); margin-top: 1rem;'
          })
        );
      }} />;
    }
    
    if (file.type.startsWith('video')) {
      return <S.Video controls src={validSrc} />;
    }
    
    if (file.type.startsWith('audio')) {
      return <S.Audio controls src={validSrc} />;
    }
    
    return <S.NotSupported $is4kScreen={is4k}>File type not supported</S.NotSupported>;
  }

  return (
    <S.Modal 
      $is4kScreen={is4k} 
      centered={true} 
      open={visible} 
      onCancel={onClose} 
      footer={null} 
      width={800}
      destroyOnClose={true}
    >
      <Splide options={splideOptions} aria-label="Media">
        {files.map((fileItem, index) => (
          <S.Slide key={`file-${fileItem.id || index}`}>
            <S.MediaWrapper>
              {getMediaTag(fileItem)}
              <S.MediaDetails $is4kScreen={is4k}>{fileItem.name}</S.MediaDetails>
            </S.MediaWrapper>
          </S.Slide>
        ))}
      </Splide>
    </S.Modal>
  );
};

export default MediaViewer;
