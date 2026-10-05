import { Router } from "express";
import { categories, menuItems } from "../data/menu.js";

export const menuRouter = Router();

menuRouter.get("/", (request, response) => {
  const category = String(request.query.category || "For You");
  const search = String(request.query.search || "").trim().toLowerCase();

  const filtered = menuItems.filter((item) => {
    const matchesCategory = category === "For You" || item.category === category;
    const matchesSearch = !search || item.name.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });

  response.json({
    categories,
    items: filtered
  });
});
