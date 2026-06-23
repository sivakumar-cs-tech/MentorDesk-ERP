import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SIDEBAR_ROUTES = [
  "/",
  "/students",
  "/courses",
  "/attendance",
  "/tasks",
  "/timeline",
  "/reports",
  "/settings",
];

const SidebarRouterBridge = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const items = document.querySelectorAll(".sidebar .menu-item");
    const handlers = [];

    items.forEach((item, index) => {
      const route = SIDEBAR_ROUTES[index];
      if (!route) return;

      const handler = () => navigate(route);
      item.style.cursor = "pointer";
      item.addEventListener("click", handler);
      handlers.push({ item, handler });
    });

    return () => {
      handlers.forEach(({ item, handler }) => {
        item.removeEventListener("click", handler);
      });
    };
  }, [navigate]);

  useEffect(() => {
    const items = document.querySelectorAll(".sidebar .menu-item");
    items.forEach((item, index) => {
      const route = SIDEBAR_ROUTES[index];
      if (!route) return;
      const isActive =
        route === "/"
          ? location.pathname === "/"
          : location.pathname.startsWith(route);
      item.classList.toggle("active", isActive);
    });
  }, [location.pathname]);

  return null;
};

export default SidebarRouterBridge;
