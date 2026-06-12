import React, { Profiler } from 'react';

// Inicializar el almacenamiento global para el reporte
if (!window.__PERFORMANCE_METRICS__) {
  window.__PERFORMANCE_METRICS__ = {};
  
  window.printPerformanceReport = () => {
    const report = Object.keys(window.__PERFORMANCE_METRICS__).map(id => {
      const data = window.__PERFORMANCE_METRICS__[id];
      return {
        'Componente / Página': id,
        'Renders Totales': data.count,
        'Tiempo Promedio (ms)': (data.totalTime / data.count).toFixed(2),
        'Último Render (ms)': data.lastTime.toFixed(2)
      };
    });
    
    console.log("%c📊 Reporte General de Rendimiento del Frontend", "color: #4CAF50; font-size: 16px; font-weight: bold;");
    console.table(report);
    return "Reporte generado para tu presentación.";
  };
}

const RenderProfiler = ({ id, children }) => {
  const onRenderCallback = (id, phase, actualDuration) => {
    // Agregar a la métrica global
    if (!window.__PERFORMANCE_METRICS__[id]) {
      window.__PERFORMANCE_METRICS__[id] = { count: 0, totalTime: 0, lastTime: 0 };
    }
    window.__PERFORMANCE_METRICS__[id].count += 1;
    window.__PERFORMANCE_METRICS__[id].totalTime += actualDuration;
    window.__PERFORMANCE_METRICS__[id].lastTime = actualDuration;
  };

  return (
    <Profiler id={id} onRender={onRenderCallback}>
      {children}
    </Profiler>
  );
};

export default RenderProfiler;
