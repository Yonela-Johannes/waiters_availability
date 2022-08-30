const Routes = (waiter, waitersDb) => {
    const postLoginPage = async (req, res) => {
        const { name } = req.body
        waiter.setName(name)
        const username = waiter.getName()
        const dbName = await waitersDb.getUser(username)
        const existName = waiter.validateDbName(username, dbName)
        existName === false && username ? await waitersDb.storeName(username) : ''
        res.render('login', {
            error: waiter.errorHandler(),
            success: waiter.successHandler(existName, username)
        })
    }

    const getLoginPage = async (req, res) => {
        res.render('login')
    }
    const getHomePage = async (req, res) => {
        const weekDays = await waitersDb.getDays()
        const waiters = await waitersDb.getUsers()
        let id = waiter.convertObj(waiters)
        const days = await waitersDb.getDay(id)
        res.render('index', {
            week: waitersDb.getCurrentWeek,
            nextweek: waitersDb.getCurrentWeek() + 1,
            date: waitersDb.getCurrentDate,
            weekDays,
            days,
            waiters,
        })
    }

    const postHomePage = async (req, res) => {
        res.render('index')
    }

    const postSchedulePage = async (req, res) => {
        const { username } = req.params
        const { day } = req.body
        waiter.setName(username)
        waiter.setDays(day)
        const getD = await getDay()
        const getDay = waiter.getDays()
        const days = await waitersDb.getDays()
        const getWaiter = await waitersDb.getUser(username)
        const { id } = getWaiter
        getDay !== '' ? await waitersDb.storeWaiterAvailabilty(id, getDay) : ''
        const dbName = await waitersDb.getUser(username)
        const existName = waiter.validateDbName(username, dbName)
        res.render('schedule', {
            username,
            days,
            waiter,
            error: waiter.errorHandler(getDay, username),
            success: waiter.successHandler('', username),
        })
    }

    const getSchedulePage = async (req, res) => {
        const { username } = req.params
        const days = await waitersDb.getDays()
        const waiter = await waitersDb.getUser(username)
        const { id } = waiter
        const days_available = await waitersDb.getDay(id)
        res.render('schedule', {
            week: waitersDb.getCurrentWeek,
            nextweek: waitersDb.getCurrentWeek() + 1,
            date: waitersDb.getCurrentDate,
            username,
            days_available,
            days,
            waiter
        })
    }


    const postAdminPage = async (req, res) => {
        const { username } = req.params
        const { day } = req.body
        waiter.setName(username)
        waiter.setDays(day)
        res.render('admin', {
            error: waiter.errorHandler,
            success: waiter.successHandler,
        })
    }

    const getAdminPage = async (req, res) => {
        const weekDays = await waitersDb.getDays()
        const result = await waitersDb.getAvailableDays()
        const allWaiters = await waitersDb.getUsers()
        const waiters = await waitersDb.getUsers()
        let id = waiter.convertObj(waiters)
        const days = await waitersDb.getDay(id)
        // console.log(days)
        // console.log(days)
        res.render('admin', {
            week: waitersDb.getCurrentWeek,
            nextweek: waitersDb.getCurrentWeek() + 1,
            date: waitersDb.getCurrentDate,
            days,
            weekDays,
            waiters,
            result,
            allWaiters
        })
    }
    const postWaiterPage = async (req, res) => {
        res.render('waiter', {
            day,
        })
    }
    const getWaiterPage = async (req, res) => {
        const { username } = req.params
        const waiter = await waitersDb.getUser(username)
        const { id } = waiter
        let days_available = await waitersDb.getDay(id)
        if (days_available.length < 1) {
            days_available = [username + ' you have no days scheduled']
        }
        res.render('waiter', {
            week: waitersDb.getCurrentWeek,
            nextweek: waitersDb.getCurrentWeek() + 1,
            date: waitersDb.getCurrentDate,
            username,
            days_available,
            waiter
        })
    }

    return {
        postLoginPage,
        getLoginPage,
        postHomePage,
        getHomePage,
        postSchedulePage,
        getSchedulePage,
        postWaiterPage,
        getWaiterPage,
        postAdminPage,
        getAdminPage,
    }

}
module.exports = Routes
