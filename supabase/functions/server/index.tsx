import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-fb3cb64e/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all research ideas
app.get("/make-server-fb3cb64e/ideas", async (c) => {
  try {
    const ideas = await kv.getByPrefix("idea:");
    return c.json({ success: true, ideas });
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create a new research idea
app.post("/make-server-fb3cb64e/ideas", async (c) => {
  try {
    const body = await c.req.json();
    const id = `idea:${Date.now()}`;
    
    const idea = {
      id,
      title: body.title,
      description: body.description,
      author: body.author,
      email: body.email,
      affiliation: body.affiliation || "",
      references: body.references || "",
      wantsToWork: body.wantsToWork || false,
      sensoryModality: body.sensoryModality || "",
      sensoryModalityOther: body.sensoryModalityOther || "",
      deviceType: body.deviceType || "",
      deviceTypeOther: body.deviceTypeOther || "",
      tool: body.tool || "",
      toolOther: body.toolOther || "",
      createdAt: new Date().toISOString(),
      interestedResearchers: [],
    };
    
    await kv.set(id, idea);
    return c.json({ success: true, idea });
  } catch (error) {
    console.error("Error creating idea:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add interest to an idea
app.post("/make-server-fb3cb64e/ideas/:id/interest", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const idea = await kv.get(id);
    if (!idea) {
      return c.json({ success: false, error: "Idea not found" }, 404);
    }
    
    const interestedResearchers = idea.interestedResearchers || [];
    interestedResearchers.push({
      name: body.name,
      email: body.email,
      affiliation: body.affiliation || "",
      addedAt: new Date().toISOString(),
    });
    
    idea.interestedResearchers = interestedResearchers;
    await kv.set(id, idea);
    
    return c.json({ success: true, idea });
  } catch (error) {
    console.error("Error adding interest:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add reference to an idea
app.post("/make-server-fb3cb64e/ideas/:id/references", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const idea = await kv.get(id);
    if (!idea) {
      return c.json({ success: false, error: "Idea not found" }, 404);
    }
    
    const additionalReferences = idea.additionalReferences || [];
    additionalReferences.push({
      citation: body.citation,
      addedBy: body.addedBy,
      addedAt: new Date().toISOString(),
    });
    
    idea.additionalReferences = additionalReferences;
    await kv.set(id, idea);
    
    return c.json({ success: true, idea });
  } catch (error) {
    console.error("Error adding reference:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete an idea
app.delete("/make-server-fb3cb64e/ideas/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting idea:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);