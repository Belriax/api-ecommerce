module.exports = {
  mode: process.env.NODE_ENV === "production" ? "live" : "sandbox",
  sandbox: process.env.NODE_ENV === "production" ? false: true,
  sandbox_email: process.env.NODE_ENV === "production" ? null : "",
  email: "gleiconsousa@gmail.com",
  token: "C6FC1C947A7E427B9C9B211A7F7EC93C",
  notificationURL: "https://api.parkunderground.com.br/v1/pagamentos/notificacao"
};