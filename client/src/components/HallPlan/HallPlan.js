import React from 'react'
import './HallPlan.css'

export const HallPlan = ({ session, hall, pickSeat }) => {

    for ( let index in session.soldTickets ) {
        const ticket = session.soldTickets[index]

        hall.rows.forEach( (row, index) => {
            if (index === (ticket.row - 1)) {
                row.seats.forEach( (e, i, arr) => i === (ticket.seat - 1) ? arr[i] = false : null)
            }
        })
    }

    const hallSizeHandler = (e) => {
        const i = e.target.id
        const plan = document.getElementById('plan')
        let planSize = parseInt(plan.getAttribute('class').split('-')[1])
        if (i === 'bigger-seat') {
            plan.setAttribute('class', `size-${++planSize}`)

            if (planSize === 5) {
                document.getElementById('bigger-seat').setAttribute('disabled', 'disabled')
            } else if (planSize === 2) {
                document.getElementById('smaller-seat').removeAttribute('disabled')
            }
        } else if (i === 'smaller-seat') {
            plan.setAttribute('class', `size-${--planSize}`)

            if (planSize === 1) {
                document.getElementById('smaller-seat').setAttribute('disabled', 'disabled')
            } else if (planSize === 4) {
                document.getElementById('bigger-seat').removeAttribute('disabled')
            }
        }
    }

    const pickSeatHandler = (e) => {
        const i = e.target.id
        pickSeat(i)
        let seat = document.getElementById(e.target.id)

        if (seat.style.backgroundColor !== 'rgb(255, 165, 0)') {
            seat.style.backgroundColor = 'rgb(255, 165, 0)'
            seat.style.borderColor = 'rgb(0, 0, 0)'
        } else {
            seat.removeAttribute('style')
        }
    }

    return (
        <div className="hall">
            <div className="hall-size">
                <button id="bigger-seat" onClick={hallSizeHandler}>+</button>
                <button id="smaller-seat" onClick={hallSizeHandler}>-</button>
            </div>
            <div id="plan" className="size-3">
                <div className="screen">screen</div>
                {
                    hall.rows.map( (row, index) => {
                        const rowNum = index + 1
                        if (row.seatType === 'premium') {
                            return (
                                <div className="row vip" key={row._id}>
                                    <span className="row-number">{rowNum}</span>
                                {
                                row.seats.map( (seat, index) => {
                                    if (seat === false) {
                                        return (
                                                <div 
                                                    className="seat premium sold" 
                                                    key={row._id + index}
                                                    >
                                                </div>
                                        )
                                    } return (
                                            <div 
                                                id={`seat_${index + 1}_${rowNum}_premium`}
                                                title={index + 1}
                                                className="seat premium" 
                                                key={row._id + index}
                                                onClick={pickSeatHandler}
                                                >
                                            </div>
                                    )
                                })   
                                }
                                    <span className="row-number">{rowNum}</span>
                                </div>
                            )
                        } else {
                            return(
                                <div className="row" key={row._id}>
                                    <span className="row-number">{rowNum}</span>    
                                {
                                row.seats.map( (seat, index) => {
                                    if (seat === false) {
                                        return (
                                            <div 
                                                className="seat sold" 
                                                key={row._id + index}
                                                >
                                            </div>
                                        )
                                    } return (
                                        <div 
                                            id={`seat_${index + 1}_${rowNum}_stand`}
                                            title={index + 1}
                                            className="seat" 
                                            key={row._id + index}
                                            onClick={pickSeatHandler}
                                            >
                                        </div>)
                                })
                                }
                                    <span className="row-number">{rowNum}</span>
                                </div>
                            )
                        }
                    })
                }
            </div>
        </div>
        
    )
}