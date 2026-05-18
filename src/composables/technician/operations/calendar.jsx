import { useState } from "react";
import { useAuth } from "@/providers/UserContext";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import useFetchWorkOrdersDates from "./work-order-action/hooks/useFetchWorkOrdersDates";


export default function Calendar() {
  const { user } = useAuth()
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })
  const [search, setSearch] = useState("")
  const [searchFields, setSearchFields] = useState(["code,status"])
  const searchParams = {search, fields: searchFields.join(',') }
  const { data: workOrdersData, refetch: refetchWorkOrders } = useFetchWorkOrdersDates(pagination, searchParams, user?.roleable?.id)
  const events = workOrdersData?.rows

  return (
    <div style={{ padding: "20px" }}>
      <FullCalendar
        locale={esLocale}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
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