import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type CardDetailScreenRouteProp = RouteProp<RootStackParamList, 'CardDetail'>;

interface Props {
  route: CardDetailScreenRouteProp;
}

const CardDetailScreen: React.FC<Props> = ({ route }) => {
  const { card } = route.params;

  const renderField = (label: string, value: string | undefined): JSX.Element | null => {
    if (!value) return null;

    return (
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>{label}:</Text>
        <Text style={styles.fieldValue}>{value}</Text>
      </View>
    );
  };

  const renderEffects = (effects: string[] | undefined): JSX.Element | null => {
    if (!effects || effects.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Effects</Text>
        {effects.map((effect, index) => (
          <View key={index} style={styles.effectItem}>
            <Text style={styles.effectText}>{effect}</Text>
          </View>
        ))}
      </View>
    );
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

  const handleOpenLink = async (): Promise<void> => {
    if (card.card_link) {
      try {
        const supported = await Linking.canOpenURL(card.card_link);
        if (supported) {
          await Linking.openURL(card.card_link);
        } else {
          console.log("Can't open URL:", card.card_link);
        }
      } catch (error) {
        console.error('Error opening link:', error);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: card.image_url || 'https://via.placeholder.com/300' }}
          style={styles.cardImage}
          resizeMode="contain"
        />
        <View style={styles.headerInfo}>
          <Text style={styles.cardId}>{card.card_id}</Text>
          <Text style={styles.cardName}>{card.card_name}</Text>

          <View style={styles.badges}>
            {card.type && (
              <View style={[styles.badge, styles.typeBadge]}>
                <Text style={styles.badgeText}>{card.type}</Text>
              </View>
            )}
            {card.color && (
              <View style={[styles.badge, { backgroundColor: getColorCode(card.color) }]}>
                <Text style={styles.badgeText}>{card.color}</Text>
              </View>
            )}
            {card.package && (
              <View style={[styles.badge, styles.packageBadge]}>
                <Text style={styles.badgeText}>{card.package}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {renderEffects(card.effects)}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Card Details</Text>
          {renderField('Race/Trait', card.race)}
          {renderField('Level', card.level)}
          {renderField('Cost', card.cost)}
          {renderField('AP (Attack Power)', card.ap)}
          {renderField('HP (Hit Points)', card.hp)}
          {renderField('Zone', card.zone)}
          {renderField('Link', card.link)}
          {renderField('Source', card.source_title)}
        </View>

        {card.card_link && (
          <TouchableOpacity style={styles.linkButton} onPress={handleOpenLink}>
            <Text style={styles.linkButtonText}>View on Official Site</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cardImage: {
    width: 250,
    height: 350,
    marginBottom: 16,
  },
  headerInfo: {
    width: '100%',
    alignItems: 'center',
  },
  cardId: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  cardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
    marginVertical: 4,
  },
  typeBadge: {
    backgroundColor: '#34495e',
  },
  packageBadge: {
    backgroundColor: '#7f8c8d',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#0066cc',
    paddingBottom: 8,
  },
  effectItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#0066cc',
  },
  effectText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  field: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 140,
  },
  fieldValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  linkButton: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CardDetailScreen;
