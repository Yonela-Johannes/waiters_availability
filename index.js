const express = require('express')
const Waiter = require('./app.js')
const { WaitersDb } = require('./config/waiters.js')
const pgp = require('pg-promise')();
const local = 'postgres://postgres:juanesse123@localhost:5432/waiters_availability';
const bodyParser = require('body-parser')
const cors = require('cors')
const handlebars = require('express-handlebars')
const session = require('express-session')
const dotenv = require('dotenv')
const Routes = require('./routes/routes.js')
const connectionString = process.env.DATABASE_URL || local

const config = {
    connectionString,
    max: 20,
    ssl: {
        rejectUnauthorized: false
    }
}

const db = pgp(config)
// server port number
const app = express()
dotenv.config()

const waiter = Waiter()

const waitersDb = WaitersDb(db)
const routes = Routes(waiter, waitersDb)

app.set('view engine', 'hbs')
app.engine('hbs', handlebars.engine({
    layoutsDir: `./views/layouts`,
    extname: 'hbs',
    defaultLayout: 'main',
}))

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }), bodyParser.json())
app.use(cors())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))


app.get('/', routes.getLoginPage)
app.post('/', routes.postLoginPage)
app.get('/weekly-schedule', routes.getHomePage)
app.post('/weekly-schedule', routes.postHomePage)
app.post('/schedule/:username', routes.postSchedulePage)
app.get('/schedule/:username', routes.getSchedulePage)
app.post('/admin', routes.postAdminPage)
app.get('/admin', routes.getAdminPage)
app.get('/waiters', routes.allWaitersPage)
app.post('/waiter/:username', routes.postWaiterPage)
app.get('/waiter/:username', routes.getWaiterPage)
app.post('/delete', routes.deleteWaiters)
app.post('/reset', routes.resetDays)
app.post('/delete', routes.deleteWaiters)
app.post('/search', routes.postSearchWaiter)
app.get('/search', routes.getSearchWaiter)



const port = process.env.PORT || 5000
// displaying server in localhost
app.listen(port, () => {
    console.log('Your app is running on port: ', port)
})