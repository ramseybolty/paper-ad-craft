import { Advertisement, AdPublication } from '@/types/ad';

/**
 * Migrates old ad format to new date-specific status format
 */
export function migrateAdData(oldAd: any): Advertisement {
  // If already migrated (has publications array), return as is
  if (oldAd.publications && Array.isArray(oldAd.publications)) {
    return oldAd as Advertisement;
  }

  // Convert old format to new format
  const publications: AdPublication[] = [];
  
  if (oldAd.publishDates && Array.isArray(oldAd.publishDates)) {
    publications.push(...oldAd.publishDates.map((dateStr: string) => ({
      date: dateStr,
      status: oldAd.status || 'scheduled' as const,
      publishedAt: oldAd.status === 'published' ? oldAd.createdAt : undefined,
      cancelledAt: oldAd.status === 'cancelled' ? oldAd.createdAt : undefined
    })));
  }

  // Create migrated ad
  const migratedAd: Advertisement = {
    ...oldAd,
    publications,
    updatedAt: new Date().toISOString()
  };

  // Remove legacy fields
  delete migratedAd.publishDates;
  delete migratedAd.status;

  return migratedAd;
}

/**
 * Migrates all ads in localStorage to new format
 */
export function migrateAllAdsInStorage(): Advertisement[] {
  const existingAds = JSON.parse(localStorage.getItem('newsprint-ads') || '[]');
  const migratedAds = existingAds.map(migrateAdData);
  
  // Save migrated data back to localStorage
  localStorage.setItem('newsprint-ads', JSON.stringify(migratedAds));
  
  return migratedAds;
}

/**
 * Gets the overall status of an ad based on its publications
 */
export function getAdOverallStatus(ad: Advertisement): 'scheduled' | 'published' | 'cancelled' | 'mixed' {
  if (!ad.publications || ad.publications.length === 0) return 'scheduled';
  
  const statuses = ad.publications.map(pub => pub.status);
  const uniqueStatuses = [...new Set(statuses)];
  
  if (uniqueStatuses.length === 1) {
    return uniqueStatuses[0];
  }
  
  return 'mixed';
}

/**
 * Gets all publication dates for an ad (for backward compatibility)
 */
export function getAdPublishDates(ad: Advertisement): string[] {
  return ad.publications?.map(pub => pub.date) || [];
}

/**
 * Checks if an ad has any future publication dates (greater than yesterday)
 */
export function hasEditablePublications(ad: Advertisement): boolean {
  if (!ad.publications || ad.publications.length === 0) return false;
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(23, 59, 59, 999);
  
  return ad.publications.some(pub => {
    const pubDate = new Date(pub.date);
    pubDate.setHours(0, 0, 0, 0);
    return pubDate > yesterday;
  });
}

/**
 * Gets editable publications (with future dates)
 */
export function getEditablePublications(ad: Advertisement): AdPublication[] {
  if (!ad.publications || ad.publications.length === 0) return [];
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(23, 59, 59, 999);
  
  return ad.publications.filter(pub => {
    const pubDate = new Date(pub.date);
    pubDate.setHours(0, 0, 0, 0);
    return pubDate > yesterday;
  });
}