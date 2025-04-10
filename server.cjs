const { log } = require("console");
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post("/batch-tasks", (req, res) => {
  const db = router.db;
  const tasks = req.body;
  console.log("Полученные задачи:", tasks);
  for (const task of tasks) {
    db.get("tasks")
      .find({ id: task.id })
      .assign({ order: task.order })
      .write();
  }

  res.send({ success: true });
});

server.use(router);

server.listen(5000, () => {
  console.log("🚀 JSON Server is running on port 5000");
});