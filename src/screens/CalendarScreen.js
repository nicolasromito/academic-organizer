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
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAppStore } from '../context/AppContext';
import { COLORS } from '../constants/colors';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'];

export default function CalendarScreen() {
  const { calendarEvents, addCalendarEvent, deleteCalendarEvent, toggleCalendarEvent } = useAppStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [hora, setHora] = useState('10:00');
  const [color, setColor] = useState('#7C3AED');
  const [selectedDateString, setSelectedDateString] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      // Actualizar cuando la pantalla tenga foco
    }, [])
  );

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateString = (day) => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const handleAddEvent = async () => {
    if (!titulo.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }
    await addCalendarEvent(titulo, descripcion, selectedDateString, hora, color, '');
    setTitulo('');
    setDescripcion('');
    setHora('10:00');
    setColor('#7C3AED');
    setShowModal(false);
  };

  const getDayEvents = (dateString) => {
    return calendarEvents.filter(e => e.fecha === dateString);
  };

  const handleDayPress = (day) => {
    const dateString = formatDateString(day);
    setSelectedDateString(dateString);
    const dayEvents = getDayEvents(dateString);
    if (dayEvents.length > 0) {
      // Mostrar eventos del día
    } else {
      setShowModal(true);
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days = [];

    // Días vacíos al inicio
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDateString(day);
      const dayEvents = getDayEvents(dateString);
      const hasEvents = dayEvents.length > 0;

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            hasEvents && styles.dayCellWithEvents,
          ]}
          onPress={() => handleDayPress(day)}
        >
          <Text style={styles.dayText}>{day}</Text>
          {hasEvents && <View style={styles.eventDot} />}
        </TouchableOpacity>
      );
    }

    return days;
  };

  const selectedDateEvents = getDayEvents(selectedDateString);

  const renderEvent = ({ item }) => (
    <View style={[styles.eventCard, { borderLeftColor: item.color }]}>
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{item.titulo}</Text>
        {item.descripcion && <Text style={styles.eventDesc}>{item.descripcion}</Text>}
        <Text style={styles.eventHora}>🕐 {item.hora}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteCalendarEvent(item.id)}>
        <Text style={styles.deleteBtn}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendario</Text>

      <View style={styles.monthHeader}>
        <TouchableOpacity
          onPress={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
        >
          <Text style={styles.monthNav}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {MESES[selectedDate.getMonth()]} {selectedDate.getFullYear()}
        </Text>
        <TouchableOpacity
          onPress={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
        >
          <Text style={styles.monthNav}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekHeader}>
        {DIAS_SEMANA.map(dia => (
          <Text key={dia} style={styles.weekDay}>
            {dia}
          </Text>
        ))}
      </View>

      <View style={styles.calendar}>
        {renderCalendarDays()}
      </View>

      {selectedDateString && (
        <View style={styles.eventsSection}>
          <View style={styles.eventsHeader}>
            <Text style={styles.eventsTitle}>{selectedDateString}</Text>
            <TouchableOpacity
              style={styles.addEventBtn}
              onPress={() => setShowModal(true)}
            >
              <Text style={styles.addEventBtnText}>+ Evento</Text>
            </TouchableOpacity>
          </View>

          {selectedDateEvents.length > 0 ? (
            <FlatList
              data={selectedDateEvents}
              renderItem={renderEvent}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noEvents}>Sin eventos este día</Text>
          )}
        </View>
      )}

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Evento</Text>
            <Text style={styles.modalDate}>{selectedDateString}</Text>

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

            <Text style={styles.label}>Color:</Text>
            <View style={styles.colorGrid}>
              {['#7C3AED', '#EF4444', '#F59E0B', '#10B981', '#3B82F6'].map(c => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorOption,
                    { backgroundColor: c },
                    color === c && styles.colorSelected,
                  ]}
                  onPress={() => setColor(c)}
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
                onPress={handleAddEvent}
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
    padding: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.gray900,
    marginBottom: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  monthNav: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gray900,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekDay: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray500,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: 2,
    borderRadius: 8,
  },
  dayCellWithEvents: {
    backgroundColor: COLORS.primary + '15',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
  eventsSection: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gray900,
  },
  addEventBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addEventBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  noEvents: {
    textAlign: 'center',
    color: COLORS.gray500,
    marginTop: 16,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray50,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    alignItems: 'flex-start',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  eventDesc: {
    fontSize: 12,
    color: COLORS.gray500,
    marginTop: 4,
  },
  eventHora: {
    fontSize: 12,
    color: COLORS.gray600,
    marginTop: 4,
  },
  deleteBtn: {
    fontSize: 18,
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
    marginBottom: 4,
    color: COLORS.gray900,
  },
  modalDate: {
    fontSize: 12,
    color: COLORS.gray500,
    marginBottom: 16,
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
    color: COLORS.white,
    fontSize: 14,
  },
});