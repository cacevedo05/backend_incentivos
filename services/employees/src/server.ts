import app from './app'
const PORT = process.env.PORT ? Number(process.env.PORT) : 3002
app.listen(PORT, () => console.log(`Employees service corriendo en puerto ${PORT}`))
