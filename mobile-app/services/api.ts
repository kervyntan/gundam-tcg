import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '../config';
import {
  Card,
  CardListResponse,
  CardStatsResponse,
  FiltersResponse,
  CardSearchParams,
} from '../types';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get cards with optional filters
 */
export const getCards = async (params: CardSearchParams = {}): Promise<CardListResponse> => {
  try {
    const response = await api.get<CardListResponse>('/api/cards', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
};

/**
 * Get a specific card by ID
 */
export const getCardById = async (cardId: string): Promise<Card> => {
  try {
    const response = await api.get<Card>(`/api/cards/${cardId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching card:', error);
    throw error;
  }
};

/**
 * Get card statistics
 */
export const getCardStats = async (): Promise<CardStatsResponse> => {
  try {
    const response = await api.get<CardStatsResponse>('/api/cards/stats/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

/**
 * Get available filter options
 */
export const getFilters = async (): Promise<FiltersResponse> => {
  try {
    const response = await api.get<FiltersResponse>('/api/filters');
    return response.data;
  } catch (error) {
    console.error('Error fetching filters:', error);
    throw error;
  }
};

export default api;
