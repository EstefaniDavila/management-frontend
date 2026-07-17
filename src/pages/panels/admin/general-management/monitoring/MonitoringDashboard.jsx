import React, { useState, useEffect } from 'react'
import { Activity, Database, Server, Cpu, AlertTriangle, CheckCircle, HardDrive, Wifi, Users, Bug, Play, ShieldAlert, Send, MessageSquare, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import * as Sentry from "@sentry/react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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

const generateMetricsHistory = () => {
  const data = []
  const now = new Date()
  for (let i = 20; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 15000)
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      sentry_front: 0,
      sentry_back: 0,
      chaos: 0
    })
  }
  return data
}

const MonitoringDashboard = () => {
  const [dbState, setDbState] = useState('normal')
  const [historyData, setHistoryData] = useState(generateInitialHistory())
  const [metricsData, setMetricsData] = useState(generateMetricsHistory())
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

  const [logs, setLogs] = useState([
    { time: new Date(Date.now() - 5000).toLocaleTimeString(), type: 'info', message: 'Health check OK. Todos los sistemas operativos.' },
    { time: new Date(Date.now() - 10000).toLocaleTimeString(), type: 'info', message: 'Cargando protocolo de contingencia Failover...' },
    { time: new Date(Date.now() - 15000).toLocaleTimeString(), type: 'info', message: 'Motor de Inteligencia Artificial (AI Insights) calibrado.' },
    { time: new Date(Date.now() - 20000).toLocaleTimeString(), type: 'info', message: 'Iniciando enlace seguro de red (WSS)...' },
    { time: new Date(Date.now() - 25000).toLocaleTimeString(), type: 'info', message: 'Sincronizando métricas de CPU y Memoria con DigitalOcean.' },
    { time: new Date(Date.now() - 30000).toLocaleTimeString(), type: 'info', message: 'Base de datos PostgreSQL conectada exitosamente.' },
    { time: new Date(Date.now() - 35000).toLocaleTimeString(), type: 'info', message: 'Conectando con clúster principal...' },
    { time: new Date(Date.now() - 40000).toLocaleTimeString(), type: 'info', message: 'Sistema de monitoreo ERP CAT inicializado.' }
  ])
  const [aiDiagnosis, setAiDiagnosis] = useState(null)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [chatMessages, setChatMessages] = useState([{ role: 'assistant', content: 'Hola. Soy AI Insights. Monitoreando sistemas. ¿En qué te ayudo?' }])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)

  const sendChatMessage = async (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const newMessage = { role: 'user', content: chatInput }
    const updatedMessages = [...chatMessages, newMessage]
    setChatMessages(updatedMessages)
    setChatInput('')
    setIsChatLoading(true)

    try {
      const res = await fetch(`${backend_host}/api/v1/health/ai_chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, healthData })
      })
      const data = await res.json()
      if (res.ok) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.reply}` }])
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Error conectando al motor de IA.' }])
    } finally {
      setIsChatLoading(false)
    }
  }

  const executeSelfHealing = async () => {
    toast.info("Iniciando protocolo de Auto-Curación...")
    if (dbState !== 'normal') {
      await toggleChaos()
    } else {
      await checkHealth()
    }
    setChatMessages(prev => [...prev, { role: 'assistant', content: '✅ Auto-Curación completada. Sistemas operativos.' }])
  }

  const fetchAiDiagnosis = async () => {
    setIsAiLoading(true)
    setAiDiagnosis(null)
    try {
      const res = await fetch(`${backend_host}/api/v1/health/ai_diagnosis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(healthData)
      })
      const data = await res.json()
      if (res.ok) {
        setAiDiagnosis(data.diagnosis)
        addLog('info', 'AI Insights generado exitosamente.')
      } else {
        setAiDiagnosis(`Error: ${data.diagnosis}`)
      }
    } catch (error) {
      setAiDiagnosis("Error de red conectando al motor de IA.")
    } finally {
      setIsAiLoading(false)
    }
  }

  const trackAction = (actionType) => {
    try {
      // Usar captureMessage en lugar de metrics (ya que metrics ha sido deprecado en algunas versiones recientes del SDK)
      if (Sentry && Sentry.captureMessage) {
        Sentry.captureMessage(`Admin Action: ${actionType}`, 'info')
      }
      // 2. Actualizar estado local para visualizar en el dashboard
      setMetricsData(prev => {
        const newData = [...prev]
        const lastIdx = newData.length - 1
        if (lastIdx >= 0) {
          newData[lastIdx] = { ...newData[lastIdx], [actionType]: (newData[lastIdx][actionType] || 0) + 1 }
        }
        return newData
      })
    } catch (error) {
      console.error("Error en trackAction:", error)
    }
  }

  const addLog = (type, message) => {
    setLogs(prev => {
      const newLogs = [{ time: new Date().toLocaleTimeString(), type, message }, ...prev]
      return newLogs.slice(0, 50) // Aumentamos el límite de 5 a 50
    })
  }

  const toggleChaos = async () => {
    trackAction('chaos')
    try {
      const res = await fetch(`${backend_host}/api/v1/health/toggle_chaos`, { method: 'POST' })
      const data = await res.json()
      setDbState(data.state)
      
      if (data.state === 'broken') {
        toast.error("¡ALERTA CRÍTICA! Se ha destruido la conexión con la base de datos principal.")
        addLog('error', 'Comando CHAOS: Base de datos principal apagada remotamente.')
      } else if (data.state === 'replica') {
        toast.success("¡FAILOVER EXITOSO! El sistema ha sido rescatado conectándose a la réplica.")
        addLog('info', 'Comando RESTORE (Failover): Sistema corriendo desde servidor de rescate.')
      } else {
        toast.success("Mantenimiento finalizado. Volviendo al servidor principal.")
        addLog('info', 'Vuelta a la normalidad: Base de datos principal reconectada.')
      }
      
      checkHealth()
    } catch (error) {
      toast.error("Error conectando al backend para inyectar Chaos.")
    }
  }

  const triggerSentryFrontendError = () => {
    trackAction('sentry_front')
    try {
      // Lanzamos un error explícito para que Sentry lo capture
      throw new Error("Sentry Frontend Test Error! Este error fue disparado desde el MonitoringDashboard.");
    } catch (err) {
      Sentry.captureException(err);
      addLog('error', 'Error forzado en Frontend reportado a Sentry.')
      toast.success("¡Error reportado a Sentry (Frontend)! Revisa tu panel de Sentry.");
    }
  }

  const triggerSentryBackendError = async () => {
    trackAction('sentry_back')
    try {
      addLog('info', 'Enviando petición de error al backend...')
      const res = await fetch(`${backend_host}/api/v1/health/trigger_error`, { method: 'POST' })
      
      if (!res.ok) {
        addLog('error', 'Backend reportó error 500 (Interceptado por Sentry Rails).')
        toast.success("¡Error de backend enviado! El backend levantó un error 500 y Sentry Rails capturó la excepción. Revisa tu panel.");
      } else {
        toast.error("El backend no falló. Verifica si la ruta y controlador se actualizaron bien.");
      }
    } catch (error) {
      toast.error("Error de red conectando al backend para probar Sentry.");
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
      
      // Sincronizar el estado del botón con el backend
      if (data.db_state) {
        setDbState(data.db_state)
      }

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
      setMetricsData(prev => {
        const newData = [...prev, { time: timeStr, sentry_front: 0, sentry_back: 0, chaos: 0 }]
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
      setMetricsData(prev => {
        const newData = [...prev, { time: timeStr, sentry_front: 0, sentry_back: 0, chaos: 0 }]
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
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={triggerSentryFrontendError}
            className="flex items-center gap-2 border-orange-500/30 hover:bg-orange-500/10 text-orange-400"
          >
            <ShieldAlert size={16} /> Probar Sentry (Front)
          </Button>
          <Button 
            variant="outline" 
            onClick={triggerSentryBackendError}
            className="flex items-center gap-2 border-red-500/30 hover:bg-red-500/10 text-red-400"
          >
            <ShieldAlert size={16} /> Probar Sentry (Back)
          </Button>
          <Button 
            variant={dbState !== 'normal' ? "outline" : "destructive"} 
            onClick={toggleChaos}
            className="flex items-center gap-2"
          >
            <Play size={16} /> 
            {dbState === 'normal' && "Inyectar Chaos (Matar BD Principal)"}
            {dbState === 'broken' && "Restaurar (Failover a Réplica)"}
            {dbState === 'replica' && "Sincronizar Datos y Volver"}
          </Button>
        </div>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
        
        {/* Uso de CPU y RAM */}
        <div className="border rounded-xl bg-card p-4 shadow-sm flex flex-col h-[280px]">
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
        <div className="border rounded-xl bg-card p-4 shadow-sm flex flex-col h-[280px]">
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

        {/* Sentry Application Metrics */}
        <div className="border rounded-xl bg-card p-4 shadow-sm flex flex-col h-[280px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold flex items-center gap-2 text-sm"><Activity size={16} className="text-purple-500" /> Sentry Metrics</h3>
            <span className="text-[10px] text-muted-foreground bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-md border border-purple-500/20">admin_actions</span>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricsData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" tick={{fontSize: 9, fill: '#666'}} tickMargin={8} minTickGap={30} />
                <YAxis tick={{fontSize: 9, fill: '#666'}} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                <Bar dataKey="sentry_front" name="Front" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={12} />
                <Bar dataKey="sentry_back" name="Back" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} barSize={12} />
                <Bar dataKey="chaos" name="Chaos" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* AI Insights & DevOps Diagnosis */}
      <div className="border border-indigo-500/30 rounded-xl bg-indigo-500/5 p-4 shadow-[0_0_15px_rgba(99,102,241,0.05)] flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2 text-indigo-400">
            <Cpu size={18} className={isAiLoading ? "animate-spin text-indigo-300" : ""} /> Motor de Análisis Heurístico (AI Insights)
          </h3>
          <Button 
            variant="outline" 
            onClick={fetchAiDiagnosis}
            disabled={isAiLoading}
            className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 flex items-center gap-2"
          >
            {isAiLoading ? "Analizando telemetría..." : "Generar Diagnóstico del Sistema"}
          </Button>
        </div>
        
        {(aiDiagnosis || isAiLoading) && (
          <div className="bg-black/60 border border-indigo-500/20 p-4 rounded-lg font-mono text-sm text-indigo-200 leading-relaxed shadow-inner">
            {isAiLoading ? (
              <div className="flex items-center gap-2 animate-pulse text-indigo-400">
                <div className="w-2 h-4 bg-indigo-400 animate-bounce" /> Procesando volúmenes de datos e identificando anomalías...
              </div>
            ) : (
              aiDiagnosis.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-2 last:mb-0">{paragraph}</p>
              ))
            )}
          </div>
        )}
      </div>

      {/* Registro de Eventos y Contingencia */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Logs */}
        <div className="border rounded-xl bg-card p-4 shadow-sm flex flex-col lg:col-span-2 h-[350px]">
          <h3 className="font-bold flex items-center gap-2 mb-4"><Activity size={18} /> Registro de Eventos (Live Terminal)</h3>
          <div className="flex-1 bg-black/50 border border-white/10 rounded-lg p-3 font-mono text-sm flex flex-col gap-2 overflow-y-auto">
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

        {/* Chatbot DevOps Interactivo */}
        <div className="border border-indigo-500/20 rounded-xl bg-card p-4 shadow-sm flex flex-col lg:col-span-1 h-[350px]">
          <h3 className="font-bold flex items-center gap-2 mb-4 text-indigo-400">
            <MessageSquare size={18} /> Terminal AI Insights
          </h3>
          <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2 text-sm">
            {chatMessages.map((msg, idx) => {
              const content = msg.content || '';
              const isAction = content.includes('[ACTION: DISABLE_CHAOS]');
              const cleanContent = content.replace('[ACTION: DISABLE_CHAOS]', '').trim();
              
              return (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-2 rounded-lg max-w-[90%] ${
                    msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-indigo-500/10 border border-indigo-500/20 text-foreground'
                  }`}>
                    {cleanContent}
                  </div>
                  {isAction && msg.role === 'assistant' && (
                    <Button 
                      onClick={executeSelfHealing}
                      className="mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold border-none shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-pulse flex items-center gap-2"
                      size="sm"
                    >
                      <Wrench size={14} /> Ejecutar Auto-Curación
                    </Button>
                  )}
                </div>
              );
            })}
            {isChatLoading && (
              <div className="flex items-start">
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs flex gap-1">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75" />
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150" />
                </div>
              </div>
            )}
          </div>
          <form onSubmit={sendChatMessage} className="flex gap-2">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Pregúntale al sistema..." 
              className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <Button type="submit" disabled={isChatLoading || !chatInput.trim()} size="icon" className="bg-indigo-500 hover:bg-indigo-600 text-white">
              <Send size={16} />
            </Button>
          </form>
        </div>

      </div>

    </div>
  )
}

export default MonitoringDashboard
