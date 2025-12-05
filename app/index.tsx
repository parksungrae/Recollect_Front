import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';

interface ListItem {
  id: string;
  title: string;
  description: string;
}

export default function ListPage() {
  const [items, setItems] = useState<ListItem[]>([
    { id: '1', title: 'Item 1', description: 'This is the first item' },
    { id: '2', title: 'Item 2', description: 'This is the second item' },
    { id: '3', title: 'Item 3', description: 'This is the third item' },
  ]);

  const renderItem = ({ item }: { item: ListItem }) => (
    <TouchableOpacity 
      className="bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-100"
      activeOpacity={0.7}
    >
      <Text className="text-lg font-semibold text-gray-800 mb-1">
        {item.title}
      </Text>
      <Text className="text-sm text-gray-600">
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-6 px-6 shadow-sm">
        <Text className="text-3xl font-bold text-gray-900">
          Recollect
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          Your collection list
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
