import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { Ticket } from './Ticket/Ticket'
import './TicketsList.css'

export const TicketsList = ({ tickets, qrcodeHandler, downloadOrderPDF, openOrderPDF }) => {
    if (!tickets.length) {
        return (
            <div className="no-tickets">
                <p>"You do not have any tickets :("</p>
                <Link to={'/'}>Let's get one!</Link>
            </div>
        )
    }
    const orderNumbers = []
    const orders = []
    for (let i in tickets) {
        const numIndex = orderNumbers.findIndex( num => num === tickets[i].orderNum)
        if (numIndex !== -1) {
            orders[numIndex].push(tickets[i])
        } else {
            orderNumbers.push(tickets[i].orderNum)
            orders.push([tickets[i]])
        }
    }

    return (
        <div className="tickets-list">
        {
            orders.map( order => {
                return (
                    <div className="order" key={order[0].orderNum}>
                        <div className="order-menu">
                            <p>Order #{order[0].orderNum}</p>
                            <div className="buttons">
                                <button onClick={downloadOrderPDF.bind(order, order)} >
                                    Download PDF
                                </button>
                                <button onClick={openOrderPDF.bind(order, order)} >
                                    Open PDF
                                </button>
                            </div>
                        </div>
                        { 
                            order.map( ticket => {
                                const { _id, movieName, date, row, 
                                    seat, seatType, price, purchDate } = ticket
                                const purchaseDate = new Date(purchDate).toLocaleDateString('en-US')
                                return (
                                    <Ticket 
                                        key={_id}
                                        params={{
                                            id: _id,
                                            movieName,
                                            date: moment(date).format('MMMM Do YYYY, h:mm a'),
                                            sesDate: date,
                                            row,
                                            seat,
                                            seatType,
                                            price,
                                            purchaseDate,
                                            qrcodeHandler
                                        }}
                                    />
                                )
                            })
                        }
                    </div>
                )
            })
        }
        </div>
    )
}