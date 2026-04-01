// scripts/seed.ts
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

// scripts/data/works.json
var works_default = [
  {
    title: "Batman",
    slug: "batman",
    images: ["Batman.jpeg", "Batman2.jpeg"],
    description: "Busto del Caballero de la Noche en plena batalla, con heridas y marcas de combate. Esculpido a mano en plastilina y masilla epoxi, con texturas de tela, poros y pliegues de una precisi\xF3n extraordinaria. El cliente puede elegir los colores del traje y decidir si agregar o quitar sangre y marcas de batalla.",
    materials: "Plastilina, masilla epoxi, resina poli\xE9ster, poliuretano expandido, pintado con acr\xEDlicos",
    dimensions: "39 cm de altura",
    listingType: "available",
    priceUSD: 300,
    priceARS: 348e3,
    productionTime: "Entrega inmediata",
    status: "published",
    metaDescription: "Busto de Batman 39 cm. Resina pintada a mano. Personalizable en colores y detalles de batalla."
  },
  {
    title: "Daredevil",
    slug: "daredevil",
    images: ["Daredevil.jpeg", "DaredevilAmarillo.jpeg", "DaredevilClasiv.jpeg", "DaredevilRojo.jpeg"],
    description: "El Hombre sin Miedo en cuatro versiones distintas: traje negro de la serie Netflix, traje amarillo cl\xE1sico del c\xF3mic, y traje rojo cl\xE1sico con y sin da\xF1o de batalla. Cada panel de armadura y pliegue de cuero fue esculpido a mano con detalle milim\xE9trico. El cliente puede elegir los colores del traje y personalizar el busto a su gusto.",
    materials: "Plastilina, masilla epoxi, resina poli\xE9ster, poliuretano expandido, pintado con acr\xEDlicos",
    dimensions: "39 cm de altura",
    listingType: "available",
    priceUSD: 280,
    priceARS: 325e3,
    productionTime: "Entrega inmediata",
    status: "published",
    metaDescription: "Busto de Daredevil 39 cm. Disponible en m\xFAltiples variantes de color. Resina pintada a mano. Personalizable."
  },
  {
    title: "Kratos \u2014 God of War",
    slug: "kratos",
    images: ["Kratos.jpeg"],
    description: "El Dios de la Guerra en toda su magnificencia: marcas tribales rojas, barba trabajada pelo a pelo, cadenas de cuero n\xF3rdico y la imponente hacha Leviat\xE1n con runas grabadas. Uno de los trabajos m\xE1s complejos por la variedad de texturas: piel, pelo, cuero y metal. El hacha fue realizada en impresora 3D. El cliente puede elegir los colores y personalizar la escultura.",
    materials: "Plastilina, masilla epoxi, resina poli\xE9ster, poliuretano expandido, accesorios impresos en 3D, pintado con acr\xEDlicos",
    dimensions: "39 cm de altura",
    listingType: "available",
    priceUSD: 380,
    priceARS: 441e3,
    productionTime: "Entrega inmediata",
    status: "published",
    metaDescription: "Busto de Kratos God of War 39 cm con hacha Leviat\xE1n. Resina pintada a mano. Personalizable."
  },
  {
    title: "Lobo \u2014 DC Comics",
    slug: "lobo",
    images: ["Lobo.jpeg", "Lobo2.jpeg"],
    description: "El \xDAltimo Czarniano con toda su actitud desbordante: chaqueta de cuero con tachas y pinchos, colmillos amenazantes, cigarrillo en la boca y la ic\xF3nica cruz de hierro roja colgando en el pecho. Uno de los personajes m\xE1s exigentes por sus texturas de pelo, cuero y accesorios met\xE1licos. El cliente puede elegir los colores y personalizar la escultura.",
    materials: "Plastilina, masilla epoxi, resina poli\xE9ster, poliuretano expandido, pintado con acr\xEDlicos",
    dimensions: "39 cm de altura",
    listingType: "available",
    priceUSD: 340,
    priceARS: 395e3,
    productionTime: "Entrega inmediata",
    status: "published",
    metaDescription: "Busto de Lobo DC Comics 39 cm. Resina pintada a mano con texturas de cuero y pelo. Personalizable."
  },
  {
    title: "The Mandalorian",
    slug: "the-mandalorian",
    images: ["Mandalorian.jpeg", "Mandarlorian2.jpeg"],
    description: "Din Djarin con su inconfundible armadura beskar desgastada en tonos met\xE1licos y marrones, bandolera de munici\xF3n y el casco ic\xF3nico. Cada cicatriz de batalla, remache y pliegue de tela fue esculpido con fidelidad al personaje. Los paneles de armadura se realizaron en impresora 3D. El cliente puede elegir los colores y personalizar el acabado de la armadura.",
    materials: "Plastilina, masilla epoxi, resina poli\xE9ster, poliuretano expandido, accesorios impresos en 3D, pintado con acr\xEDlicos",
    dimensions: "39 cm de altura",
    listingType: "available",
    priceUSD: 360,
    priceARS: 418e3,
    productionTime: "Entrega inmediata",
    status: "published",
    metaDescription: "Busto de The Mandalorian 39 cm. Armadura detallada, resina pintada a mano. Personalizable."
  },
  {
    title: "Old Man Logan",
    slug: "old-man-logan",
    images: ["Oldman Logan.jpeg"],
    description: "Un Logan envejecido y curtido por d\xE9cadas de combate: arrugas profundas, cicatrices en el rostro, cigarrillo en la boca y camisa ensangrentada bajo su chaqueta de cuero. La versi\xF3n m\xE1s humana y visceral del personaje, con texturas de piel y ropa desgastada de una precisi\xF3n asombrosa. El cliente puede elegir los colores y personalizar los detalles de la escultura.",
    materials: "Plastilina, masilla epoxi, resina poli\xE9ster, poliuretano expandido, pintado con acr\xEDlicos",
    dimensions: "39 cm de altura",
    listingType: "available",
    priceUSD: 320,
    priceARS: 372e3,
    productionTime: "Entrega inmediata",
    status: "published",
    metaDescription: "Busto de Old Man Logan 39 cm. Resina pintada a mano con texturas hiperrealistas. Personalizable."
  },
  {
    title: "The Punisher",
    slug: "the-punisher",
    images: ["Punisher.jpeg", "Punisher2.jpeg"],
    description: "Frank Castle en modo guerra total, con el m\xEDtico cr\xE1neo en la remera negra manchada de sangre, arn\xE9s t\xE1ctico y las pistolas impresas en 3D al hombro. Un retrato crudo y detallado del implacable justiciero de Marvel, con texturas de tela, cuero y piel hiperrealistas. El cliente puede elegir los colores y personalizar los niveles de da\xF1o de batalla.",
    materials: "Plastilina, masilla epoxi, resina poli\xE9ster, poliuretano expandido, accesorios impresos en 3D, pintado con acr\xEDlicos",
    dimensions: "39 cm de altura",
    listingType: "available",
    priceUSD: 300,
    priceARS: 348e3,
    productionTime: "Entrega inmediata",
    status: "published",
    metaDescription: "Busto de The Punisher 39 cm con accesorios t\xE1cticos. Resina pintada a mano. Personalizable."
  },
  {
    title: "Spawn",
    slug: "spawn",
    images: ["Span.jpeg"],
    description: "El Aparecido con su imponente traje negro y blanco, capa roja desplegada al viento y ojos verde ne\xF3n encendidos. Las calaveras de plata que sujetan la capa y las texturas del simbionte fueron esculpidas con una precisi\xF3n extraordinaria. El cliente puede elegir los colores y personalizar la escultura.",
    materials: "Plastilina, masilla epoxi, resina poli\xE9ster, poliuretano expandido, pintado con acr\xEDlicos",
    dimensions: "39 cm de altura",
    listingType: "available",
    priceUSD: 340,
    priceARS: 395e3,
    productionTime: "Entrega inmediata",
    status: "published",
    metaDescription: "Busto de Spawn 39 cm. Resina pintada a mano con capa roja y traje texturado. Personalizable."
  },
  {
    title: "Spider-Man",
    slug: "spider-man",
    images: ["Spiderman.jpeg"],
    description: "El Hombre Ara\xF1a en su traje cl\xE1sico rojo y azul, con la red texturada del traje perfectamente detallada sobre el pecho, hombros y cuello. Cada l\xEDnea de la tela de ara\xF1a fue esculpida a mano para lograr una fidelidad absoluta al personaje. El cliente puede elegir los colores y personalizar la escultura seg\xFAn su versi\xF3n favorita del personaje.",
    materials: "Plastilina, masilla epoxi, resina poli\xE9ster, poliuretano expandido, pintado con acr\xEDlicos",
    dimensions: "39 cm de altura",
    listingType: "available",
    priceUSD: 280,
    priceARS: 325e3,
    productionTime: "Entrega inmediata",
    status: "published",
    metaDescription: "Busto de Spider-Man 39 cm. Traje texturado, resina pintada a mano. Personalizable en colores."
  },
  {
    title: "The Thing \u2014 Los 4 Fant\xE1sticos",
    slug: "the-thing",
    images: ["The thing.jpeg"],
    description: "La Cosa de los Cuatro Fant\xE1sticos con su caracter\xEDstica piel de roca naranja, ojos azules intensos y el cl\xE1sico puro en la boca. Cada bloque de roca del cuerpo fue esculpido individualmente para lograr un acabado \xFAnico y de enorme profundidad. El cliente puede elegir los colores y personalizar la escultura.",
    materials: "Plastilina, masilla epoxi, resina poli\xE9ster, poliuretano expandido, pintado con acr\xEDlicos",
    dimensions: "39 cm de altura",
    listingType: "available",
    priceUSD: 320,
    priceARS: 372e3,
    productionTime: "Entrega inmediata",
    status: "published",
    metaDescription: "Busto de The Thing 39 cm. Piel de roca texturada, resina pintada a mano. Personalizable."
  }
];

// scripts/seed.ts
import fs from "fs";
import path3 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
var __dirname = path3.dirname(fileURLToPath2(import.meta.url));
function toRichText(text) {
  return {
    root: {
      children: [
        {
          children: [
            { detail: 0, format: 0, mode: "normal", style: "", text, type: "text", version: 1 }
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1
        }
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1
    }
  };
}
async function seed() {
  const payload = await getPayload({ config: payload_config_default });
  for (const work of works_default) {
    const existing = await payload.find({
      collection: "works",
      where: { slug: { equals: work.slug } },
      limit: 1
    });
    if (existing.totalDocs > 0) {
      console.log(`\u21B7 skipped (exists): ${work.title}`);
      continue;
    }
    const uploadedPhotos = [];
    for (const filename2 of work.images) {
      const imagePath = path3.join(__dirname, "data/images", filename2);
      if (!fs.existsSync(imagePath)) {
        console.error(`  \u2717 image not found: ${imagePath}`);
        continue;
      }
      const imageBuffer = fs.readFileSync(imagePath);
      const media = await payload.create({
        collection: "media",
        data: { alt: work.title },
        file: {
          data: imageBuffer,
          name: filename2,
          mimetype: "image/jpeg",
          size: imageBuffer.length
        }
      });
      uploadedPhotos.push({ image: media.id });
    }
    if (uploadedPhotos.length === 0) {
      console.error(`\u2717 no images uploaded for: ${work.title}`);
      continue;
    }
    await payload.create({
      collection: "works",
      data: {
        title: work.title,
        slug: work.slug,
        description: toRichText(work.description),
        materials: work.materials,
        dimensions: work.dimensions,
        listingType: work.listingType,
        priceUSD: work.priceUSD,
        priceARS: work.priceARS,
        productionTime: work.productionTime,
        status: work.status,
        metaDescription: work.metaDescription,
        photos: uploadedPhotos
      }
    });
    console.log(`\u2713 created: ${work.title}`);
  }
  process.exit(0);
}
seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
