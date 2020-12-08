function generateArray(table) {
    var out = [];
    var rows = table.querySelectorAll('tr');
    var ranges = [];
    for (var R = 0; R < rows.length; ++R) {
        var outRow = [];
        var row = rows[R];
        var columns = row.querySelectorAll('td');
        for (var C = 0; C < columns.length; ++C) {
            var cell = columns[C];
            var colspan = cell.getAttribute('colspan');
            var rowspan = cell.getAttribute('rowspan');
            var cellValue = cell.innerText;
            if(cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

            //Skip ranges
            ranges.forEach(function(range) {
                if(R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
                    for(var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
                }
            });

            //Handle Row Span
            if (rowspan || colspan) {
                rowspan = rowspan || 1;
                colspan = colspan || 1;
                ranges.push({s:{r:R, c:outRow.length},e:{r:R+rowspan-1, c:outRow.length+colspan-1}});
            };
            
            //Handle Value
            outRow.push(cellValue !== "" ? cellValue : null);
            
            //Handle Colspan
            if (colspan) for (var k = 0; k < colspan - 1; ++k) outRow.push(null);
        }
        out.push(outRow);
    }
    return [out, ranges];
};

function datenum(v, date1904) {
	if(date1904) v+=1462;
	var epoch = Date.parse(v);
	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}
 
function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: data[R][C] };
			if(cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
			
			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			}
			else cell.t = 's';
			
			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}

function sheet_from_array_of_arrays_no_headers(data, opts) {
    var ws = {};
    var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
    for (var R = 0; R != data.length; ++R) {
        for (var C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            var cell = {
                v: data[R][C],
                s: {
                    border: {
                        left: { style: 'medium', color: { rgb: "FF0000" } },
                        top: { style: 'medium', color: { auto: 1 } },
                        bottom: { style: 'medium', color: { auto: 1 } }
                    },
                    fill: { fgColor: { rgb: "FFFF0000" } },
                    aligment: {
                        wrapText: true,
                        vertical: "center",
                        horizontal: "center"
                    }
                }
            };
            if (cell.v == null) continue;
            var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
                cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            }
            else cell.t = 's';

            ws[cell_ref] = cell;
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}

function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}
 
function s2ab(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}

function export_table_to_excel(headers, content, fileName, sheetName) {
	var data = [content.length + 1];
	data[0] = headers;
	
	var countContent = 0;
	for	(var x in content) {
		countContent++;
	}
	
	for (var i = 0; i < content.length; i++) {
		var arr = [];
		for (var j = 0, k = 0; j < countContent; j++) {
			while (k < headers.length) {
				if (headers[k] === Object.keys(content[i])[k]) {
					arr[j] = content[i][headers[k]];
					k++;
					break;
				}
				k++;
			}
		}
		
		data[i+1] = arr;
	}
	
	var ws_name = sheetName;

	var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
	 
	// add ranges to worksheet 
	ws['!merges'] = [];

	// add worksheet to workbook 
	wb.SheetNames.push(ws_name);
	wb.Sheets[ws_name] = ws;

	var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:false, type: 'binary'});

	saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), fileName);
}

function export_table_to_excel_no_headers(content, fileName, sheetName) {
    var ws_name = sheetName;

    var wb = new Workbook(), ws = sheet_from_array_of_arrays_no_headers(content);

    // add ranges to worksheet 
    ws['!merges'] = [];

    // add worksheet to workbook 
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    //wb.Sheets[ws_name].Range("D5").Characters(16, 9).Font.Italic = True

    var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });

    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), fileName);
}
