import "dotenv/config";
import app from "./app.js";
import { checkDatabase } from "./config/database.js";
import { ensureSessionTable } from "./services/sessions.js";
import { ensurePaymentEventTable } from "./services/paymentEvents.js";

const PORT = process.env.PORT || 4000;

checkDatabase().then(ensureSessionTable).then(ensurePaymentEventTable).then(() => {
  app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
}).catch((error) => {
  console.error("Không thể kết nối MySQL:", error.message);
  process.exit(1);
});
