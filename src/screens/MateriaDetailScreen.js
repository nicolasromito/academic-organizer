import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAppStore } from '../context/AppContext';
import { COLORS } from '../constants/colors';

export default function MateriaDetailScreen({ route, navigation }) {
  const materia = route.params.materia;
  const { tareas, loadTareas, addTarea, deleteTarea, toggleTarea, subtareasByTarea, addSubtarea, deleteSubtarea, toggleSubtarea } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [hora, setHora] = useState('10:00');
  const [prioridad, setPrioridad] = useState('Media');
  const [expandedTarea, setExpandedTarea] = useState(null);
  const [newSubtareaTitle, setNewSubtareaTitle] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      loadTareas(materia.id);
    }, [materia.id])
  );

  const materiaTareas = tareas.filter(t => t.materia_id === materia.id);

  const handleAddTarea = async () => {
    if (!titulo.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }
    await addTarea(materia.id, titulo, descripcion, '2024-01-01', hora, prioridad, 0);
    setTitulo('');
    setDescripcion('');
    setHora('10:00');
    setPrioridad('Media');
    setShowModal(false);
  };

  const handleToggleTarea = async (id, completada) => {
    await toggleTarea(id, !completada);
  };

  const handleDeleteTarea = (id) => {
    Alert.alert('Eliminar', '¿Eliminar tarea?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        onPress: () => deleteTarea(id),
        style: 'destructive',
      },
    ]);
  };

  const handleAddSubtarea = async (tareaId) => {
    if (!newSubtareaTitle.trim()) {
      Alert.alert('Error', 'Ingresa un título');
      return;
    }
    await addSubtarea(tareaId, newSubtareaTitle);
    setNewSubtareaTitle('');
  };

  const getPriorityIcon = (prioridad) => {
    if (prioridad === 'Alta') return '🔴';
    if (prioridad === 'Media') return '🟡';
    if (prioridad === 'Baja') return '🟢';
    return '•';
  };

  const renderTarea = ({ item }) => {
    const subtareas = subtareasByTarea[item.id] || [];
    const completadas = subtareas.filter(s => s.completada).length;
    const total = subtareas.length;
    const progreso = total > 0 ? `${completadas}/${total}` : null;
    const isExpanded = expandedTarea === item.id;

    return (
      <View style={[styles.tareaCard, item.completada && styles.tareaCompleted]}>
        <TouchableOpacity
          style={styles.tareaCheckbox}
          onPress={() => handleToggleTarea(item.id, item.completada)}
        >
          <View style={[styles.checkbox, item.completada && styles.checkboxChecked]}>
            {item.completada ? (
              <Text style={styles.checkmark}>✓</Text>
            ) : null}
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tareaContent}
          onPress={() => setExpandedTarea(isExpanded ? null : item.id)}
        >
          <View style={styles.tareaHeader}>
            <Text style={[styles.tareaTitle, item.completada && styles.tareaCompleted]}>
              {item.titulo}
            </Text>
            {total > 0 && (
              <Text style={styles.progreso}>{progreso}</Text>
            )}
          </View>
          
          {item.descripcion ? (
            <Text style={styles.tareaDesc}>{item.descripcion}</Text>
          ) : null}
          
          <View style={styles.tareaFooter}>
            <Text style={styles.tareaHora}>🕐 {item.hora}</Text>
            <Text style={styles.tareaPrioridad}>
              {getPriorityIcon(item.prioridad)} {item.prioridad}
            </Text>
          </View>

          {total > 0 && (
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(completadas / total) * 100}%` }]} />
            </View>
          )}

          {isExpanded && (
            <View style={styles.subtareasContainer}>
              {subtareas.length > 0 ? (
                subtareas.map((sub) => (
                  <View key={sub.id} style={styles.subtareaItem}>
                    <TouchableOpacity
                      onPress={() => toggleSubtarea(sub.id, item.id, !sub.completada)}
                    >
                      <View style={[styles.subCheckbox, sub.completada && styles.subCheckboxChecked]}>
                        {sub.completada ? (
                          <Text style={styles.subCheckmark}>✓</Text>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                    <Text style={[styles.subTitle, sub.completada && styles.subCompleted]}>
                      {sub.titulo}
                    </Text>
                    <TouchableOpacity onPress={() => deleteSubtarea(sub.id, item.id)}>
                      <Text style={styles.subDeleteBtn}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : null}

              <View style={styles.addSubForm}>
                <TextInput
                  style={styles.subInput}
                  placeholder="+ Nueva subtarea"
                  value={newSubtareaTitle}
                  onChangeText={setNewSubtareaTitle}
                  placeholderTextColor={COLORS.gray400}
                />
                <TouchableOpacity
                  onPress={() => handleAddSubtarea(item.id)}
                  style={styles.addSubBtn}
                >
                  <Text style={styles.addSubBtnText}>✓</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => handleDeleteTarea(item.id)}>
          <Text style={styles.deleteBtn}>🗑️</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Volver</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerIcon}>{materia.icono}</Text>
          <Text style={styles.headerTitle}>{materia.nombre}</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={materiaTareas}
        renderItem={renderTarea}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay tareas</Text>
        }
        contentContainerStyle={styles.list}
      />

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Tarea</Text>

            <TextInput
              style={styles.input}
              placeholder="Título"
              value={titulo}
              onChangeText={setTitulo}
              placeholderTextColor={COLORS.gray400}
            />
            <TextInput
              style={[styles.input, styles.inputLarge]}
              placeholder="Descripción (opcional)"
              value={descripcion}
              onChangeText={setDescripcion}
              placeholderTextColor={COLORS.gray400}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Hora (HH:MM)"
              value={hora}
              onChangeText={setHora}
              placeholderTextColor={COLORS.gray400}
            />

            <Text style={styles.label}>Prioridad:</Text>
            <View style={styles.priorityRow}>
              {['Baja', 'Media', 'Alta'].map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityBtn,
                    prioridad === p && styles.prioritySelected,
                  ]}
                  onPress={() => setPrioridad(p)}
                >
                  <Text style={styles.priorityText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelBtn]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveBtn]}
                onPress={handleAddTarea}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
    paddingTop: 40,
  },
  backBtn: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 28,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray900,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 20,
  },
  list: {
    padding: 16,
  },
  empty: {
    textAlign: 'center',
    color: COLORS.gray500,
    marginTop: 32,
    fontSize: 16,
  },
  tareaCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  tareaCompleted: {
    opacity: 0.5,
  },
  tareaCheckbox: {
    marginRight: 12,
    marginTop: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  tareaContent: {
    flex: 1,
  },
  tareaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tareaTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gray900,
    flex: 1,
  },
  progreso: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  tareaDesc: {
    fontSize: 13,
    color: COLORS.gray500,
    marginBottom: 6,
  },
  tareaFooter: {
    flexDirection: 'row',
    gap: 8,
  },
  tareaHora: {
    fontSize: 12,
    color: COLORS.gray500,
  },
  tareaPrioridad: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray600,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.gray200,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  subtareasContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    paddingTop: 12,
    backgroundColor: COLORS.gray50,
    borderRadius: 8,
    padding: 8,
  },
  subtareaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  subCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  subCheckboxChecked: {
    backgroundColor: COLORS.primary,
  },
  subCheckmark: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  subTitle: {
    flex: 1,
    fontSize: 13,
    color: COLORS.gray700,
  },
  subCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.gray400,
  },
  subDeleteBtn: {
    fontSize: 16,
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  deleteBtn: {
    fontSize: 18,
  },
  addSubForm: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  subInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    color: COLORS.gray900,
  },
  addSubBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSubBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.gray900,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    color: COLORS.gray900,
  },
  inputLarge: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray700,
    marginBottom: 8,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    alignItems: 'center',
  },
  prioritySelected: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  priorityText: {
    fontWeight: '600',
    fontSize: 13,
    color: COLORS.gray900,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: COLORS.gray200,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    fontWeight: '600',
    color: COLORS.white,
    fontSize: 14,
  },
});