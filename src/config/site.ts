import Logo from '@/components/Logo';
import { createElement } from 'react';
import type { ReactNode } from 'react';

/**
 * Central site configuration.
 *
 * When forking this project for a new business, update the values below.
 * Everything that is business-specific lives here — components stay generic.
 */
export interface SiteConfig {
  /** Display name shown in the Navbar, Footer, and metadata */
  brandName: string;
  /** React node used as the brand icon (Navbar + Footer) */
  brandIcon: ReactNode;
  /** Contact details shown in the Footer and About page */
  contact: {
    address: string;
    email: string;
    phone: string;
    mapsUrl: string;
    mapsEmbedUrl: string;
  };
  /** Base API path for item CRUD */
  apiBasePath: string;
  /** Public routes (locale prefix is prepended automatically) */
  routes: {
    items: string;
    about: string;
    admin: string;
    adminNewItem: string;
  };
  /** Placeholder image path */
  placeholderImage: string;
}

export const siteConfig: SiteConfig = {
  brandName: 'Car Dealership',
  brandIcon: createElement(Logo),
  contact: {
    address: '123 Main Street, Your City, Postal Code',
    email: 'contact@example.com',
    phone: '+1 234 567 890',
    mapsUrl: 'https://www.google.com/maps',
    mapsEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.184133375389!2d-73.98784492347282!3d40.74844097432666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a1a9aad!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890',
  },
  apiBasePath: '/api/cars',
  routes: {
    items: '/cars',
    about: '/about',
    admin: '/admin',
    adminNewItem: '/admin/cars/new',
  },
  placeholderImage: '/placeholder-image.svg',
};
