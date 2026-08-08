import { create } from 'zustand';
import * as db from '../database/db';

export const useAppStore = create((set, get) => ({
  materias: [],
  tareas: [],
  subtareasByTarea: {},
  calendarEvents: [],
  selectedMateria: null,
  isDarkMode: false,

  initApp: async () => {
    try {
      await db.initDatabase();
      const materias = await db.getMaterias();
      const tareas = await db.getTareas();
      const calendarEvents = await db.getCalendarEvents();
      
      const subtareasByTarea = {};
      for (const tarea of tareas) {
        subtareasByTarea[tarea.id] = await db.getSubtareas(tarea.id);
      }
      
      set({ materias, tareas, calendarEvents, subtareasByTarea });
    } catch (error) {
      console.error('Error:', error);
    }
  },

  loadMaterias: async () => {
    const materias = await db.getMaterias();
    set({ materias });
  },

  addMateria: async (nombre, color, icono) => {
    await db.addMateria(nombre, color, icono);
    get().loadMaterias();
  },

  updateMateria: async (id, nombre, color, icono) => {
    await db.updateMateria(id, nombre, color, icono);
    get().loadMaterias();
  },

  deleteMateria: async (id) => {
    await db.deleteMateria(id);
    const materias = await db.getMaterias();
    const tareas = await db.getTareas();
    set({ materias, tareas, selectedMateria: null });
  },

  loadTareas: async (materia_id = null) => {
    const tareas = await db.getTareas(materia_id);
    const subtareasByTarea = {};
    for (const tarea of tareas) {
      subtareasByTarea[tarea.id] = await db.getSubtareas(tarea.id);
    }
    set({ tareas, subtareasByTarea });
  },

  addTarea: async (materia_id, titulo, descripcion, fecha, hora, prioridad, recordatorio) => {
    await db.addTarea(materia_id, titulo, descripcion, fecha, hora, prioridad, recordatorio);
    get().loadTareas();
  },

  deleteTarea: async (id) => {
    await db.deleteTarea(id);
    get().loadTareas();
  },

  toggleTarea: async (id, completada) => {
    await db.toggleTarea(id, completada);
    get().loadTareas();
  },

  addSubtarea: async (tarea_id, titulo) => {
    await db.addSubtarea(tarea_id, titulo);
    const subtareasByTarea = { ...get().subtareasByTarea };
    subtareasByTarea[tarea_id] = await db.getSubtareas(tarea_id);
    set({ subtareasByTarea });
  },

  deleteSubtarea: async (id, tarea_id) => {
    await db.deleteSubtarea(id);
    const subtareasByTarea = { ...get().subtareasByTarea };
    subtareasByTarea[tarea_id] = await db.getSubtareas(tarea_id);
    set({ subtareasByTarea });
  },

  toggleSubtarea: async (id, tarea_id, completada) => {
    await db.toggleSubtarea(id, completada);
    const subtareasByTarea = { ...get().subtareasByTarea };
    subtareasByTarea[tarea_id] = await db.getSubtareas(tarea_id);
    set({ subtareasByTarea });
  },

  addCalendarEvent: async (titulo, descripcion, fecha, hora, color, etiqueta) => {
    await db.addCalendarEvent(titulo, descripcion, fecha, hora, color, etiqueta);
    const calendarEvents = await db.getCalendarEvents();
    set({ calendarEvents });
  },

  deleteCalendarEvent: async (id) => {
    await db.deleteCalendarEvent(id);
    const calendarEvents = await db.getCalendarEvents();
    set({ calendarEvents });
  },

  toggleCalendarEvent: async (id, completada) => {
    await db.toggleCalendarEvent(id, completada);
    const calendarEvents = await db.getCalendarEvents();
    set({ calendarEvents });
  },

  selectMateria: (id) => {
    set({ selectedMateria: id });
  },

  toggleTheme: () => {
    set((state) => ({ isDarkMode: !state.isDarkMode }));
  },
}));