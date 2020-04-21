import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import './MoviesList.css'

export const MoviesList = ({ movies }) => {
    const weakDayName = ['Today', 'Tomorrow']
    const weakDayNum = []
    const dayOfMonth = []
    for(let i = 2; i < 7; i++) { weakDayName.push(moment().add(i, 'days').format('dddd')) }
    for(let i = 0; i < 7; i++) { 
        weakDayNum.push(moment().add(i, 'days').format('d'))
        dayOfMonth.push(Date.now() + (i * 24*60*60*1000))
    }

    let hostname = window.location.hostname
    if (hostname === 'localhost') hostname = 'localhost:3000'

    const [pickedDay, setPickedDay] = useState({
        dayInWeakNum: weakDayNum[0],
        indIn7Days: weakDayNum.indexOf(weakDayNum[0])
    })
    const [calendar, setCalendar] = useState([{
        dayInWeakNum: weakDayNum[0],
        indIn7Days: weakDayNum.indexOf(weakDayNum[0])
    }, {
        dayInWeakNum: weakDayNum[1],
        indIn7Days: weakDayNum.indexOf(weakDayNum[1])
    }, {
        dayInWeakNum: weakDayNum[2],
        indIn7Days: weakDayNum.indexOf(weakDayNum[2])
    }])

    if (!movies.length) {
        return <p>Sorry, but there are no movies on this date</p>
    }
    
    const saveToLocalStorage = (movieData) => {
        localStorage.setItem('movieId', movieData[0].toString())
        localStorage.setItem('movieName', movieData[1].toString())
        localStorage.setItem('date', dayOfMonth[pickedDay.indIn7Days])
    }

    const pickDayHandler = e => {
        const elemId = e.target.id || e.target.parentNode.id
        const elemIdArr = elemId.split('_')
        setPickedDay({
            dayInWeakNum: weakDayNum[elemIdArr[1]],
            indIn7Days: weakDayNum.indexOf(weakDayNum[elemIdArr[1]])
        })
    }

    const previousDayHandler = () => {
        const newCalendar = [].concat(calendar)
        const lastDay = newCalendar.pop()

        if (lastDay.indIn7Days === 2) {
            return null
        }

        const newDayIndex = lastDay.indIn7Days - 3
        newCalendar.unshift({
            dayInWeakNum: weakDayNum[newDayIndex],
            indIn7Days: weakDayNum.indexOf(weakDayNum[newDayIndex])
        })
        setCalendar(newCalendar)

        const newLastDayInd = newCalendar[2].indIn7Days
        if (lastDay.indIn7Days === pickedDay.indIn7Days) {
            const newPickedDay = {
                dayInWeakNum: weakDayNum[newLastDayInd],
                indIn7Days: weakDayNum.indexOf(weakDayNum[newLastDayInd])
            }
            setPickedDay(newPickedDay)
        }
    }
    const nextDayHandler = () => {
        const newCalendar = [].concat(calendar)
        const firstDay = newCalendar.shift()

        if (firstDay.indIn7Days === 4) {
            return null
        }

        const newDayIndex = firstDay.indIn7Days + 3
        newCalendar.push({
            dayInWeakNum: weakDayNum[newDayIndex],
            indIn7Days: weakDayNum.indexOf(weakDayNum[newDayIndex])
        })
        setCalendar(newCalendar)

        const newFirstDayInd = newCalendar[0].indIn7Days
        if (firstDay.indIn7Days === pickedDay.indIn7Days) {
            const newPickedDay = {
                dayInWeakNum: weakDayNum[newFirstDayInd],
                indIn7Days: weakDayNum.indexOf(weakDayNum[newFirstDayInd])
            }
            setPickedDay(newPickedDay)
        }
    }

    return (
        <>
            <div className="calendar">
            <div className="switcher" onClick={previousDayHandler}>
                <div className="switcher-toggle">{'prev'}</div>
            </div>
                
                {
                    calendar.map( (day, index) => {
                        let dayClassName = 'day'
                        if (day.indIn7Days === pickedDay.indIn7Days) dayClassName = 'day selected'
                        return(
                            <div 
                                id={`Day_${day.indIn7Days}`} 
                                key={index * Math.random()} 
                                onClick={pickDayHandler}
                                className={dayClassName}
                            >
                                <p>{weakDayName[day.indIn7Days]}</p>
                                <p>{moment(dayOfMonth[day.indIn7Days]).format('MMMM D')}</p>
                            </div>
                        )
                    })
                }
                
                <div className="switcher" onClick={nextDayHandler}>
                    <div className="switcher-toggle">{'next'}</div>
                </div>
            </div>

            {movies.map( movie => {
                if (movie.startDate <= (dayOfMonth[pickedDay.indIn7Days]/1000)
                                 && movie.endDate >= (dayOfMonth[pickedDay.indIn7Days]/1000)) {
                    return (
                        <div key={movie._id} className="movie">
                            <div className="poster-wrapper">
                                <img 
                                    src={`http://${hostname}/api/movies/poster/${movie._id}`} 
                                    alt="poster" 
                                />
                            </div>
                            <div className="info-wrapper">
                                <div className="short-description">
                                    <strong>{movie.description.name}</strong>
                                    <p><span>Genres: </span>{movie.description.genres}</p>
                                    <p><span>Cast: </span>{movie.description.stars}</p>
                                </div>
                                <div className="sessions">
                                    {
                                        movie.schedule[pickedDay.dayInWeakNum] 
                                        ? movie.schedule[pickedDay.dayInWeakNum].sessions.map( session => {
                                            if (pickedDay.indIn7Days === 0) {
                                                const time = session.time.split(':')
                                                let hour = parseInt(time[0], 10)
                                                hour = hour === 12 ? hour : hour += 12
                                                const min = parseInt(time[1], 10) + 5

                                                if (Date.now() > moment().hour(hour).minute(min).valueOf()) {
                                                    return (
                                                        <span 
                                                            key={session._id}
                                                        >
                                                            {session.time}
                                                        </span>
                                                    )
                                                }
                                            }
                                            return (
                                                <Link 
                                                    key={session._id} 
                                                    to={`/session/${session._id}`}
                                                    onClick={saveToLocalStorage
                                                        .bind(this, [movie._id, movie.description.name])}
                                                >
                                                    {session.time}
                                                </Link>
                                            )
                                        }) 
                                        : null
                                    }
                                </div>
                                <Link to={`/movie/${movie._id}`} >Movie trailer and plot</Link>
                            </div>
                        </div>
                    ) 
                } else {
                    return null
                }
            })}
        </>
    )
}