import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CalendarDays, Network } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { siteSections } from "../site-navigation";
import "./SiteNavbar.css";

export function SiteNavbar({
  activeSectionIndex = null,
  flowHeader = false,
  logoSrc = "/assets/LOGO IFA COLORIDA COMPLETA.png",
  logoToHome = false,
  logoVisible = true,
  menuOpen,
  onMenuOpenChange,
  onSectionSelect,
}: {
  activeSectionIndex?: number | null;
  flowHeader?: boolean;
  logoSrc?: string;
  logoToHome?: boolean;
  logoVisible?: boolean;
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
  onSectionSelect: (index: number) => void;
}) {
  const { pathname } = useLocation();

  useEffect(() => {
    onMenuOpenChange(false);
  }, [pathname, onMenuOpenChange]);

  useEffect(() => {
    if (!menuOpen) return;

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onMenuOpenChange(false);
    };

    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, [menuOpen, onMenuOpenChange]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [menuOpen]);

  const logo = (
    <img src={logoSrc} alt="Instituto Futuro Atípico" width="194" height="70" />
  );

  return (
    <>
      <header className={`ifa-navbar ${flowHeader ? "ifa-navbar-flow" : ""}`} aria-label="Menu principal">
        {logoToHome ? (
          <Link
            className={`ifa-navbar-logo ${logoVisible ? "ifa-navbar-logo-visible" : ""}`}
            to="/"
            aria-label="Voltar ao Instituto Futuro Atípico"
          >
            {logo}
          </Link>
        ) : (
          <span
            className={`ifa-navbar-logo ${logoVisible ? "ifa-navbar-logo-visible" : ""}`}
            aria-hidden={!logoVisible}
          >
            {logo}
          </span>
        )}

        <button
          className={`ifa-navbar-button ${menuOpen ? "ifa-navbar-button-open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="site-navigation-menu"
          onClick={() => onMenuOpenChange(!menuOpen)}
        >
          <span className="ifa-navbar-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              key="site-menu-backdrop"
              className="ifa-menu-backdrop"
              type="button"
              aria-label="Fechar menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24 }}
              onClick={() => onMenuOpenChange(false)}
            />
            <motion.nav
              key="site-menu-panel"
              id="site-navigation-menu"
              className="ifa-menu-panel"
              aria-label="Navegação principal"
              initial={{ opacity: 0, x: 18, scale: 0.985 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 14, scale: 0.99 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="ifa-menu-heading">
                <div>
                  <span className="ifa-menu-kicker">Navegação</span>
                  <h2>Explore o Instituto</h2>
                </div>
                <span className="ifa-menu-progress">
                  {activeSectionIndex === null ? (
                    <>11<small> seções</small></>
                  ) : (
                    <>
                      {String(activeSectionIndex + 1).padStart(2, "0")}
                      <small>/ {String(siteSections.length).padStart(2, "0")}</small>
                    </>
                  )}
                </span>
              </div>

              <div className="ifa-menu-list">
                {siteSections.map((section, index) => (
                  <button
                    key={section.id}
                    className={`ifa-menu-item ifa-menu-accent-${index % 4} ${
                      index === activeSectionIndex ? "ifa-menu-item-active" : ""
                    }`}
                    type="button"
                    aria-current={index === activeSectionIndex ? "page" : undefined}
                    onClick={() => {
                      onMenuOpenChange(false);
                      onSectionSelect(index);
                    }}
                  >
                    <span className="ifa-menu-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="ifa-menu-label">{section.eyebrow}</span>
                    <ArrowRight className="ifa-menu-arrow" aria-hidden="true" />
                  </button>
                ))}
              </div>

              <nav className="ifa-menu-shortcuts" aria-label="Acessos rápidos">
                <span className="ifa-menu-shortcuts-label">Acessos rápidos</span>
                <div className="ifa-menu-shortcuts-grid">
                  <Link
                    className={`ifa-menu-shortcut ifa-menu-shortcut-events ${
                      pathname === "/eventos" ? "ifa-menu-shortcut-active" : ""
                    }`}
                    to="/eventos"
                    aria-current={pathname === "/eventos" ? "page" : undefined}
                  >
                    <CalendarDays aria-hidden="true" />
                    <span>Eventos</span>
                    <ArrowRight aria-hidden="true" />
                  </Link>
                  <Link
                    className={`ifa-menu-shortcut ifa-menu-shortcut-partners ${
                      pathname === "/parceiros" ? "ifa-menu-shortcut-active" : ""
                    }`}
                    to="/parceiros"
                    aria-current={pathname === "/parceiros" ? "page" : undefined}
                  >
                    <Network aria-hidden="true" />
                    <span>Parceiros</span>
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </nav>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
