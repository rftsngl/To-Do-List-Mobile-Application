/**
 * Performance Monitoring Utilities
 * FPS tracking, memory usage, render timing
 */

import { InteractionManager } from 'react-native';

// Performance metrics interface
interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  timestamp: number;
}

// Performance logger
class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private frameCount = 0;
  private lastFrameTime = performance.now();
  private fpsInterval: NodeJS.Timeout | null = null;
  private currentFPS = 60;

  // Start monitoring
  start() {
    this.startFPSMonitoring();
    console.log('[Performance] Monitoring started');
  }

  // Stop monitoring
  stop() {
    if (this.fpsInterval) {
      clearInterval(this.fpsInterval);
      this.fpsInterval = null;
    }
    console.log('[Performance] Monitoring stopped');
  }

  // FPS monitoring
  private startFPSMonitoring() {
    this.fpsInterval = setInterval(() => {
      const now = performance.now();
      const deltaTime = now - this.lastFrameTime;
      this.frameCount++;

      // Calculate FPS every second
      if (deltaTime >= 1000) {
        this.currentFPS = Math.round((this.frameCount * 1000) / deltaTime);
        this.frameCount = 0;
        this.lastFrameTime = now;

        // Log if FPS drops below 55
        if (this.currentFPS < 55) {
          console.warn(`[Performance] Low FPS detected: ${this.currentFPS}`);
        }

        // Store metric
        this.addMetric({
          fps: this.currentFPS,
          memoryUsage: this.getMemoryUsage(),
          renderTime: deltaTime,
          timestamp: now,
        });
      }
    }, 100);
  }

  // Get memory usage (estimated)
  private getMemoryUsage(): number {
    // React Native doesn't expose memory API directly
    // This is a placeholder for future implementation
    return 0;
  }

  // Add performance metric
  private addMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric);

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }
  }

  // Get current FPS
  getCurrentFPS(): number {
    return this.currentFPS;
  }

  // Get performance summary
  getSummary() {
    if (this.metrics.length === 0) {
      return null;
    }

    const fps = this.metrics.map(m => m.fps);
    const avgFPS = fps.reduce((a, b) => a + b, 0) / fps.length;
    const minFPS = Math.min(...fps);
    const maxFPS = Math.max(...fps);

    return {
      avgFPS: Math.round(avgFPS),
      minFPS,
      maxFPS,
      sampleCount: this.metrics.length,
      issues: fps.filter(f => f < 55).length,
    };
  }

  // Log performance summary
  logSummary() {
    const summary = this.getSummary();
    if (summary) {
      console.log('[Performance Summary]', {
        'Average FPS': summary.avgFPS,
        'Min FPS': summary.minFPS,
        'Max FPS': summary.maxFPS,
        'Low FPS occurrences': summary.issues,
        'Samples': summary.sampleCount,
      });
    }
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions for measuring specific operations
export const measureRender = (componentName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (renderTime > 16) { // More than 1 frame at 60fps
      console.warn(`[Performance] Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
  };
};

// Measure async operations
export const measureAsync = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`[Performance] ${operationName}: ${duration.toFixed(2)}ms`);
    
    if (duration > 100) {
      console.warn(`[Performance] Slow async operation: ${operationName}`);
    }
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.error(`[Performance] Failed operation ${operationName}: ${duration.toFixed(2)}ms`, error);
    throw error;
  }
};

// Measure interaction responsiveness
export const measureInteraction = (interactionName: string) => {
  const startTime = performance.now();
  
  return InteractionManager.runAfterInteractions(() => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`[Performance] Interaction ${interactionName}: ${duration.toFixed(2)}ms`);
    
    if (duration > 100) {
      console.warn(`[Performance] Slow interaction: ${interactionName}`);
    }
  });
};

// React component performance hook
export const usePerformanceMonitor = (componentName: string) => {
  const measureRenderTime = () => measureRender(componentName);
  
  return {
    measureRender: measureRenderTime,
    getCurrentFPS: () => performanceMonitor.getCurrentFPS(),
    logSummary: () => performanceMonitor.logSummary(),
  };
};
