import { useState, useMemo } from 'react';
import { Droplet, AlertCircle, TrendingUp, MapPin } from 'lucide-react';
import { mockTanks, generateSensorReadings } from '../utils/mockData';
import { SensorReading, WaterTank } from '../types';
import location1 from '../resources/location1.png';

export function Dashboard() {
  const [selectedTankId, setSelectedTankId] = useState(mockTanks[0].id);
  const selectedTank = mockTanks.find(t => t.id === selectedTankId)!;
  const readings = useMemo(() => generateSensorReadings(selectedTankId, 24), [selectedTankId]);
  const latestReading = readings[readings.length - 1];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getParameterStatus = (value: number, param: string) => {
    const thresholds: Record<string, { warning: [number, number], critical: [number, number] }> = {
      ph: { warning: [6.5, 8.5], critical: [6.0, 9.0] },
      turbidity: { warning: [0, 5], critical: [0, 10] },
      tds: { warning: [0, 500], critical: [0, 1000] },
      temperature: { warning: [10, 30], critical: [5, 35] },
    };

    const t = thresholds[param];
    if (value < t.critical[0] || value > t.critical[1]) return 'text-red-600 font-semibold';
    if (value < t.warning[0] || value > t.warning[1]) return 'text-orange-600 font-semibold';
    return 'text-green-600 font-semibold';
  };

  const calculateTrend = (data: SensorReading[], key: keyof SensorReading) => {
    if (data.length < 2) return 0;
    const recent = data.slice(-6).map(r => r[key] as number);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const prevAvg = data.slice(-12, -6).map(r => r[key] as number).reduce((a, b) => a + b, 0) / 6;
    return ((avg - prevAvg) / prevAvg) * 100;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Real-time water quality monitoring</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedTankId}
            onChange={(e) => setSelectedTankId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {mockTanks.map(tank => (
              <option key={tank.id} value={tank.id}>{tank.name} - {tank.locationName}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="pH Level"
          value={latestReading.ph.toFixed(2)}
          unit=""
          trend={calculateTrend(readings, 'ph')}
          status={getParameterStatus(latestReading.ph, 'ph')}
          icon={Droplet}
        />
        <MetricCard
          title="Turbidity"
          value={latestReading.turbidity.toFixed(2)}
          unit="NTU"
          trend={calculateTrend(readings, 'turbidity')}
          status={getParameterStatus(latestReading.turbidity, 'turbidity')}
          icon={AlertCircle}
        />
        <MetricCard
          title="TDS"
          value={latestReading.tds.toFixed(0)}
          unit="ppm"
          trend={calculateTrend(readings, 'tds')}
          status={getParameterStatus(latestReading.tds, 'tds')}
          icon={Droplet}
        />
        <MetricCard
          title="Temperature"
          value={latestReading.temperature.toFixed(1)}
          unit="°C"
          trend={calculateTrend(readings, 'temperature')}
          status={getParameterStatus(latestReading.temperature, 'temperature')}
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tank Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium">{selectedTank.locationName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Capacity:</span>
              <span className="font-medium">{selectedTank.capacityLiters.toLocaleString()} L</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <span className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(selectedTank.status)}`}></span>
                <span className="font-medium capitalize">{selectedTank.status}</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Risk Level:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border capitalize ${getRiskColor(selectedTank.riskLevel)}`}>
                {selectedTank.riskLevel}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Installed:</span>
              <span className="font-medium">{selectedTank.installationDate.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin size={20} className="mr-2" />
            Location Map
          </h3>
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <img 
              src={location1} 
              alt="Location map"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2 bg-white/80 p-3 rounded-lg backdrop-blur-sm">
                <MapPin size={48} className="text-blue-600 mx-auto" />
                <div className="font-medium text-gray-900">{selectedTank.locationName}</div>
                <div className="text-sm text-gray-600">
                  {selectedTank.latitude.toFixed(4)}, {selectedTank.longitude.toFixed(4)}
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border capitalize ${getRiskColor(selectedTank.riskLevel)}`}>
                  {selectedTank.riskLevel} Risk
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4 space-y-2">
              {mockTanks.map(tank => (
                <button
                  key={tank.id}
                  onClick={() => setSelectedTankId(tank.id)}
                  className={`block w-8 h-8 rounded-full border-2 ${
                    tank.id === selectedTankId ? 'border-blue-600' : 'border-white'
                  } ${
                    tank.riskLevel === 'critical' ? 'bg-red-500' :
                    tank.riskLevel === 'high' ? 'bg-orange-500' :
                    tank.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  } hover:scale-110 transition-transform`}
                  title={tank.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">24-Hour Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TrendChart data={readings} 
                      parameter="ph" 
                      label="pH Level" 
                      color="blue" 
                      yAxisBounds={{ lower: 6.0, upper: 9.0 }}
                      setpoint={6.5} />
          <TrendChart data={readings} 
                      parameter="turbidity" 
                      label="Turbidity (NTU)" 
                      color="orange" 
                      yAxisBounds={{ lower: 0, upper: 10 }}
                      setpoint={5} />
          <TrendChart data={readings} 
                      parameter="tds" 
                      label="TDS (ppm)" 
                      color="green"
                      yAxisBounds={{ lower: 0, upper: 1000 }}
                      setpoint={500} />
          <TrendChart data={readings} 
                      parameter="temperature" 
                      label="Temperature (°C)" 
                      color="red" 
                      yAxisBounds={{ lower: 5, upper: 35 }}
                      setpoint={30} />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, unit, trend, status, icon: Icon }: any) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 text-sm">{title}</span>
        <Icon size={20} className="text-gray-400" />
      </div>
      <div className={`text-3xl font-bold ${status} mb-1`}>
        {value} <span className="text-lg">{unit}</span>
      </div>
      <div className={`text-sm flex items-center ${trend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
        <TrendingUp size={16} className={trend < 0 ? 'rotate-180' : ''} />
        <span className="ml-1">{Math.abs(trend).toFixed(1)}% vs 6h ago</span>
      </div>
    </div>
  );
}

type TrendChartProps = {
  data: SensorReading[];
  parameter: keyof SensorReading;
  label: string;
  color: string;
  yAxisBounds: {
    lower: number;
    upper: number;
  };
  setpoint: number;
};

function TrendChart({ data, parameter, label, color, yAxisBounds, setpoint }: TrendChartProps) {
  const values = data.map(r => r[parameter] as number);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const colorMap: Record<string, string> = {
    blue: 'stroke-blue-600',
    orange: 'stroke-orange-600',
    green: 'stroke-green-600',
    red: 'stroke-red-600',
  };

  // Get benchmark values based on parameter
  const getBenchmarkValue = () => {
    const thresholds: Record<string, number> = {
      ph: 8.5,          // Upper limit for pH
      turbidity: 5,     // Upper limit for turbidity
      tds: 500,         // Upper limit for TDS
      temperature: 30,   // Upper limit for temperature
    };
    return thresholds[parameter] || max;
  };

  // Calculate benchmark line position
  const benchmarkValue = getBenchmarkValue();
  const benchmarkY = 100 - ((benchmarkValue - min) / range) * 80 - 10;

  // Generate y-axis markers
  const yAxisMarkers = [
    yAxisBounds.upper,
    (yAxisBounds.upper + yAxisBounds.lower) / 2,
    yAxisBounds.lower
  ];

  // Generate timestamp markers (every 2 hours)
  const timeMarkers = [];
  const hourGap = 2;
  const totalHours = 24;
  for (let i = 0; i <= totalHours; i += hourGap) {
    const x = (i / totalHours) * 400;
    timeMarkers.push(x);
  }

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-2">{label}</h4>
      <div className="flex">
        <div className="w-10 flex flex-col justify-between pr-2 text-xs text-gray-500">
          {yAxisMarkers.map((value, i) => (
            <span key={i}>{value}</span>
          ))}
        </div>

        <div className="flex-1">
          <svg viewBox="0 0 400 100" className="w-full h-24">
            {/* Grid lines for time markers */}
            {timeMarkers.map((x, i) => (
              <line
                key={`grid-${i}`}
                x1={x}
                y1={10}
                x2={x}
                y2={90}
                className="stroke-gray-200 stroke-[0.5]"
              />
            ))}

            {/* Benchmark line */}
            <line
              x1={0}
              y1={benchmarkY}
              x2={400}
              y2={benchmarkY}
              className="stroke-red-400 stroke-[1] stroke-dasharray-2"
            />

            <polyline
              fill="none"
              className={`${colorMap[color]} stroke-2`}
              points={values.map((v, i) => {
                const x = (i / (values.length - 1)) * 400;
                const y = 100 - ((v - min) / range) * 80 - 10;
                return `${x},${y}`;
              }).join(' ')}
            />
            {values.map((v, i) => {
              const x = (i / (values.length - 1)) * 400;
              const y = 100 - ((v - min) / range) * 80 - 10;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="2"
                  className={colorMap[color].replace('stroke', 'fill')}
                />
              );
            })}
          </svg>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{data[0].timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        {timeMarkers.slice(1, -1).map((_, i) => (
          <span key={`time-${i}`} className="text-gray-400">
            {new Date(data[0].timestamp.getTime() + (i + 1) * hourGap * 60 * 60 * 1000)
              .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        ))}
        <span>{data[data.length - 1].timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
}
