module.exports = {
  secret: process.env.NODE_ENV === "production" ? process.env.SECRET : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  api: process.env.NODE_ENV === "production" ? "https://api.parkunderground.com.br" : "http://localhost:3000",
  loja: process.env.NODE_ENV === "production" ? "https://parkunderground.com.br" : "http://localhots:8000"
}