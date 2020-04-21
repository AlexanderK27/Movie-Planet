const fs = require('fs')
const PdfPrinter = require('pdfmake')

const orderTemplate = (tickets) => {

    const fonts = {
        Roboto: {
            normal: 'documents/fonts/Roboto-Regular.ttf',
            bold: 'documents/fonts/Roboto-Medium.ttf',
            italics: 'documents/fonts/Roboto-Italic.ttf',
            bolditalics: 'documents/fonts/Roboto-MediumItalic.ttf'
        }
    };
    const printer = new PdfPrinter(fonts)

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
  
    const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    pdfDoc.pipe(fs.createWriteStream('movie-planet-ticket.pdf'));
    pdfDoc.end();
}

module.exports = orderTemplate