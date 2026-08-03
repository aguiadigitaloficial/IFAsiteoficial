export type SiteSection = {
  id: string;
  hash: string;
  eyebrow: string;
  title: string;
  copy: string;
  tone: "dark" | "light";
};

export const siteSections: SiteSection[] = [
  {
    id: "inicio",
    hash: "inicio",
    eyebrow: "Instituto Futuro Atípico",
    title: "Futuro Atípico",
    copy: "Uma experiência digital leve, precisa e fiel ao design original.",
    tone: "dark",
  },
  {
    id: "propósito",
    hash: "proposito",
    eyebrow: "Propósito",
    title: "Cada seção entra com calma.",
    copy: "O scroll conduz a navegação entre telas completas, com transições sutis e foco no conteúdo.",
    tone: "light",
  },
  {
    id: "jornada",
    hash: "jornada",
    eyebrow: "Jornada",
    title: "Movimento suave, sem pressa.",
    copy: "A estrutura já está pronta para receber as composições exatas dos prints do Figma.",
    tone: "dark",
  },
  {
    id: "contato",
    hash: "contato",
    eyebrow: "Contato",
    title: "Uma landing page completa.",
    copy: "React, TypeScript, Tailwind e Vite configurados para evoluir até a versão final.",
    tone: "light",
  },
  {
    id: "histórias",
    hash: "historias",
    eyebrow: "Histórias atendidas",
    title: "Relatos que mostram cuidado, segurança e planejamento.",
    copy: "Exemplos reais de preocupação transformada em planejamento.",
    tone: "light",
  },
  {
    id: "conversa",
    hash: "conversa",
    eyebrow: "Converse com o IFA",
    title: "O futuro não precisa depender do improviso.",
    copy: "Uma conversa consultiva para entender a realidade da família.",
    tone: "dark",
  },
  {
    id: "quem-somos",
    hash: "quem-somos",
    eyebrow: "Quem somos",
    title: "O Instituto Futuro Atípico nasceu de uma pergunta simples.",
    copy: "Quem cuida do futuro de quem dedica a vida a cuidar?",
    tone: "light",
  },
  {
    id: "quem-construiu",
    hash: "quem-construiu",
    eyebrow: "Quem construiu esse projeto",
    title: "Três trajetórias diferentes, um mesmo propósito.",
    copy: "O IFA reúne profissionais de áreas complementares.",
    tone: "light",
  },
  {
    id: "parceiro",
    hash: "seja-parceiro",
    eyebrow: "Seja um parceiro",
    title: "Faça parte da rede que apoia famílias atípicas com responsabilidade.",
    copy: "Amplie o acesso à informação, planejamento e proteção financeira familiar.",
    tone: "light",
  },
  {
    id: "explore",
    hash: "explore",
    eyebrow: "Explore o IFA",
    title: "Continue sua jornada pelo Instituto.",
    copy: "Encontre parceiros e acompanhe os próximos eventos do IFA.",
    tone: "dark",
  },
  {
    id: "perguntas-frequentes",
    hash: "perguntas-frequentes",
    eyebrow: "Perguntas frequentes",
    title: "Dúvidas comuns antes de começar.",
    copy: "Respostas para entender melhor como o IFA trabalha.",
    tone: "dark",
  },
];

export const mobileSectionTargets: Record<number, string> = {
  0: "mobile-proposito",
  1: "mobile-proposito",
  2: "mobile-jornada",
  3: "mobile-continuidade",
  4: "mobile-historias",
  5: "mobile-conversa-copy",
  6: "mobile-quem-somos-overview",
  7: "mobile-fundadores-photo",
  8: "mobile-parceiro-intro",
  9: "mobile-explore",
  10: "mobile-faq",
};

export const sectionIndexFromHash = (hash: string) => {
  const normalizedHash = decodeURIComponent(hash.replace(/^#/, ""));
  const index = siteSections.findIndex(
    (section) => section.hash === normalizedHash || section.id === normalizedHash,
  );
  return index >= 0 ? index : null;
};

export const sectionHref = (index: number) => `/#${siteSections[index]?.hash ?? "inicio"}`;
