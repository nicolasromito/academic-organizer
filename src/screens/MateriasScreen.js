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

const ICONOS = ['📚', '💻', '📐', '🧪', '🎨', '🏃', '🎵', '📖', '🔬', '⚽'];
const COLORES = ['#7C3AED', '#EF4444', '#F59E0B', '#10B981', '#3B82F6'];

export default function MateriasScreen({ navigation }) {
  const { materias, loadMaterias, addMateria, deleteMateria } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORES[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONOS[0]);

  useFocusEffect(
    React.useCallback(() => {
      loadMaterias();
    }, [])
  );

  const handleAddMateria = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    await addMateria(nombre, selectedColor, selectedIcon);
    setNombre('');
    setSelectedColor(COLORES[0]);
    setSelectedIcon(ICONOS[0]);
    setShowModal(false);
  };

  const handleDeleteMateria = (id) => {
    Alert.alert('Eliminar', '¿Eliminar materia?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        onPress: () => deleteMateria(id),
        style: 'destructive',
      },
    ]);
  };

  const renderMateria = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('MateriaDetail', { materia: item })}
    >
      <View style={[styles.card, { borderLeftColor: item.color }]}>
        <Text style={styles.icono}>{item.icono}</Text>
        <View style={styles.content}>
          <Text style={styles.nombre}>{item.nombre}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDeleteMateria(item.id)}>
          <Text style={styles.deleteBtn}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Materias</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.addBtnText}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={materias}
        renderItem={renderMateria}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay materias. ¡Agrega una!</Text>
        }
        contentContainerStyle={styles.list}
      />

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Materia</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre de la materia"
              value={nombre}
              onChangeText={setNombre}
            />

            <Text style={styles.label}>Selecciona un icono:</Text>
            <View style={styles.iconGrid}>
              {ICONOS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconOption,
                    selectedIcon === icon && styles.iconSelected,
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Text style={styles.iconText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Selecciona un color:</Text>
            <View style={styles.colorGrid}>
              {COLORES.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
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
                onPress={handleAddMateria}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.gray900,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  empty: {
    textAlign: 'center',
    color: COLORS.gray500,
    marginTop: 32,
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    alignItems: 'center',
  },
  icono: {
    fontSize: 32,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  deleteBtn: {
    fontSize: 20,
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
    marginBottom: 16,
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray700,
    marginBottom: 8,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  iconOption: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  iconText: {
    fontSize: 28,
  },
  colorGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: COLORS.gray900,
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
    fontSize: 14,
    color: COLORS.white,
  },
});