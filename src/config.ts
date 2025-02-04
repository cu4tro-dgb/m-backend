process.loadEnvFile('./development.env')
export const { PORT, MODE, USER, PASSWD, SECRET_KEY  } = process.env
