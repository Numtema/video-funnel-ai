import { useEffect, useRef } from 'react';

export type NotificationSoundType = 'beep' | 'bell' | 'pop';

const SOUNDS: Record<NotificationSoundType, string> = {
  beep: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCl+zPLTgjMGHm7A7+OZUQ0NVKnn77JfGAg+ltryxnMnBSyBzvLYiTcIGWi77eefTRAMUKfj8LZjHAY4ktfyzHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAKFF605+uoVRQKRp/g8r5sIQQpfszyxHksBSR3x/DdkEAK',
  bell: 'data:audio/wav;base64,UklGRnQFAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YVAFAACAD4SQiI+NjYuJhYV/fn17eXd1c3Fvbm1sa2ppaWdmZWRjYmBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQEBAQEBBQUJDREVGSElKTE1PUFFTVFZXWV1eYGJkZmhqa21vcXN2eXt+gISHjJCUmZ6ipq2ytLm8wsTIy87Q0tbZ3N/j5unr7u/w8/T09fb29/j4+fn5+vn5+fn5+fn4+Pf39vX19PT08vHv7err6unk4t/c2dbT0M7LyMXCv7y5trKupqKdmZSQi4eEgH57eHVzcG5sa2lnZmRjYWBfXl1bWllYV1ZVVFNSU1JRUVBQUFBQUFBQUFFRUlJTU1RVVVZXWFLAAA8AAEAfAQAAABAA',
  pop: 'data:audio/wav;base64,UklGRpQEAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YXAEAACAP4iYoKiwtLi8v8DBwsLCwsHBwL+9vLq4trSysa+trKqqp6WjoJ+cm5iWlJKPjYuJhoSCgH17eXd1c3FvbW1ra2lpaGdmZWRjYmJhYGBfXl5dXV1cW1taWllZWVhYWFhYWFhYWFhYWVlaWltcXF1eX2Bhm5iViYeEgoB+fHp4dnRycG5samlnZWRiYF9dXFpZWFZVU1JRUFBOTk5MTExMTEzMy8vLy8vMzM7Oz9DR0tPU1dbX2drb3d7g4uTm6Oru7/Dy9PX29/j5+vv7/P39/f39/v3+/v7+/v7+/v39/fz8+/v6+fn4+Pb19PPy8O/t7Orq6Ofm5OPh4N7d3NrY19XU0dDP',
};

export const useNotificationSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const loadSound = (soundType: NotificationSoundType) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(SOUNDS[soundType]);
  };

  useEffect(() => {
    // Load default sound
    const savedSound = (localStorage.getItem('notification_sound') || 'beep') as NotificationSoundType;
    loadSound(savedSound);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const play = () => {
    const soundEnabled = localStorage.getItem('notification_sound_enabled') !== 'false';
    if (!soundEnabled || !audioRef.current) return;

    // Reload sound type in case it changed
    const savedSound = (localStorage.getItem('notification_sound') || 'beep') as NotificationSoundType;
    loadSound(savedSound);

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((error) => {
      console.log('Could not play notification sound:', error);
    });
  };

  return { play };
};
