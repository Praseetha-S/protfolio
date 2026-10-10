import { useState, useEffect, useRef, useCallback } from 'react';

export function useToolkitScroll(categories, isMobile) {
  const [activeCatIdx, setActiveCatIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const sectionRef = useRef(null);
  const totalCategories = categories.length;
  const prevIdxRef = useRef(0);

  const handleScroll = useCallback(() => {
    if (isMobile || !sectionRef.current || totalCategories === 0) return;

    const section = sectionRef.current;
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    const viewportHeight = window.innerHeight;

    const scrollableDistance = sectionHeight - viewportHeight;
    if (scrollableDistance <= 0) return;

    let scrollRatio = 0;
    if (sectionTop <= 0) {
      scrollRatio = Math.min(1, Math.abs(sectionTop) / scrollableDistance);
    }
    
    // Smoothly step category index from 0 to totalCategories - 1
    let catIndex = Math.floor(scrollRatio * totalCategories);
    if (catIndex >= totalCategories) catIndex = totalCategories - 1;
    if (catIndex < 0) catIndex = 0;

    const targetProgress = ((catIndex + 1) / totalCategories) * 100;
    setProgress(targetProgress);

    if (catIndex !== prevIdxRef.current) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveCatIdx(catIndex);
        setIsTransitioning(false);
        prevIdxRef.current = catIndex;
      }, 200);
    }
  }, [totalCategories, isMobile]);

  useEffect(() => {
    if (isMobile) return;
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, isMobile]);

  const handlePrevCategory = () => {
    if (activeCatIdx > 0) {
      jumpToCategory(activeCatIdx - 1);
    }
  };

  const handleNextCategory = () => {
    if (activeCatIdx < totalCategories - 1) {
      jumpToCategory(activeCatIdx + 1);
    }
  };

  const jumpToCategory = (catIdx) => {
    if (catIdx < 0 || catIdx >= totalCategories) return;
    if (isMobile) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveCatIdx(catIdx);
        setIsTransitioning(false);
        prevIdxRef.current = catIdx;
      }, 200);
    } else {
      const section = sectionRef.current;
      if (!section) return;
      const scrollableDistance = section.offsetHeight - window.innerHeight;
      const ratio = catIdx / (totalCategories - 1);
      const targetScroll = section.offsetTop + (scrollableDistance * ratio) + 10;
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return {
    sectionRef,
    activeCatIdx,
    progress,
    isTransitioning,
    handlePrevCategory,
    handleNextCategory,
    jumpToCategory
  };
}
