module.exports = {
  mode: process.env.NODE_ENV === "production" ? "live" : "sandbox",
  sandbox: process.env.NODE_ENV === "production" ? false: true,
  sandbox_email: process.env.NODE_ENV === "production" ? null : "",
  email: "",
  token: "",
  notificationURL: "https://api.parkunderground.com.br/v1/pagamentos/notificacao"
};