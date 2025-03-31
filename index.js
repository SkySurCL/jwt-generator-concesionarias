const express = require("express");
const { engine } = require("express-handlebars");
const { issueToken, verifyToken } = require("./src/server");
const publicKey = require("./src/publicKey");
const app = express();
const port = 3000;

// Configurar Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.json());

app.get("/", (req, res) => {
  const token = req.query.token || null;
  res.render("home", { token });
});

app.get("/public-key", (req, res) => {
  res.type("text/plain"); // Este es el encabezado necesario para que el navegador pueda leer el archivo]
  res.header("Content-Disposition", `inline; filename=public.pem`); // Este es el encabezado necesario para que el navegador descargue el archivo como un archivo]
  res.send(publicKey.toString());
});

app.post("/generate-token", (req, res) => {
  const jwt = issueToken();
  const params = new URLSearchParams({ token: jwt });
  res.redirect(`/?${params}`);
});

app.post("/token", (req, res) => {
  const jwt = issueToken();
  res.json({ token: jwt });
});

app.post("/verify-token", (req, res) => {
  const token = req.body?.token ?? null;

  if (!token) {
    res.status(400).send({ error: "Token is required" });
    return;
  }

  const verified = verifyToken(token);

  if (verified) {
    res.status(200).json({ message: "Token is valid" });
  } else {
    res.status(401).json({ message: "Token is invalid" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
