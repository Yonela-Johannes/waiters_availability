const moment = require('moment');
const WaitersDb = (db) => {
    const currentDate = new Date();
    const oneJan = new Date(currentDate.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((currentDate - oneJan) / (24 * 60 * 60 * 1000));
    const currentWeek = Math.ceil((currentDate.getDay() + 1 + numberOfDays) / 7);
    const getCurrentDate = () => moment(currentDate).format("ddd, hA");
    const getCurrentWeek = () => currentWeek

    const storeName = async (name) => {
        result = await db.any('INSERT INTO waiters (name) VALUES ($1);', [name])
        return [result]
    }

    const storeWaiterAvailabilty = async (nameId, dayId) => {
        let result = ''
        if (dayId.length > 1) {
            for (let x = 0; x < dayId.length; x++) {
                result = await db.any('INSERT INTO days_available (waiter_id, day_available) VALUES ($1, $2);', [nameId, dayId[x]])
            }
        } else {
            result = await db.any('INSERT INTO days_available (waiter_id, day_available) VALUES ($1, $2);', [nameId, dayId])
        }
        return result
    }

    const getUsers = async () => {
        const result = await db.any('SELECT * FROM waiters;')
        return result
    }

    const getUser = async (name) => {
        const [result] = await db.any('SELECT * FROM waiters WHERE name = $1;', [name])
        return result
    }
    const getAvailableDays = async () => {
        const tables = await db.any('SELECT * FROM days_available LEFT JOIN days ON days.id = days_available.day_available;')
        return tables
    }
    const getWaiters = async () => {
        const result = await db.any('SELECT waiter_id, name, day FROM days_available INNER JOIN waiters ON waiter_id = waiters.id INNER JOIN days ON day_available = days.id GROUP BY waiter_id, name, days.day;')
        return result
    }
    const getDay = async (id) => {
        let days = '';
        let mainResult = []
        if (typeof id == 'number') {
            const result = await db.any('SELECT name, day FROM days_available INNER JOIN waiters ON waiter_id = waiters.id INNER JOIN days ON day_available = days.id WHERE waiter_id = $1 GROUP BY days.day, waiters.name;', [id])
            mainResult.push(result)
        } else {
            const result = await db.any('SELECT name, day FROM days_available INNER JOIN waiters ON waiter_id = waiters.id INNER JOIN days ON day_available = days.id GROUP BY days.day, waiters.name;')
            days = result?.map(item => item.day)
            for (let x = 0; x < result.length; x++) {
                let item = await db.any('SELECT DISTINCT day, waiter_id, name FROM waiters as W JOIN days_available as DA ON w.id = DA.Waiter_id JOIN days ON DA.day_available = days.id WHERE days.day = $1', [days[x]])
                mainResult.push(item)
            }
        }
        return mainResult
    }
    const getDays = async () => {
        const days = await db.any('SELECT * FROM days;')
        return days
    }
    return {
        getCurrentDate,
        getCurrentWeek,
        getDay,
        getDays,
        storeName,
        getWaiters,
        getUsers,
        getUser,
        getAvailableDays,
        storeWaiterAvailabilty
    }

}
module.exports = {
    WaitersDb
}