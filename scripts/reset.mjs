// scripts/reset.ts
import { getPayload } from "payload";

// src/payload.config.ts
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path2 from "path";
import { fileURLToPath } from "url";

// src/collections/Users.ts
var Users = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email"
  },
  fields: [
    {
      name: "name",
      type: "text"
    }
  ]
};

// src/collections/Media.ts
import path from "path";
var Media = {
  slug: "media",
  access: {
    read: () => true
  },
  admin: {
    useAsTitle: "filename"
  },
  upload: {
    staticDir: path.resolve("./public/media"),
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 400,
        position: "centre"
      },
      {
        name: "card",
        width: 800,
        height: 800,
        position: "centre"
      },
      {
        name: "full",
        width: 1600,
        height: void 0,
        position: "centre"
      }
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*"]
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Texto alternativo"
    }
  ]
};

// src/collections/Works.ts
var Works = {
  slug: "works",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "listingType", "priceARS", "priceUSD", "status"],
    description: "Esculturas y bustos disponibles para encargar"
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Nombre",
      required: true
    },
    {
      name: "slug",
      type: "text",
      label: "URL (slug)",
      required: true,
      unique: true,
      admin: {
        description: "Identificador \xFAnico en la URL. Ej: batman-battle-damaged"
      }
    },
    {
      name: "photos",
      type: "array",
      label: "Fotos",
      required: true,
      minRows: 1,
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true
        }
      ]
    },
    {
      name: "description",
      type: "richText",
      label: "Descripci\xF3n"
    },
    {
      name: "materials",
      type: "text",
      label: "Materiales",
      admin: {
        description: "Ej: Resina, poliuretano, pintura acr\xEDlica"
      }
    },
    {
      name: "dimensions",
      type: "text",
      label: "Dimensiones",
      admin: {
        description: "Ej: 35 cm de altura"
      }
    },
    {
      name: "listingType",
      type: "select",
      label: "Tipo",
      required: true,
      options: [
        { label: "Por encargo (commission)", value: "commission" },
        { label: "Disponible", value: "available" }
      ],
      defaultValue: "commission"
    },
    {
      name: "priceARS",
      type: "number",
      label: "Precio (ARS)",
      admin: {
        description: "Precio en pesos argentinos."
      }
    },
    {
      name: "priceUSD",
      type: "number",
      label: "Precio (USD)",
      admin: {
        description: "Precio en d\xF3lares (referencia para compradores internacionales)."
      }
    },
    {
      name: "productionTime",
      type: "text",
      label: "Tiempo de producci\xF3n",
      admin: {
        description: 'Ej: "3\u20135 semanas" o "Entrega inmediata"'
      }
    },
    {
      name: "status",
      type: "select",
      label: "Estado",
      required: true,
      options: [
        { label: "Publicado", value: "published" },
        { label: "Borrador", value: "draft" }
      ],
      defaultValue: "draft"
    },
    {
      name: "metaDescription",
      type: "textarea",
      label: "Descripci\xF3n SEO",
      admin: {
        description: "Texto breve para Google (m\xE1x. 160 caracteres)"
      }
    }
  ]
};

// src/payload.config.ts
var filename = fileURLToPath(import.meta.url);
var dirname = path2.dirname(filename);
var payload_config_default = buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: "\u2014 Cristian Crovato Admin"
    }
  },
  collections: [Users, Media, Works],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path2.resolve(dirname, "payload-types.ts")
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || ""
    }
  }),
  upload: {
    limits: {
      fileSize: 1e7
      // 10MB
    }
  }
});

// scripts/reset.ts
async function reset() {
  const payload = await getPayload({ config: payload_config_default });
  const works = await payload.find({ collection: "works", limit: 1e3 });
  for (const work of works.docs) {
    await payload.delete({ collection: "works", id: work.id });
  }
  console.log(`\u2713 deleted ${works.docs.length} works`);
  const media = await payload.find({ collection: "media", limit: 1e3 });
  for (const item of media.docs) {
    await payload.delete({ collection: "media", id: item.id });
  }
  console.log(`\u2713 deleted ${media.docs.length} media items`);
  process.exit(0);
}
reset().catch((err) => {
  console.error(err);
  process.exit(1);
});
