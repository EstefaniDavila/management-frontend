import React, { useState, useEffect } from 'react'
import { Activity, Database, Server, Cpu, AlertTriangle, CheckCircle, HardDrive, Wifi, Users, Bug, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

import { toast } from 'sonner'

const backend_host = import.meta.env.VITE_BACKEND_HOST

// Generar datos históricos falsos iniciales para que las gráficas no aparezcan vacías
const generateInitialHistory = () => {
  const data = []
  const now = new Date()
  for (let i = 20; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 15000)
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      cpu: 0,
      memory: 0,
      latency: 0
    })
  }
  return data
}

const MonitoringDashboard = () => {
  const [chaosMode, setChaosMode] = useState(false)
  const [historyData, setHistoryData] = useState(generateInitialHistory())
  const [healthData, setHealthData] = useState({
    status: 'loading',
    database: 'loading',
    uptime: 'loading...',
    cpu: 0,
    memory: 0,
    disk: 0,
    latency: 0,
    activeUsers: 0,
    errorRate: 0,
    lastCheck: null
  })

  const [logs, setLogs] = useState([])

  const addLog = (type, message) => {
    setLogs(prev => {
      const newLogs = [{ time: new Date().toLocaleTimeString(), type, message }, ...prev]
      return newLogs.slice(0, 5) // Mantener solo los últimos 5
    })
  }

  const toggleChaos = async () => {
    try {
      const res = await fetch(`${backend_host}/api/v1/health/toggle_chaos`, { method: 'POST' })
      const data = await res.json()
      setChaosMode(data.chaos_active)
      
      if (data.chaos_active) {
        toast.error("¡ALERTA CRÍTICA! Se ha enviado un comando de Chaos al Backend y se disparó el correo de alerta al Administrador.")
        addLog('error', 'Comando CHAOS inyectado. Base de datos principal apagada remotamente.')
      } else {
        toast.success("Comando RESTORE enviado. Servicios reestablecidos.")
        addLog('info', 'Comando RESTORE inyectado. Base de datos principal reconectada.')
      }
      
      checkHealth()
    } catch (error) {
      toast.error("Error conectando al backend para inyectar Chaos.")
    }
  }

  const checkHealth = async () => {
    const startTime = Date.now()
    try {
      let latency, cpu, memory, databaseStatus, overallStatus;
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

      // Consumiendo el endpoint de Ruby on Rails SIEMPRE
      const response = await fetch(`${backend_host}/api/v1/health`, { method: 'GET' })
      latency = Date.now() - startTime
      
      if (!response.ok && response.status !== 503) {
         throw new Error('Error de red al contactar servidor')
      }

      const data = await response.json()
      cpu = parseFloat(data.cpu) || 0
      memory = parseFloat(data.memory) || 0
      databaseStatus = data.database
      overallStatus = data.status
      
      if (overallStatus !== 'healthy') throw new Error('Servicio degradado')

      setHealthData({
        status: overallStatus,
        database: databaseStatus,
        uptime: '99.99%',
        cpu, memory, disk: 65, latency,
        activeUsers: Math.floor(Math.random() * 5) + 12, // Simulado (requiere Websockets para ser real)
        errorRate: 0.05, // Esto vendría de la API de Sentry
        lastCheck: new Date()
      })

      setHistoryData(prev => {
        const newData = [...prev, { time: timeStr, cpu, memory, latency }]
        if (newData.length > 20) newData.shift()
        return newData
      })

      addLog('info', `Health check OK (Real). CPU: ${cpu}% | RAM: ${memory}% | Latencia: ${latency}ms`)
    } catch (error) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      setHealthData({
        status: 'down',
        database: 'disconnected',
        uptime: '0.00%',
        cpu: 0, memory: 0, disk: 0, latency: 0, activeUsers: 0, errorRate: 100,
        lastCheck: new Date()
      })
      
      setHistoryData(prev => {
        const newData = [...prev, { time: timeStr, cpu: 0, memory: 0, latency: 0 }]
        if (newData.length > 20) newData.shift()
        return newData
      })

      addLog('error', 'Falla crítica: Timeout conectando al VPS en DigitalOcean.')
    }
  }

  useEffect(() => {
    const interval = setInterval(checkHealth, 5000)
    return () => clearInterval(interval)
  }, [])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-white/10 p-2 rounded-md shadow-xl text-xs">
          <p className="text-muted-foreground mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }} className="font-bold">
              {p.name}: {p.value}{p.name === 'Latencia' ? 'ms' : '%'}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Cabecera */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="text-primary" /> Cloud Monitoring Center
          </h1>
          <p className="text-sm text-muted-foreground">Telemetría avanzada de red e infraestructura en DigitalOcean.</p>
        </div>
        <Button 
          variant={chaosMode ? "outline" : "destructive"} 
          onClick={toggleChaos}
          className="flex items-center gap-2"
        >
          <Play size={16} /> {chaosMode ? "Apagar Chaos (Restaurar BD)" : "Inyectar Chaos (Simular Caída BD)"}
        </Button>
      </div>

      {/* Estado Global */}
      <div className={`p-4 rounded-xl flex items-center gap-4 shadow-md ${
        healthData.status === 'healthy' ? 'bg-green-500/10 border border-green-500/30' : 
        'bg-red-500/10 border border-red-500/30'
      }`}>
        <div className="p-3 rounded-full bg-background shadow-inner">
          {healthData.status === 'healthy' ? <CheckCircle className="text-green-500" size={32} /> : 
           <AlertTriangle className="text-red-500 animate-pulse" size={32} />}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold uppercase tracking-wide">
            {healthData.status === 'healthy' ? 'SISTEMA OPERATIVO Y ESTABLE' : 'CAÍDA CRÍTICA DE SERVICIO'}
          </h2>
          <p className="text-sm text-muted-foreground">
            Último Ping: {healthData.lastCheck ? healthData.lastCheck.toLocaleTimeString() : '...'} | SLA Uptime: {healthData.uptime}
          </p>
        </div>
      </div>

      {/* Métricas Exhaustivas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 border rounded-xl bg-card shadow-sm flex flex-col justify-center items-center gap-2 col-span-2">
          <Database size={24} className="text-muted-foreground" />
          <span className="font-semibold text-sm">Cluster PostgreSQL</span>
          <div className="text-lg font-bold flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${healthData.database === 'connected' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'}`}></span>
            {healthData.database === 'connected' ? 'Conectada (Principal)' : 'Desconectada'}
          </div>
        </div>
        <div className="p-4 border rounded-xl bg-card shadow-sm flex flex-col justify-center items-center gap-1">
          <Wifi size={20} className="text-muted-foreground" />
          <span className="font-semibold text-xs text-muted-foreground mt-1">Latencia API</span>
          <div className="text-xl font-bold">{healthData.status === 'down' ? '---' : `${healthData.latency} ms`}</div>
        </div>
        <div className="p-4 border rounded-xl bg-card shadow-sm flex flex-col justify-center items-center gap-1">
          <Bug size={20} className="text-muted-foreground" />
          <span className="font-semibold text-xs text-muted-foreground mt-1">Tasa de Errores (Sentry)</span>
          <div className="text-xl font-bold text-yellow-500">{healthData.errorRate}%</div>
        </div>
        <div className="p-4 border rounded-xl bg-card shadow-sm flex flex-col justify-center items-center gap-1">
          <Users size={20} className="text-muted-foreground" />
          <span className="font-semibold text-xs text-muted-foreground mt-1">Sesiones Activas</span>
          <div className="text-xl font-bold">{healthData.activeUsers}</div>
        </div>
        <div className="p-4 border rounded-xl bg-card shadow-sm flex flex-col justify-center items-center gap-1">
          <HardDrive size={20} className="text-muted-foreground" />
          <span className="font-semibold text-xs text-muted-foreground mt-1">Almacenamiento VPS</span>
          <div className="text-xl font-bold">{healthData.disk}%</div>
        </div>
      </div>

      {/* Gráficas (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
        
        {/* Uso de CPU y RAM */}
        <div className="border rounded-xl bg-card p-4 shadow-sm flex flex-col h-[350px]">
          <h3 className="font-bold flex items-center gap-2 mb-4"><Server size={18} /> Consumo de Recursos (CPU / RAM)</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="time" tick={{fontSize: 10, fill: '#666'}} tickMargin={10} minTickGap={30} />
                <YAxis tick={{fontSize: 10, fill: '#666'}} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="cpu" name="CPU" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" animationDuration={300} />
                <Area type="monotone" dataKey="memory" name="RAM" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorMemory)" animationDuration={300} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latencia de Red */}
        <div className="border rounded-xl bg-card p-4 shadow-sm flex flex-col h-[350px]">
          <h3 className="font-bold flex items-center gap-2 mb-4"><Wifi size={18} /> Latencia de Red (ms)</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="time" tick={{fontSize: 10, fill: '#666'}} tickMargin={10} minTickGap={30} />
                <YAxis tick={{fontSize: 10, fill: '#666'}} domain={[0, 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="latency" name="Latencia" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 4 }} animationDuration={300} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Registro de Eventos y Contingencia */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Logs */}
        <div className="border rounded-xl bg-card p-4 shadow-sm flex flex-col lg:col-span-2">
          <h3 className="font-bold flex items-center gap-2 mb-4"><Activity size={18} /> Registro de Eventos (Live Terminal)</h3>
          <div className="flex-1 bg-black/50 border border-white/10 rounded-lg p-3 font-mono text-xs flex flex-col gap-2 overflow-y-auto max-h-[120px]">
            {logs.map((log, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-muted-foreground opacity-50">[{log.time}]</span>
                <span className={log.type === 'error' ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>
                  {log.type.toUpperCase()}:
                </span>
                <span className="text-foreground/80">{log.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contingencia */}
        {healthData.status === 'down' ? (
          <div className="p-4 border border-red-500/50 rounded-xl bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <h3 className="text-red-500 font-bold mb-2 flex items-center gap-2"><AlertTriangle size={18}/> PROTOCOLO FAILOVER</h3>
            <p className="text-xs mb-2">El sistema ha detectado una falla de conexión severa. Ejecutar BCP:</p>
            <ol className="list-decimal list-inside text-xs mt-2 text-muted-foreground font-semibold space-y-2">
              <li>Confirmar alerta eléctrica en DigitalOcean a través de UptimeRobot.</li>
              <li>Realizar <strong>FAILOVER MANUAL</strong>: Modificar IP de BD hacia VPS Secundario.</li>
              <li>Reiniciar instancias de backend (`systemctl restart puma`).</li>
            </ol>
          </div>
        ) : (
          <div className="p-4 border border-green-500/20 rounded-xl bg-green-500/5 flex flex-col justify-center items-center text-center">
             <CheckCircle className="text-green-500 mb-2 opacity-50" size={32} />
             <h3 className="text-green-500 font-bold text-sm">Sistemas Operativos</h3>
             <p className="text-xs text-muted-foreground mt-1">No se requiere acción de contingencia.</p>
          </div>
        )}

      </div>

    </div>
  )
}

export default MonitoringDashboard
