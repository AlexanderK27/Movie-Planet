export const OrderTemplate = (tickets) => {

    const tableBody = [
        ['ROW', 'SEAT', 'TYPE', 'PRICE', 'QR CODE']
    ]

    for ( let el in tickets ) {
        tableBody.push([
            tickets[el].row,
            tickets[el].seat,
            tickets[el].seatType,
            '$' + tickets[el].price,
            { qr: tickets[el]._id.toString() }
        ])
    }
  
    const docDefinition = {
        info: {
            title: `Movie_Planet_${tickets[0].orderNum}`
        },
        content: [
            {
                text: 'Movie Planet',
                style: 'header'
            },
            `${new Date()}`,
            {
                text: tickets[0].movieName,
                style: 'movieName'
            },
            {
                text: `${tickets[0].date}`,
                style: 'sessionDate'
            },
            {
                table: {
                    body: tableBody
                }
            }
        ], 
        styles: {
            header: {
                fontSize: 22,
                bold: true
            },
            movieName: {
                fontSize: 18,
                bold: true,
                aligment: 'center'
            },
            sessionDate: {
                fontSize: 14,
                aligment: 'center'
            }
        }
    };
  
    const options = {
        // ...
    }
  
    return { docDefinition, options }
}
