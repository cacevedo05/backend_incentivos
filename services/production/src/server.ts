import app from './app'
const PORT = process.env.PORT ? Number(process.env.PORT) : 3005
app.listen(PORT, () => console.log(`Production service corriendo en puerto ${PORT}`))
