import 'module-alias/register';
import app from './app';
import './shared/db/postgres';
import { env } from './config/env';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(` Servidor corriendo en puerto ${PORT}`);
  console.log(` http://localhost:${PORT}`);
});

