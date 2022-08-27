const WaitersDb = (db) => {

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
        if (id?.length > 1) {
            result = await db.any('SELECT name, day FROM days_available INNER JOIN waiters ON waiter_id = waiters.id INNER JOIN days ON day_available = days.id GROUP BY days.day, waiters.name;')
            result = await db.any('SELECT name, day FROM days_available INNER JOIN waiters ON waiter_id = waiters.id INNER JOIN days ON day_available = days.id GROUP BY days.day, waiters.name ORDER BY days.day;')
            days = result?.map(item => item.day)
            const day = [...new Set(days)]
            for (let x = 0; x < result.length; x++) {
                console.log(days[x])
                mainResult = await db.any('SELECT DISTINCT (day), waiter_id, name, count(name) FROM waiters as W JOIN days_available as DA ON w.id = DA.Waiter_id JOIN days ON DA.day_available = days.id GROUP BY days.day, da.waiter_id, name HAVING COUNT(name) >= 1', ['Monday'])
                // mainResult = await db.any('SELECT * FROM days_available WHERE name IN (SELECT name, day FROM days_available JOIN days ON day_available = days.id JOIN waiters ON waiter_id = waiters.id);', ['Monday'])
            }
            console.log(mainResult)
            return result
        } else {
            result = await db.any('SELECT name,day FROM days_available INNER JOIN waiters ON waiter_id = waiters.id INNER JOIN days ON day_available = days.id WHERE waiter_id=$1;', [id])
            days = result?.map(item => item.day)
        }
        return [...new Set(days)]
    }
    const getDays = async () => {
        const days = await db.any('SELECT * FROM days;')
        return days
    }
    return {
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