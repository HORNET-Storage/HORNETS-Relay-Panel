import { useEffect } from 'react';
import { ConfigProvider } from 'antd';

export const useFullscreenModalFix = () => {
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = document.fullscreenElement !== null;
      
      // Configure Ant Design to render modals in the correct container
      ConfigProvider.config({
        getPopupContainer: () => {
          // If in fullscreen, append to the fullscreen element
          // Otherwise, append to body as normal
          return isFullscreen && document.fullscreenElement 
            ? document.fullscreenElement as HTMLElement
            : document.body;
        },
      });
    };

    // Set initial state
    handleFullscreenChange();

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);
};