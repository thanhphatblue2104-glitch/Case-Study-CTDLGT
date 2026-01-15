import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";

const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.url}`);
    next();
});

console.log("DEBUG: Importing authRoutes:", authRoutes);
if (authRoutes && authRoutes.stack) {
    console.log("DEBUG: authRoutes Stack Length:", authRoutes.stack.length);
    authRoutes.stack.forEach((layer: any, index: number) => {
        console.log(`DEBUG: Layer ${index} route:`, layer.route ? layer.route.path : "middleware");
    });
} else {
    console.log("DEBUG: authRoutes.stack is MISSING");
}

app.post("/test", (req, res) => {
    console.log("POST /test HIT");
    res.json({ message: "POST /test works" });
});

app.post("/manual-login", (req, res) => res.send("Manual Login Works"));

console.log("DEBUG: typeof authRoutes:", typeof authRoutes);
console.log("DEBUG: Is authRoutes a function?", typeof authRoutes === 'function');

// Mount on Root to test
app.use("/", authRoutes);
// Keep old mount to compare
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("Debug Server Running"));

// Manual Invocation Test
app.post("/manual-invoke-login", (req, res, next) => {
    console.log("DEBUG: Manually invoking authRoutes for /manual-invoke-login");
    // Hack: Request url needs to be trimmed if we want it to match /login inside router?
    // If we call it directly, we might need to adjust req.url?
    // Router expects to handle subpath.
    // If we are at /manual-invoke-login, and we want it to match /login?
    // Let's just forward and see what happens.
    authRoutes(req, res, next);
});

// Inline Router Test
const inlineRouter = express.Router();
inlineRouter.use((req, res, next) => {
    console.log("DEBUG: Inline Router Entered", req.url, req.method);
    next();
});
inlineRouter.post("/login", (req, res) => {
    console.log("DEBUG: Inline Router /login Hit");
    res.json({ message: "Inline Login Works" });
});
inlineRouter.use((req, res) => console.log("DEBUG: Inline Router Catch All", req.url));

// Mount inline router on /inline
app.use("/inline", inlineRouter);

app.listen(3001, () => {
    console.log("Debug Server running on http://localhost:3001");
});
