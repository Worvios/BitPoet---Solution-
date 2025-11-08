import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    'Missing Sanity configuration. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN with editor access.'
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-05-22'
});

async function seed() {
  const siteSettingsId = 'siteSettings';

  await client.createOrReplace({
    _id: siteSettingsId,
    _type: 'siteSettings',
    title: {
      en: 'BitPoet',
      fr: 'BitPoet',
      ar: 'BitPoet'
    },
    tagline: {
      en: 'Software and Soul',
      fr: 'Logiciel et âme',
      ar: 'برمجيات بروح'
    },
    footerNote: {
      en: 'Crafting soulful software for bold brands.',
      fr: 'Des logiciels sensibles pour des marques audacieuses.',
      ar: 'نصمم برامج نابضة للحالمين.'
    },
    contactEmail: 'hello@bitpoet.studio',
    socialLinks: [
      { _key: 'github', label: 'GitHub', url: 'https://github.com/bitpoet' },
      { _key: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/company/bitpoet' }
    ]
  });

  const services = [
    {
      _type: 'service',
      _id: 'service-strategy',
      orderRank: 1,
      title: { en: 'Product Strategy', fr: 'Stratégie produit', ar: 'استراتيجية المنتج' },
      summary: {
        en: 'Research, positioning, and roadmaps tuned for traction.',
        fr: 'Recherche, positionnement et plans d’action pour accélérer.',
        ar: 'أبحاث وخطط واضحة لتسريع النمو.'
      }
    },
    {
      _type: 'service',
      _id: 'service-design',
      orderRank: 2,
      title: { en: 'Design Systems', fr: 'Design systems', ar: 'أنظمة تصميم' },
      summary: {
        en: 'Composable interface libraries and tokens for every platform.',
        fr: 'Bibliothèques modulaires pour des expériences cohérentes.',
        ar: 'مكتبات واجهات مرنة لكل المنصات.'
      }
    },
    {
      _type: 'service',
      _id: 'service-engineering',
      orderRank: 3,
      title: { en: 'Full-stack Engineering', fr: 'Ingénierie full-stack', ar: 'هندسة كاملة' },
      summary: {
        en: 'Next.js, TypeScript, and cloud-native delivery with poetry.',
        fr: 'Next.js, TypeScript et déploiements cloud avec poésie.',
        ar: 'Next.js وTypeScript ونشر سحابي بإيقاع شعري.'
      }
    }
  ];

  const authorId = 'author-bitpoet';

  await client.createOrReplace({
    _type: 'author',
    _id: authorId,
    name: 'BitPoet Studio',
    role: 'Team'
  });

  const blogPostId = 'post-neon';

  await client.createOrReplace({
    _type: 'blogPost',
    _id: blogPostId,
    title: {
      en: 'Designing with Neon Systems',
      fr: 'Concevoir avec des systèmes néon',
      ar: 'التصميم بأنظمة نيون'
    },
    slug: { current: 'designing-with-neon-systems' },
    excerpt: {
      en: 'How we choreograph luminous interfaces that still ship fast.',
      fr: 'Notre méthode pour créer des interfaces lumineuses et rapides.',
      ar: 'كيف نبني واجهات مضيئة دون التضحية بالسرعة.'
    },
    publishedAt: new Date().toISOString(),
    author: { _type: 'reference', _ref: authorId },
    body: {
      en: [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'Neon is more than a color palette — it is a contract with energy.' }]
        }
      ],
      fr: [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'Le néon va au-delà d’une palette — c’est un pacte avec l’énergie.' }]
        }
      ],
      ar: [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'النيون أكثر من ألوان، إنه وعد بالطاقة.' }]
        }
      ]
    },
    seo: {
      description: {
        en: 'A primer on building radiant, fast experiences.',
        fr: 'Guide pour des expériences lumineuses et performantes.',
        ar: 'دليل لتجارب مشرقة وسريعة.'
      }
    }
  });

  const projects = [
    {
      _type: 'project',
      _id: 'project-celestial',
      title: { en: 'Celestial Portal', fr: 'Portail Céleste', ar: 'بوابة سماوية' },
      summary: {
        en: 'Immersive VR retail experience with adaptive lighting.',
        fr: 'Expérience VR immersive pour le retail avec lumière adaptative.',
        ar: 'تجربة واقع افتراضي للبيع بالتجزئة بإضاءة ذكية.'
      },
      slug: { current: 'celestial-portal' },
      categories: ['VR', 'Retail'],
      private: false,
      orderRank: 1
    },
    {
      _type: 'project',
      _id: 'project-nda',
      title: { en: 'Luminous Ledger', fr: 'Grand livre lumineux', ar: 'دفتر نيوني' },
      summary: {
        en: 'Confidential fintech platform with generative dashboards.',
        fr: 'Plateforme fintech confidentielle avec tableaux génératifs.',
        ar: 'منصة مالية خاصة بلوحات معلومات توليدية.'
      },
      slug: { current: 'luminous-ledger' },
      categories: ['Fintech'],
      private: true,
      orderRank: 2
    }
  ];

  await Promise.all([...services.map((service) => client.createOrReplace(service)), ...projects.map((project) => client.createOrReplace(project))]);

  await client.createOrReplace({
    _type: 'page',
    _id: 'page-home',
    title: { en: 'Home', fr: 'Accueil', ar: 'الرئيسية' },
    slug: { current: 'home' },
    heroHeadline: {
      en: 'BitPoet orchestrates code and cadence.',
      fr: 'BitPoet orchestre code et cadence.',
      ar: 'BitPoet توحّد الإيقاع والبرمجة.'
    },
    heroSubheadline: {
      en: 'A future-facing studio crafting luminous digital experiences.',
      fr: 'Studio tourné vers le futur pour des expériences digitales lumineuses.',
      ar: 'استوديو يستشرف المستقبل لتجارب رقمية متوهجة.'
    },
    sections: [
      {
        _key: 'about',
        heading: {
          en: 'Our Process',
          fr: 'Notre démarche',
          ar: 'منهجيتنا'
        },
        body: {
          en: [
            {
              _type: 'block',
              style: 'normal',
              children: [{ _type: 'span', text: 'Discovery sprints, modular design, and resilient delivery.' }]
            }
          ],
          fr: [
            {
              _type: 'block',
              style: 'normal',
              children: [{ _type: 'span', text: 'Sprints d’exploration, design modulaire et livraison résiliente.' }]
            }
          ],
          ar: [
            {
              _type: 'block',
              style: 'normal',
              children: [{ _type: 'span', text: 'انطلاقة اكتشاف، تصميم معياري، وتسليم متين.' }]
            }
          ]
        }
      }
    ],
    seo: {
      description: {
        en: 'BitPoet — Software and Soul.',
        fr: 'BitPoet — logiciel et âme.',
        ar: 'BitPoet — برمجيات بروح.'
      }
    }
  });

  console.log('Sanity content seeded.');
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
