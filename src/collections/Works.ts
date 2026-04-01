import type { CollectionConfig } from 'payload'

export const Works: CollectionConfig = {
  slug: 'works',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'listingType', 'priceARS', 'priceUSD', 'status'],
    description: 'Esculturas y bustos disponibles para encargar',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Nombre',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL (slug)',
      required: true,
      unique: true,
      admin: {
        description: 'Identificador único en la URL. Ej: batman-battle-damaged',
      },
    },
    {
      name: 'photos',
      type: 'array',
      label: 'Fotos',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Descripción',
    },
    {
      name: 'materials',
      type: 'text',
      label: 'Materiales',
      admin: {
        description: 'Ej: Resina, poliuretano, pintura acrílica',
      },
    },
    {
      name: 'dimensions',
      type: 'text',
      label: 'Dimensiones',
      admin: {
        description: 'Ej: 35 cm de altura',
      },
    },
    {
      name: 'listingType',
      type: 'select',
      label: 'Tipo',
      required: true,
      options: [
        { label: 'Por encargo (commission)', value: 'commission' },
        { label: 'Disponible', value: 'available' },
      ],
      defaultValue: 'commission',
    },
    {
      name: 'priceARS',
      type: 'number',
      label: 'Precio (ARS)',
      admin: {
        description: 'Precio en pesos argentinos.',
      },
    },
    {
      name: 'priceUSD',
      type: 'number',
      label: 'Precio (USD)',
      admin: {
        description: 'Precio en dólares (referencia para compradores internacionales).',
      },
    },
    {
      name: 'productionTime',
      type: 'text',
      label: 'Tiempo de producción',
      admin: {
        description: 'Ej: "3–5 semanas" o "Entrega inmediata"',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Estado',
      required: true,
      options: [
        { label: 'Publicado', value: 'published' },
        { label: 'Borrador', value: 'draft' },
      ],
      defaultValue: 'draft',
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Descripción SEO',
      admin: {
        description: 'Texto breve para Google (máx. 160 caracteres)',
      },
    },
  ],
}
