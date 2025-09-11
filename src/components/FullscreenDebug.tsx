import React, { useEffect, useState } from 'react';
import { useFullscreenContainer } from '@app/hooks/useFullscreenContainer';

export const FullscreenDebug: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenElement, setFullscreenElement] = useState<string>('none');
  const container = useFullscreenContainer();

  useEffect(() => {
    const checkFullscreen = () => {
      const element = document.fullscreenElement || 
                     (document as any).webkitFullscreenElement ||
                     (document as any).mozFullScreenElement ||
                     (document as any).msFullscreenElement;
      
      setIsFullscreen(!!element);
      if (element) {
        setFullscreenElement(element.id || element.tagName);
      } else {
        setFullscreenElement('none');
      }
    };

    checkFullscreen();
    
    document.addEventListener('fullscreenchange', checkFullscreen);
    document.addEventListener('webkitfullscreenchange', checkFullscreen);
    document.addEventListener('mozfullscreenchange', checkFullscreen);
    document.addEventListener('msfullscreenchange', checkFullscreen);

    const interval = setInterval(checkFullscreen, 500);

    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen);
      document.removeEventListener('webkitfullscreenchange', checkFullscreen);
      document.removeEventListener('mozfullscreenchange', checkFullscreen);
      document.removeEventListener('msfullscreenchange', checkFullscreen);
      clearInterval(interval);
    };
  }, []);

  const debugStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    padding: '10px',
    background: 'rgba(0, 0, 0, 0.8)',
    color: '#00ff00',
    borderRadius: '5px',
    zIndex: 2147483647,
    fontSize: '12px',
    fontFamily: 'monospace'
  };

  return (
    <div style={debugStyle}>
      <div>Fullscreen: {isFullscreen ? 'YES' : 'NO'}</div>
      <div>Element: {fullscreenElement}</div>
      <div>Container: {container ? container.id || 'element' : 'null'}</div>
      <div>Root exists: {document.getElementById('root') ? 'YES' : 'NO'}</div>
    </div>
  );
};