import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";


export default function Calendar() {
  const events = [
    {
      id: "1",
      title: "Diagnóstico Excavadora CAT 320 - Cliente Minera El Sol",
      start: "2026-04-22T07:00:00",
      end: "2026-04-22T10:00:00",
    },
    {
      id: "2",
      title: "Mantenimiento Preventivo - Cargador Frontal CAT 950 (Cliente Constructora Andina)",
      start: "2026-04-22T11:00:00",
      end: "2026-04-22T14:00:00",
    },
    {
      id: "3",
      title: "Revisión Operativa - Bulldozer D6 (Cliente Obras Perú)",
      start: "2026-04-23T08:00:00",
      end: "2026-04-23T11:00:00",
    },
    {
      id: "4",
      title: "Mantenimiento Correctivo - Retroexcavadora CAT 420 (Cliente Servicios Generales Ramos)",
      start: "2026-04-23T13:00:00",
      end: "2026-04-23T16:00:00",
    },
    {
      id: "5",
      title: "Diagnóstico Sistema Hidráulico - Excavadora (Cliente Minera Santa Fe)",
      start: "2026-04-24T07:30:00",
      end: "2026-04-24T10:30:00",
    },
    {
      id: "6",
      title: "Mantenimiento Preventivo - Motor Generador CAT (Cliente Energía Norte)",
      start: "2026-04-24T11:30:00",
      end: "2026-04-24T14:30:00",
    },
    {
      id: "7",
      title: "Inspección Técnica General - Flota Maquinaria (Cliente Constructora Lima Sur)",
      start: "2026-04-25T08:00:00",
      end: "2026-04-25T12:00:00",
    },
    {
      id: "8",
      title: "Reparación Sistema Eléctrico - Volquete CAT 773 (Cliente Transporte Pesado SAC)",
      start: "2026-04-25T13:00:00",
      end: "2026-04-25T16:00:00",
    },
    {
      id: "9",
      title: "Diagnóstico de Fallas - Compactadora CAT (Cliente Vías y Obras SAC)",
      start: "2026-04-26T09:00:00",
      end: "2026-04-26T11:00:00",
    },
    {
      id: "10",
      title: "Mantenimiento Correctivo - Sistema de Frenos (Cliente Minera Los Andes)",
      start: "2026-04-26T12:00:00",
      end: "2026-04-26T15:00:00",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <FullCalendar
        locale={esLocale}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek" // 🔥 agenda tipo técnico
        selectable={true}
        editable={true}
        events={events}
        dateClick={(info) => {
          alert("Nueva cita en: " + info.dateStr);
        }}
        eventClick={(info) => {
          alert("Evento: " + info.event.title);
        }}
      />
    </div>
  );
}