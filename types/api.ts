import { Offer } from '../types';
import { PackageOffer } from '../lib/packages/bundler';

/**
 * API Response types
 */

export interface SearchApiResponse {
  offers: Offer[];
  packages?: boolean; // Flag to indicate if offers are actually packages
}

export interface PackageSearchApiResponse {
  offers: PackageOffer[];
  packages: true;
}

export type SearchResponse = SearchApiResponse | PackageSearchApiResponse;

