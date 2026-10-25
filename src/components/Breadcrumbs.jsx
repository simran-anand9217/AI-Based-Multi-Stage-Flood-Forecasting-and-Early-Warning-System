import React from 'react';
import { ChevronRight, Home, MapPin, Layers } from 'lucide-react';

export default function Breadcrumbs({ basinName, pageTitle, title }) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '6px 0 16px 0',
        fontSize: '0.78rem',
        color: 'var(--text-muted)'
      }}
    >
      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        style={{
          display: 'flex',
          alignItems: 'center',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          gap: '6px',
          flexWrap: 'wrap'
        }}
      >
        {/* Item 1: Home Dashboard */}
        <li
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <a
            itemProp="item"
            href="/"
            style={{
              color: 'var(--text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--cyan-400)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <Home size={13} aria-hidden="true" />
            <span itemProp="name">Dashboard</span>
          </a>
          <meta itemProp="position" content="1" />
        </li>

        <ChevronRight size={12} style={{ color: 'var(--text-dim)' }} aria-hidden="true" />

        {/* Item 2: Basin Filter */}
        <li
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <span
            style={{
              color: 'var(--cyan-400)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 600
            }}
          >
            <MapPin size={13} aria-hidden="true" />
            <span itemProp="name">{basinName} Basin</span>
          </span>
          <meta itemProp="position" content="2" />
        </li>

        <ChevronRight size={12} style={{ color: 'var(--text-dim)' }} aria-hidden="true" />

        {/* Item 3: Current View */}
        <li
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
          aria-current="page"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <span
            style={{
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 600,
              background: 'rgba(56, 189, 248, 0.1)',
              padding: '2px 8px',
              borderRadius: '6px',
              border: '1px solid var(--border-light)'
            }}
          >
            <Layers size={12} color="var(--cyan-400)" aria-hidden="true" />
            <span itemProp="name">
              {pageTitle || title || 'Real-Time Hydrological Forecast'}
            </span>
          </span>
          <meta itemProp="position" content="3" />
        </li>
      </ol>
    </nav>
  );
}
