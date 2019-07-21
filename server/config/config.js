// =======================================
//       PUERTO
// =======================================
process.env.PORT = process.env.PORT || 3000;

// =======================================
//       ENTORNO
// =======================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =======================================
//       BASE DE DATOS
// =======================================
let urlDB;

if ( process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// =======================================
//       Vencimiento del Token
// =======================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// =======================================
//       SEED d autenticación
// =======================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// =======================================
//       Google Client ID
// =======================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '1025398954887-chg8iihsq534r1pm60jfr1p2t3jdvv4v.apps.googleusercontent.com';