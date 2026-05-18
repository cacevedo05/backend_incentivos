import app from './app'
const PORT = process.env.PORT ? Number(process.env.PORT) : 3003
app.listen(PORT, () => console.log(`References service corriendo en puerto ${PORT}`))
