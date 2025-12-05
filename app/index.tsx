import { View, Text, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ListItem {
  id: string;
  title: string;
  description: string;
}

// Sortable Item Component
function SortableItem({ item, id }: { item: ListItem; id: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
    cursor: 'grab'
  } as React.CSSProperties; // Type assertion for Web

  // Only for Web environment
  if (Platform.OS === 'web') {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <View className="bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold text-gray-800 mb-1">
            {item.title}
          </Text>
          <Text className="text-sm text-gray-600">
            {item.description}
          </Text>
        </View>
      </div>
    );
  }

  // Fallback for Native (won't be draggable with dnd-kit)
  return (
    <View className="bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-100">
      <Text className="text-lg font-semibold text-gray-800 mb-1">
        {item.title}
      </Text>
      <Text className="text-sm text-gray-600">
        {item.description}
      </Text>
    </View>
  );
}

export default function ListPage() {
  const [items, setItems] = useState<ListItem[]>([
    { id: '1', title: 'Item 1', description: 'This is the first item' },
    { id: '2', title: 'Item 2', description: 'This is the second item' },
    { id: '3', title: 'Item 3', description: 'This is the third item' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddItem = () => {
    if (newTitle.trim() === '') return;

    const newItem: ListItem = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription,
    };

    setItems([...items, newItem]);
    setNewTitle('');
    setNewDescription('');
    setModalVisible(false);
  };

  return (
    <View className="flex-1 bg-gray-50 h-[100vh]">
      {/* Header */}
      <View className="bg-white pt-12 pb-6 px-6 shadow-sm flex-row justify-between items-center w-full z-10">
        <View>
          <Text className="text-3xl font-bold text-gray-900">
            Recollect
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Your collection list
          </Text>
        </View>
        <TouchableOpacity 
          className="bg-blue-500 w-10 h-10 rounded-full items-center justify-center p-0"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white text-2xl font-bold leading-none mt-[-2px] ml-[1px]">+</Text>
        </TouchableOpacity>
      </View>

      {/* List - Centered with max width */}
      <View className="flex-1 items-center w-full overflow-hidden">
        <ScrollView 
          contentContainerStyle={{ padding: 24, paddingBottom: 100, maxWidth: 600, width: '100%', alignSelf: 'center' }}
          className="w-full"
          showsVerticalScrollIndicator={false}
        >
          {Platform.OS === 'web' ? (
            <div style={{ width: '100%' }}>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={items.map(item => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {items.map((item) => (
                    <SortableItem key={item.id} id={item.id} item={item} />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          ) : (
            // Native Fallback
            items.map((item) => (
              <SortableItem key={item.id} id={item.id} item={item} />
            ))
          )}
        </ScrollView>
      </View>

      {/* Add Item Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-end bg-black/50">
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className="bg-white rounded-t-3xl p-6"
            >
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-bold text-gray-900">Add New Item</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text className="text-gray-500 text-lg">Close</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 text-base"
                placeholder="Title"
                value={newTitle}
                onChangeText={setNewTitle}
                autoFocus
              />

              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-base h-24"
                placeholder="Description"
                value={newDescription}
                onChangeText={setNewDescription}
                multiline
                textAlignVertical="top"
              />

              <TouchableOpacity 
                className={`w-full py-4 rounded-xl items-center mb-6 ${newTitle.trim() ? 'bg-blue-500' : 'bg-gray-300'}`}
                onPress={handleAddItem}
                disabled={!newTitle.trim()}
              >
                <Text className="text-white font-bold text-lg">Add Item</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
