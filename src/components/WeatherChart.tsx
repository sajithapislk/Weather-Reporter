import React from 'react';

type MetricType = 'temperature' | 'precipitation' | 'wind';

interface WeatherChartProps {
  selectedMetric: MetricType;
  hourlyData: {
    temperature: number[];
    precipitation: number[];
    wind: number[];
  };
  setSelectedMetric: (metric: MetricType) => void;
}

export const WeatherChart: React.FC<WeatherChartProps> = ({
  selectedMetric,
  hourlyData,
  setSelectedMetric,
}) => {
  const getChartConfig = () => {
    switch (selectedMetric) {
      case 'precipitation':
        return { 
          title: 'Precipitation', 
          unit: 'mm', 
          strokeColor: '#3B82F6', 
          pointColor: '#3B82F6', 
          textColor: '#3B82F6',
          scale: 10
        };
      case 'wind':
        return { 
          title: 'Wind Speed', 
          unit: 'km/h', 
          strokeColor: '#10B981', 
          pointColor: '#10B981', 
          textColor: '#10B981',
          scale: 3 
        };
      case 'temperature':
      default:
        return { 
          title: 'Temperature', 
          unit: '°C', 
          strokeColor: '#FCD34D', 
          pointColor: '#FCD34D', 
          textColor: '#FCD34D',
          scale: 3 
        };
    }
  };

  const chartConfig = getChartConfig();
  const chartData = hourlyData[selectedMetric];
  const hours = ['2 am', '5 am', '8 am', '11 am', '2 pm', '5 pm', '8 pm', '11 pm'];

  const chartHeight = 120;
  const chartWidth = 800;
  const pointSpacing = chartWidth / (chartData.length - 1);

  const getYPosition = (value: number) => {
    const scaledValue = value * chartConfig.scale;
    return chartHeight - scaledValue;
  };

  const getPathData = () => {
    return chartData
      .map((value, index) => `${index === 0 ? 'M' : 'L'} ${index * pointSpacing},${getYPosition(value)}`)
      .join(' ');
  };

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">{chartConfig.title}</h3>
        <div className="flex gap-4 text-sm">
          <button
            onClick={() => setSelectedMetric('temperature')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              selectedMetric === 'temperature'
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Temperature
          </button>
          <button
            onClick={() => setSelectedMetric('precipitation')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              selectedMetric === 'precipitation'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Precipitation
          </button>
          <button
            onClick={() => setSelectedMetric('wind')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              selectedMetric === 'wind'
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Wind
          </button>
        </div>
      </div>

      <div className="relative h-32 mb-4">
        <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={chartConfig.strokeColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={chartConfig.strokeColor} stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 30, 60, 90, 120].map((y) => (
            <line 
              key={y} 
              x1="0" 
              y1={y} 
              x2={chartWidth} 
              y2={y} 
              stroke="rgba(255,255,255,0.1)" 
              strokeWidth="1" 
            />
          ))}

          <path
            d={`${getPathData()} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`}
            fill="url(#chartGradient)"
          />

          <path
            d={getPathData()}
            fill="none"
            stroke={chartConfig.strokeColor}
            strokeWidth="3"
            className="drop-shadow-lg"
          />

          {chartData.map((value, index) => (
            <g key={index}>
              <circle
                cx={index * pointSpacing}
                cy={getYPosition(value)}
                r="4"
                fill={chartConfig.pointColor}
                className="drop-shadow-lg"
              />
              <text
                x={index * pointSpacing}
                y={getYPosition(value) - 10}
                textAnchor="middle"
                fill={chartConfig.textColor}
                className="text-sm font-medium"
              >
                {value.toFixed(1)} {chartConfig.unit}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        {hours.map((time, index) => (
          <span key={index}>{time}</span>
        ))}
      </div>
    </div>
  );
};