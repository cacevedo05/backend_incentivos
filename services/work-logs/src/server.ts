import app from './app'
const PORT = process.env.PORT ? Number(process.env.PORT) : 3006
app.listen(PORT, () => console.log(`Work-logs service corriendo en puerto ${PORT}`))
