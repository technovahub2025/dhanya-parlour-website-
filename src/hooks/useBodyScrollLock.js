import { useEffect } from 'react';

let bodyScrollLockCount = 0;

export default function useBodyScrollLock(enabled) {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    bodyScrollLockCount += 1;
    document.body.classList.add('no-scroll');

    return () => {
      bodyScrollLockCount = Math.max(0, bodyScrollLockCount - 1);
      if (bodyScrollLockCount === 0) {
        document.body.classList.remove('no-scroll');
      }
    };
  }, [enabled]);
}
