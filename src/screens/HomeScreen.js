import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppStore } from '../context/AppContext';
import { COLORS } from '../constants/colors';

export default function HomeScreen() {
  const { materias, tareas, loadMaterias, loadTareas } = useAppStore();

  useFocusEffect(
    React.useCallback(() => {
      loadMaterias();
      loadTareas();
    }, [])
  );

  const tareasCompletadas = tareas.filter(t => t.completada).length;
  const tareasPendientes = tareas.filter(t => !t.completada).length;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.label}>📚 Materias</Text>
        <Text style={styles.number}>{materias.length}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>⏳ Tareas Pendientes</Text>
        <Text style={[styles.number, { color: '#EF4444' }]}>{tareasPendientes}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>✅ Tareas Completadas</Text>
        <Text style={[styles.number, { color: '#10B981' }]}>{tareasCompletadas}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>📊 Total de Tareas</Text>
        <Text style={styles.number}>{tareas.length}</Text>
      </View>
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
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  label: {
    fontSize: 14,
    color: COLORS.gray500,
    marginBottom: 8,
  },
  number: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});