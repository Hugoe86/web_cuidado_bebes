function pdfLayoutTable(headers, content) {
    return {
        color: '#555',
        table: {
            headerRows: 1,
            body: pdfBuildTableBody(headers, content)
        },
        layout: {
            hLineWidth: function (i) {
                return 1;
            },
            vLineWidth: function (i) {
                return 1;
            },
            paddingLeft: function (i) {
                return 5;
            },
            paddingRight: function (i) {
                return 5;
            },
            hLineColor: function (i) {
                return '#dddddd';
            },
            vLineColor: function (i) {
                return '#dddddd';
            },
        }
    };
};

function pdfBuildTableBody(headers, content) {
    var body = [];
    var Headers = [];

    headers.forEach(function (column) {
        var Header = new Object();
        Header = {
            'text': column.toString(),
            bold: true,
            'style': 'tableHeader'
        }
        Headers.push(Header);
    });

    body.push(Headers);

    content.forEach(function (row, index) {
        var dataRow = [];

        headers.forEach(function (column) {
            dataRow.push({
                'text': row[column] === null ? '' : row[column].toString(),
                'style': index % 2 === 0 ? 'tableRowEven' : 'tableRowOdd'
            });
        });

        body.push(dataRow);
    });

    return body;
};

function copyObject(o) {
    var copy = Object.create(Object.getPrototypeOf(o));
    var propNames = Object.getOwnPropertyNames(o);

    propNames.forEach(function (name) {
        var desc = Object.getOwnPropertyDescriptor(o, name);
        Object.defineProperty(copy, name, desc);
    });

    return copy;
};

function pdfTable(headers, content, fileName, headerName) {
    var docDefinition = {
        pageSize: 'A4',
        // by default we use portrait, you can change it to landscape if you wish
        pageOrientation: headers.length > 5 ? 'landscape' : 'portrait',
        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [40, 60, 40, 60],
        styles: {
            header: {
                fontSize: 22,
                bold: true,
                alignment: 'center'
            },
            tableHeader: {
                color: '#ffffff',
                fillColor: '#3071a9',
                bold: true
            },
            tableRowEven: {
                fillColor: '#f0f0f0'
            },
            tableRowOdd: {
                fillColor: '#ffffff'
            }
        },
        content: [
            {
                text: headerName + '\n\n',
                style: 'header'
            },
            pdfLayoutTable(headers, content)
        ],
        footer: function (currentPage, pageCount, pageSize) {
            // you can apply any logic and return any valid pdfmake element
            return [
                {
                    text: currentPage.toString() + ' de ' + pageCount,
                    alignment: 'right',
                    margin: [0, 0, 40, 0]
                }
            ]
        }
    };

    pdfMake.createPdf(docDefinition).download(fileName);
};