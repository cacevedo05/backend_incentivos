import app from './app'
const PORT = process.env.PORT ? Number(process.env.PORT) : 3007
app.listen(PORT, () => console.log(`Liquidation service corriendo en puerto ${PORT}`))
