import app from './app'
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000
app.listen(PORT, () => {
  console.log(`API Gateway corriendo en puerto ${PORT}`)
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`)
})
