function convertArrayOfObjectsToCSV(headers, content) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = content || null;
    /*if (data == null || !data.length) {
        return null;
    }*/

    columnDelimiter = /*args.columnDelimiter ||*/ ',';
    lineDelimiter = /*args.lineDelimiter ||*/ '\n';

    keys = headers; // Object.keys(data[0]);

    result = '';
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] !== '$$hashKey') {
            result += keys[i] + (i + 1 < keys.length ? columnDelimiter : '');
        }
    }

    result += lineDelimiter;

    data.forEach(function (item) {
        ctr = 0;
        keys.forEach(function (key) {
            if (ctr > 0) result += columnDelimiter;
            if (key !== '$$hashKey') {
                result += item[key];
            }
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
};

function downloadCSV(headers, content, fileName) {
    var filename, link;
    var csv = convertArrayOfObjectsToCSV(headers, content);
    if (csv == null) return;

    filename = fileName || 'Export.csv';

    saveAs(new Blob([csv], { type: "text/csv;charset=utf-8;" }), filename);
};