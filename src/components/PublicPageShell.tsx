import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { sectionHref } from "../site-navigation";
import { SiteNavbar } from "./SiteNavbar";
import "../content-pages.css";

export function PublicPageShell({
  children,
  eyebrow,
  title,
  description,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="content-page">
      <div className="content-background" aria-hidden="true">
        <img className="content-background-base" src="/assets/optimized/light-background.webp" alt="" width="1440" height="900" decoding="async" />
        <img className="content-corner content-corner-red" src="/assets/vermelho.svg" alt="" />
        <img className="content-corner content-corner-teal" src="/assets/azul claro.svg" alt="" />
        <img className="content-corner content-corner-blue" src="/assets/azul escuro.svg" alt="" />
        <img className="content-corner content-corner-orange" src="/assets/laranja.svg" alt="" />
      </div>

      <SiteNavbar
        logoToHome
        menuOpen={menuOpen}
        onMenuOpenChange={setMenuOpen}
        onSectionSelect={(index) => navigate(sectionHref(index))}
      />

      <main className="content-main">
        <Link className="content-back" to="/">
          <ArrowLeft /> Voltar ao site
        </Link>
        <section className="content-hero">
          <p>{eyebrow}</p>
          <h1>{title}</h1>
          <span>{description}</span>
        </section>
        {children}
      </main>
    </div>
  );
}

export function PageFeedback({
  type,
  children,
}: {
  type: "loading" | "error" | "empty";
  children: ReactNode;
}) {
  return (
    <div className={`page-feedback page-feedback-${type}`} role={type === "error" ? "alert" : "status"}>
      {type === "loading" && <span className="page-spinner" aria-hidden="true" />}
      <p>{children}</p>
    </div>
  );
}

export function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <nav className="content-pagination" aria-label="Paginação">
      <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)}>
        Anterior
      </button>
      <span>
        Página {page} de {pageCount}
      </span>
      <button type="button" disabled={page === pageCount} onClick={() => onChange(page + 1)}>
        Próxima
      </button>
    </nav>
  );
}
