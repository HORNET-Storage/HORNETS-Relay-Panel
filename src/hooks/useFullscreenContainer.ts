import { useEffect, useState } from 'react';

// Hook to get the appropriate container for popups (modals, dropdowns, etc.)
export const useFullscreenContainer = () => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const updateContainer = () => {
      // Check for fullscreen element first
      const fullscreenElement = document.fullscreenElement ||
                               (document as any).webkitFullscreenElement ||
                               (document as any).mozFullScreenElement ||
                               (document as any).msFullscreenElement;
      
      // When in fullscreen mode, the root element is what becomes fullscreen
      // We need to ensure popups render inside the root element
      if (fullscreenElement) {
        const rootElement = document.getElementById('root');
        // If the root element is fullscreen or contained within the fullscreen element
        if (fullscreenElement === rootElement || fullscreenElement.contains(rootElement)) {
          setContainer(rootElement);
        } else {
          setContainer(fullscreenElement as HTMLElement);
        }
      } else {
        // Not in fullscreen, return null to use default body
        setContainer(null);
      }
    };

    updateContainer();
    
    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', updateContainer);
    document.addEventListener('webkitfullscreenchange', updateContainer);
    document.addEventListener('mozfullscreenchange', updateContainer);
    document.addEventListener('MSFullscreenChange', updateContainer);
    
    // Also check periodically in case the attribute is added dynamically
    const interval = setInterval(updateContainer, 500);
    
    return () => {
      document.removeEventListener('fullscreenchange', updateContainer);
      document.removeEventListener('webkitfullscreenchange', updateContainer);
      document.removeEventListener('mozfullscreenchange', updateContainer);
      document.removeEventListener('MSFullscreenChange', updateContainer);
      clearInterval(interval);
    };
  }, []);

  return container;
};