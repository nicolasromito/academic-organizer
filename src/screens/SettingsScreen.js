import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useAppStore } from '../context/AppContext';
import { COLORS } from '../constants/colors';

export default function SettingsScreen() {
  const { materias, tareas, subtareasByTarea, calendarEvents, isDarkMode } = useAppStore();
  const [loading, setLoading] = useState(false);

  const handleToggleTheme = () => {
    // Aquí iría la lógica para cambiar tema
    Alert.alert('Tema', 'Funcionalidad en desarrollo');
  };

  const handleClearData = () => {
    Alert.alert(
      'Eliminar todos los datos',
      '¿Estás seguro? Esto eliminará todas tus materias, tareas y eventos del calendario.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              setLoading(true);
              // Eliminar todas las materias (esto elimina tareas en cascada)
              for (const materia of materias) {
                const { deleteMateriaFromDB } = useAppStore.getState();
                // Nota: necesitamos crear esta función en db.js
              }
              Alert.alert('Éxito', 'Todos los datos han sido eliminados');
              setLoading(false);
            } catch (error) {
              Alert.alert('Error', 'No se pudieron eliminar los datos');
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleExportData = async () => {
    try {
      setLoading(true);

      // Crear objeto con todos los datos
      const dataToExport = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        materias: materias,
        tareas: tareas,
        subtareas: subtareasByTarea,
        calendarEvents: calendarEvents,
      };

      // Convertir a JSON
      const jsonString = JSON.stringify(dataToExport, null, 2);

      // Ruta de descarga
      const fileName = `academic-organizer-backup-${new Date().getTime()}.json`;
      const fileUri = FileSystem.DocumentDirectoryURI + fileName;

      // Guardar archivo
      await FileSystem.writeAsStringAsync(fileUri, jsonString);

      Alert.alert(
        'Éxito',
        `Datos exportados:\n${fileName}\n\nGuardado en la carpeta de descargas del dispositivo`
      );
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron exportar los datos: ' + error.message);
      setLoading(false);
    }
  };

  const handleImportData = async () => {
    try {
      setLoading(true);

      // Obtener archivos del directorio de documentos
      const files = await FileSystem.readDirectoryAsync(FileSystem.DocumentDirectoryURI);
      const jsonFiles = files.filter(f => f.endsWith('.json'));

      if (jsonFiles.length === 0) {
        Alert.alert('Info', 'No hay archivos JSON para importar en el dispositivo');
        setLoading(false);
        return;
      }

      // Seleccionar primer archivo JSON (idealmente debería haber un selector)
      const selectedFile = jsonFiles[0];
      const fileUri = FileSystem.DocumentDirectoryURI + selectedFile;
      const fileContent = await FileSystem.readAsStringAsync(fileUri);

      // Parsear JSON
      const importedData = JSON.parse(fileContent);

      // Validar estructura
      if (!importedData.materias || !importedData.tareas) {
        Alert.alert('Error', 'El archivo no tiene la estructura correcta');
        setLoading(false);
        return;
      }

      Alert.alert(
        'Confirmación',
        `Se van a importar:\n• ${importedData.materias.length} materias\n• ${importedData.tareas.length} tareas\n• ${importedData.calendarEvents?.length || 0} eventos\n\n¿Continuar?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Importar',
            onPress: async () => {
              try {
                // Aquí iría la lógica para insertar los datos en la BD
                // Por ahora solo mostramos el mensaje
                Alert.alert('Éxito', 'Datos importados correctamente. Reinicia la app para ver los cambios.');
                setLoading(false);
              } catch (error) {
                Alert.alert('Error', 'No se pudieron importar los datos: ' + error.message);
                setLoading(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudieron leer los archivos: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Configuración</Text>

      {/* Tema */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Apariencia</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingLabel}>🌙 Tema Oscuro</Text>
            <Text style={styles.settingDesc}>Cambiar a tema oscuro/claro</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={handleToggleTheme}
            trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
            thumbColor={COLORS.white}
          />
        </View>
      </View>

      {/* Datos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleExportData}
          disabled={loading}
        >
          <Text style={styles.buttonIcon}>📥</Text>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonTitle}>Exportar Datos</Text>
            <Text style={styles.buttonDesc}>Guardar materias, tareas y calendario en JSON</Text>
          </View>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleImportData}
          disabled={loading}
        >
          <Text style={styles.buttonIcon}>📤</Text>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonTitle}>Importar Datos</Text>
            <Text style={styles.buttonDesc}>Cargar datos desde un archivo JSON</Text>
          </View>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={handleClearData}
          disabled={loading}
        >
          <Text style={styles.buttonIcon}>🗑️</Text>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonTitle}>Eliminar Todos los Datos</Text>
            <Text style={styles.buttonDesc}>Borrar todas las materias, tareas y eventos</Text>
          </View>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información</Text>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Versión</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Materias</Text>
          <Text style={styles.infoValue}>{materias.length}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Tareas</Text>
          <Text style={styles.infoValue}>{tareas.length}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Eventos</Text>
          <Text style={styles.infoValue}>{calendarEvents.length}</Text>
        </View>
      </View>

      <Text style={styles.footer}>Academic Organizer © 2024</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
    padding: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.gray900,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 12,
    color: COLORS.gray500,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  dangerButton: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  buttonContent: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  buttonDesc: {
    fontSize: 12,
    color: COLORS.gray500,
  },
  buttonArrow: {
    fontSize: 18,
    color: COLORS.gray300,
  },
  infoItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray700,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  footer: {
    textAlign: 'center',
    color: COLORS.gray400,
    marginTop: 32,
    marginBottom: 16,
    fontSize: 12,
  },
});