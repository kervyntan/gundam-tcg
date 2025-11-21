import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ListRenderItem,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getCards, getFilters } from '../services/api';
import { Card, FiltersResponse } from '../types';
import { RootStackParamList } from '../App';

type CardListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CardList'>;

interface Props {
  navigation: CardListScreenNavigationProp;
}

interface PaginationState {
  skip: number;
  limit: number;
  total: number;
}

const CardListScreen: React.FC<Props> = ({ navigation }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [filters, setFilters] = useState<FiltersResponse>({
    types: [],
    colors: [],
    races: [],
    packages: [],
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({ skip: 0, limit: 20, total: 0 });

  useEffect(() => {
    loadFilters();
    loadCards();
  }, []);

  const loadFilters = async (): Promise<void> => {
    try {
      const filterData = await getFilters();
      setFilters(filterData);
    } catch (error) {
      console.error('Failed to load filters:', error);
    }
  };

  const loadCards = async (
    isRefresh: boolean = false,
    loadMore: boolean = false
  ): Promise<void> => {
    if (loading) return;

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const skip = loadMore ? pagination.skip + pagination.limit : 0;

      const params: Record<string, string | number> = {
        limit: pagination.limit,
        skip: skip,
      };

      if (searchQuery) params.search = searchQuery;
      if (selectedType) params.card_type = selectedType;
      if (selectedColor) params.color = selectedColor;

      const data = await getCards(params);

      if (loadMore) {
        setCards([...cards, ...data.cards]);
      } else {
        setCards(data.cards);
      }

      setPagination({
        skip: skip,
        limit: data.limit,
        total: data.total,
      });
    } catch (error) {
      console.error('Failed to load cards:', error);
      Alert.alert('Error', 'Failed to load cards. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = (): void => {
    loadCards(true);
  };

  const handleSearch = (): void => {
    setPagination({ ...pagination, skip: 0 });
    loadCards();
  };

  const handleClearFilters = (): void => {
    setSearchQuery('');
    setSelectedType('');
    setSelectedColor('');
    setPagination({ ...pagination, skip: 0 });
    setTimeout(() => loadCards(), 100);
  };

  const handleLoadMore = (): void => {
    if (cards.length < pagination.total && !loading) {
      loadCards(false, true);
    }
  };

  const getColorCode = (color: string): string => {
    const colors: Record<string, string> = {
      Red: '#E74C3C',
      Blue: '#3498DB',
      Green: '#27AE60',
      Yellow: '#F1C40F',
      White: '#ECF0F1',
      Black: '#34495E',
    };
    return colors[color] || '#95A5A6';
  };

  const renderCard: ListRenderItem<Card> = ({ item }) => (
    <TouchableOpacity
      style={styles.cardItem}
      onPress={() => navigation.navigate('CardDetail', { card: item })}
    >
      <Image
        source={{ uri: item.image_url || 'https://via.placeholder.com/150' }}
        style={styles.cardImage}
        resizeMode="contain"
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardId}>{item.card_id}</Text>
        <Text style={styles.cardName} numberOfLines={2}>
          {item.card_name}
        </Text>
        <View style={styles.cardMeta}>
          {item.type && (
            <View style={[styles.badge, styles.typeBadge]}>
              <Text style={styles.badgeText}>{item.type}</Text>
            </View>
          )}
          {item.color && (
            <View style={[styles.badge, { backgroundColor: getColorCode(item.color) }]}>
              <Text style={styles.badgeText}>{item.color}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or ID..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.filterToggle} onPress={() => setShowFilters(!showFilters)}>
        <Text style={styles.filterToggleText}>{showFilters ? '▼' : '▶'} Filters</Text>
      </TouchableOpacity>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Type:</Text>
            <View style={styles.filterOptions}>
              {filters.types.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.filterChip, selectedType === type && styles.filterChipActive]}
                  onPress={() => {
                    setSelectedType(selectedType === type ? '' : type);
                    setPagination({ ...pagination, skip: 0 });
                  }}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedType === type && styles.filterChipTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Color:</Text>
            <View style={styles.filterOptions}>
              {filters.colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.filterChip, selectedColor === color && styles.filterChipActive]}
                  onPress={() => {
                    setSelectedColor(selectedColor === color ? '' : color);
                    setPagination({ ...pagination, skip: 0 });
                  }}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedColor === color && styles.filterChipTextActive,
                    ]}
                  >
                    {color}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.applyButton} onPress={handleSearch}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Text style={styles.resultCount}>
        Showing {cards.length} of {pagination.total} cards
      </Text>

      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item) => item.card_id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && !refreshing ? (
            <ActivityIndicator size="large" color="#0066cc" style={styles.loader} />
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No cards found</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filterToggle: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  filterToggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipActive: {
    backgroundColor: '#0066cc',
  },
  filterChipText: {
    fontSize: 12,
    color: '#333',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#95a5a6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultCount: {
    padding: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 12,
    color: '#666',
  },
  listContainer: {
    padding: 10,
  },
  cardItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: 80,
    height: 110,
    borderRadius: 4,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  cardId: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginTop: 4,
  },
  typeBadge: {
    backgroundColor: '#34495e',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default CardListScreen;
