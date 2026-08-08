import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('academicorganizer.db');

export const initDatabase = async () => {
  try {
    await db.execAsync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS materias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        color TEXT DEFAULT '#7C3AED',
        icono TEXT DEFAULT '📚',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tareas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        materia_id INTEGER NOT NULL,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        fecha TEXT NOT NULL,
        hora TEXT NOT NULL,
        prioridad TEXT DEFAULT 'Media',
        completada INTEGER DEFAULT 0,
        recordatorio INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS subtareas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tarea_id INTEGER NOT NULL,
        titulo TEXT NOT NULL,
        completada INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tarea_id) REFERENCES tareas(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS calendar_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        fecha TEXT NOT NULL,
        hora TEXT,
        color TEXT DEFAULT '#7C3AED',
        etiqueta TEXT,
        completada INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.runAsync('DELETE FROM tareas WHERE materia_id NOT IN (SELECT id FROM materias)');
    await db.runAsync('DELETE FROM subtareas WHERE tarea_id NOT IN (SELECT id FROM tareas)');
    
    console.log('✓ Base de datos inicializada');
  } catch (error) {
    console.error('Error DB:', error);
  }
};

export const getMaterias = async () => {
  try {
    const result = await db.getAllAsync('SELECT * FROM materias ORDER BY created_at DESC');
    return result || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const addMateria = async (nombre, color, icono) => {
  try {
    await db.runAsync('INSERT INTO materias (nombre, color, icono) VALUES (?, ?, ?)', [nombre, color, icono]);
  } catch (error) {
    console.error('Error:', error);
  }
};

export const updateMateria = async (id, nombre, color, icono) => {
  try {
    await db.runAsync('UPDATE materias SET nombre = ?, color = ?, icono = ? WHERE id = ?', [nombre, color, icono, id]);
  } catch (error) {
    console.error('Error:', error);
  }
};

export const deleteMateria = async (id) => {
  try {
    await db.runAsync('DELETE FROM materias WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error:', error);
  }
};

export const getTareas = async (materia_id = null) => {
  try {
    let query = 'SELECT * FROM tareas';
    if (materia_id) query += ` WHERE materia_id = ${materia_id}`;
    query += ' ORDER BY fecha ASC, hora ASC';
    const result = await db.getAllAsync(query);
    return result || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const addTarea = async (materia_id, titulo, descripcion, fecha, hora, prioridad, recordatorio) => {
  try {
    await db.runAsync(
      'INSERT INTO tareas (materia_id, titulo, descripcion, fecha, hora, prioridad, recordatorio) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [materia_id, titulo, descripcion, fecha, hora, prioridad, recordatorio]
    );
  } catch (error) {
    console.error('Error:', error);
  }
};

export const deleteTarea = async (id) => {
  try {
    await db.runAsync('DELETE FROM tareas WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error:', error);
  }
};

export const toggleTarea = async (id, completada) => {
  try {
    await db.runAsync('UPDATE tareas SET completada = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [completada ? 1 : 0, id]);
  } catch (error) {
    console.error('Error:', error);
  }
};

export const getSubtareas = async (tarea_id) => {
  try {
    const result = await db.getAllAsync('SELECT * FROM subtareas WHERE tarea_id = ? ORDER BY created_at ASC', [tarea_id]);
    return result || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const addSubtarea = async (tarea_id, titulo) => {
  try {
    await db.runAsync('INSERT INTO subtareas (tarea_id, titulo) VALUES (?, ?)', [tarea_id, titulo]);
  } catch (error) {
    console.error('Error:', error);
  }
};

export const deleteSubtarea = async (id) => {
  try {
    await db.runAsync('DELETE FROM subtareas WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error:', error);
  }
};

export const toggleSubtarea = async (id, completada) => {
  try {
    await db.runAsync('UPDATE subtareas SET completada = ? WHERE id = ?', [completada ? 1 : 0, id]);
  } catch (error) {
    console.error('Error:', error);
  }
};

export const getCalendarEvents = async () => {
  try {
    const result = await db.getAllAsync('SELECT * FROM calendar_events ORDER BY fecha DESC');
    return result || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const addCalendarEvent = async (titulo, descripcion, fecha, hora, color, etiqueta) => {
  try {
    await db.runAsync(
      'INSERT INTO calendar_events (titulo, descripcion, fecha, hora, color, etiqueta) VALUES (?, ?, ?, ?, ?, ?)',
      [titulo, descripcion, fecha, hora, color, etiqueta]
    );
  } catch (error) {
    console.error('Error:', error);
  }
};

export const deleteCalendarEvent = async (id) => {
  try {
    await db.runAsync('DELETE FROM calendar_events WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error:', error);
  }
};

export const toggleCalendarEvent = async (id, completada) => {
  try {
    await db.runAsync('UPDATE calendar_events SET completada = ? WHERE id = ?', [completada ? 1 : 0, id]);
  } catch (error) {
    console.error('Error:', error);
  }
};
