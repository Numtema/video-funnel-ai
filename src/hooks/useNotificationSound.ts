import { useEffect, useRef } from 'react';

export const useNotificationSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for notification sound
    // Using a simple beep sound encoded as data URL
    const notificationSound = new Audio(
      'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCl+zPLTgjMGHm7A7+OZUQ0NVKnn77JfGAg+ltryxnMnBSyBzvLYiTcIGWi77eefTRAMUKfj8LZjHAY4ktfyzHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAK'
    );
    audioRef.current = notificationSound;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.log('Could not play notification sound:', error);
      });
    }
  };

  return { play };
};
