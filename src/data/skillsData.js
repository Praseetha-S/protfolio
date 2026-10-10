export const toolkitData = [
  {
    category: 'PROGRAMMING',
    chapter: 'CHAPTER 01',
    items: [
      { name: 'Python',   desc: 'High-Level Programming & Scripting',          icon: 'fa-brands fa-python',      color: '#3776AB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
      { name: 'Java',     desc: 'Object-Oriented & Enterprise Apps',            icon: 'fa-brands fa-java',        color: '#E76F00', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
      { name: 'C',        desc: 'Foundational System Programming',              icon: 'fa-solid fa-code',         color: '#A8B9CC', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
      { name: 'SQL',      desc: 'Relational Queries & Database Management',     icon: 'fa-solid fa-database',     color: '#00758F', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' }
    ]
  },
  {
    category: 'TOOLS',
    chapter: 'CHAPTER 02',
    items: [
      { name: 'VS Code',  desc: 'Primary IDE & Code Development',               icon: 'fa-solid fa-laptop-code',   color: '#007ACC', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
      { name: 'GitHub',   desc: 'Version Control & Collaboration',              icon: 'fa-brands fa-github',       color: '#4078C0', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
      { name: 'Figma',    desc: 'UI/UX Prototyping & Interface Design',         icon: 'fa-brands fa-figma',        color: '#F24E1E', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
      { name: 'Canva',    desc: 'Visual Content & Media Design',                icon: 'fa-solid fa-palette',       color: '#00C4CC', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Canva_Logo.png' },
      { name: 'Netlify',  desc: 'Web Deployment & Hosting Platform',            icon: 'fa-solid fa-cloud-arrow-up',color: '#00C7B7', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg' },
      { name: 'Vercel',   desc: 'Frontend Cloud & Serverless Hosting',          icon: 'fa-solid fa-server',        color: '#171717', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg' }
    ]
  },
  {
    category: 'DESIGN',
    chapter: 'CHAPTER 03',
    items: [
      { name: 'UI / UX',  desc: 'User Experience & Visual Layout',             icon: 'fa-solid fa-pen-ruler',     color: '#FF61F6', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
      { name: 'Figma',    desc: 'Interactive Prototyping & Wireframing',        icon: 'fa-brands fa-figma',        color: '#F24E1E', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' }
    ]
  },
  {
    category: 'AI',
    chapter: 'CHAPTER 04',
    items: [
      { name: 'Artificial Intelligence', desc: 'Intelligent Systems & Cognitive Tech', icon: 'fa-solid fa-brain',  color: '#9B51E0', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
      { name: 'Machine Learning',        desc: 'Predictive Models & Algorithms',       icon: 'fa-solid fa-robot',  color: '#2F80ED', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg' }
    ]
  },
  {
    category: 'DATA',
    chapter: 'CHAPTER 05',
    items: [
      { name: 'Data Science', desc: 'Data Analytics & Statistical Insights',  icon: 'fa-solid fa-chart-pie',     color: '#27AE60', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' },
      { name: 'NumPy',        desc: 'Large-Scale Numerical Processing',        icon: 'fa-solid fa-network-wired', color: '#EB5757', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg' },
      { name: 'Power BI',     desc: 'Business Intelligence & Data Visualization', icon: 'fa-solid fa-chart-bar',  color: '#F2C811', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg' }
    ]
  },
  {
    category: 'SYSTEMS',
    chapter: 'CHAPTER 06',
    items: [
      { name: 'Windows',  desc: 'Primary Desktop Operating System',       icon: 'fa-brands fa-windows',      color: '#0078D6', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg' },
      { name: 'Linux',    desc: 'Terminal Command Line & Server Basics',  icon: 'fa-brands fa-linux',        color: '#FCC624', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' }
    ]
  },
  {
    category: 'CURRENTLY EXPLORING',
    chapter: 'CHAPTER 07',
    items: [
      { name: 'AIoT',           desc: 'AI + Internet of Things',         icon: 'fa-solid fa-microchip',          color: '#F2994A', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/raspberrypi/raspberrypi-original.svg' },
      { name: 'Gen AI',         desc: 'Generative AI & LLM Workflows',   icon: 'fa-solid fa-wand-magic-sparkles',color: '#9B51E0', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg' },
      { name: 'React',          desc: 'Component-Based UI Development',   icon: 'fa-brands fa-react',             color: '#61DAFB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' }
    ]
  }
];

export const flatTools = toolkitData.flatMap((catGroup, catIdx) => 
  catGroup.items.map((item, itemIdx) => ({
    ...item,
    catIdx,
    category: catGroup.category,
    chapter: catGroup.chapter,
    itemIdx,
    catTotal: catGroup.items.length
  }))
);
