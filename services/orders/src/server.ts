import app from './app'
const PORT = process.env.PORT ? Number(process.env.PORT) : 3004
app.listen(PORT, () => console.log(`Orders service corriendo en puerto ${PORT}`))
