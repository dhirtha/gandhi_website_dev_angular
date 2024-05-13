//import {Injectable} from '@angular/core';
//import * as XLSX from 'xlsx';
//
//@Injectable({
//    providedIn: 'root'
//})
//export class ExcelService {
//
//    constructor() {}
//    
//    getUploadExcelTabLst(evt: any)
//    {
//        return new Promise((resolve, reject) =>
//        {
//            var array: any[] = [];
//            /* wire up file reader */
//            const target: DataTransfer = <DataTransfer>(evt.target);
//            if (target.files.length == 0) throw reject('Cannot select files');
//            if (target.files.length !== 1) throw reject('Cannot use multiple files');
//            const reader: FileReader = new FileReader();
//            reader.onload = (e: any) => 
//            {
//                /* read workbook */
//                const bstr: string = e.target.result;
//                const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'array'});
//
//                /* grab first sheet */
//                array = wb.SheetNames;
//                console.log(wb.SheetNames);
//                
//                resolve(array);
//            };
//            reader.readAsArrayBuffer(target.files[0]);
//        })
//        
//    }
//
//    uploadStandardExcel(evt: any, excelSheetNo: number) 
//    {
//        return new Promise((resolve, reject) =>
//        {
//            var array: any[] = [];
//            /* wire up file reader */
//            const target: DataTransfer = <DataTransfer>(evt.target);
//            if (target.files.length == 0) throw reject('Cannot select files');
//            if (target.files.length !== 1) throw reject('Cannot use multiple files');
//            const reader: FileReader = new FileReader();
//            reader.onload = (e: any) => 
//            {
//                /* read workbook */
//                const bstr: string = e.target.result;
//                const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'array'});
//
//                /* grab first sheet */
//                const wsname: string = wb.SheetNames[excelSheetNo];
//                const ws: XLSX.WorkSheet = wb.Sheets[wsname];
//
//                /* save data */
//                var list: any = XLSX.utils.sheet_to_json(ws, {header: 1, raw: false});
//                
//                for (let i = 0; i < list.length; i++) 
//                {
//                    if (list[i].length == 13 && list[i] != list[0] ) 
//                    {
//                        var arrayObj = {
//                            orgId: "1",
//                            oprId: "0",
//                            product: list[i][0],
//                            printSide: list[i][1],
//                            gsm: list[i][2],
//                            paper: list[i][3],
//                            printing: list[i][4],
//                            size: list[i][5].trim(),
//                            laminationSide: list[i][6],
//                            lamination: list[i][7],
//                            qty: list[i][8],
//                            rate: list[i][9],
//                            deliveryDays: list[i][10],
//                            urgentDeliveryDays: list[i][11],
//                            urgentRate: list[i][12],
//                            defunct: false,
//                        }
//                        array.push(arrayObj);
//                    }
//                }
//                resolve(array);
//            };
//            reader.readAsArrayBuffer(target.files[0]);
//        })
//        
//    }
//    
//    uploadClubingExcel(evt: any, excelSheetNo: number) 
//    {
//        return new Promise((resolve, reject) =>
//        {
//            var array: any[] = [];
//            /* wire up file reader */
//            const target: DataTransfer = <DataTransfer>(evt.target);
//            if (target.files.length == 0) throw reject('Cannot select files');
//            if (target.files.length !== 1) throw reject('Cannot use multiple files');
//            const reader: FileReader = new FileReader();
//            reader.onload = (e: any) => 
//            {
//                /* read workbook */
//                const bstr: string = e.target.result;
//                const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'array'});
//
//                /* grab first sheet */
//                const wsname: string = wb.SheetNames[excelSheetNo];
//                const ws: XLSX.WorkSheet = wb.Sheets[wsname];
//
//                /* save data */
//                var list: any = XLSX.utils.sheet_to_json(ws, {header: 1, raw: false});
//                
//                for (let i = 0; i < list.length; i++) 
//                {
//                    if (list[i].length == 14 && list[i] != list[0] ) 
//                    {
//                        var arrayObj = {
//                            orgId: "1",
//                            oprId: "0",
//                            paperType: list[i][0],
//                            gsm: list[i][1],
//                            color: list[i][2],
//                            mill: list[i][3],
//                            printSide: list[i][4],
//                            minDeliveryDays: list[i][5],
//                            minCharges: list[i][6],
//                            rateUnit: list[i][7],
//                            printRate: list[i][8],
//                            qty: list[i][10],
//                            minSqInch: list[i][11],
//                            maxSqInch: list[i][12],
//                            namune  : list[i][13],
//                            defunct: false,
//                        }
//                        array.push(arrayObj);
//                    }
//                }
//                resolve(array);
//            };
//            reader.readAsArrayBuffer(target.files[0]);
//        })
//        
//    }
//    
//    uploadPaperRateExcel(evt: any, excelSheetNo: number) 
//    {
//        return new Promise((resolve, reject) =>
//        {
//            var array: any[] = [];
//            /* wire up file reader */
//            const target: DataTransfer = <DataTransfer>(evt.target);
//            if (target.files.length == 0) throw reject('Cannot select files');
//            if (target.files.length !== 1) throw reject('Cannot use multiple files');
//            const reader: FileReader = new FileReader();
//            reader.onload = (e: any) => 
//            {
//                /* read workbook */
//                const bstr: string = e.target.result;
//                const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'array'});
//
//                /* grab first sheet */
//                const wsname: string = wb.SheetNames[excelSheetNo];
//                const ws: XLSX.WorkSheet = wb.Sheets[wsname];
//
//                /* save data */
//                var list: any = XLSX.utils.sheet_to_json(ws, {header: 1, raw: false});
//                
//                for (let i = 0; i < list.length; i++) 
//                {
//                    if (list[i].length == 9 && list[i] != list[0] ) 
//                    {
//                        var sizeArray: string[] = [];
//                        var sizeExcelArray: string[] = list[i][2].trim().split(',');
//                        for (let i = 0; i < sizeExcelArray.length; i++) {
//                            sizeArray.push(sizeExcelArray[i].trim());
//                        }
//                        var arrayObj = {
//                            orgId: "1",
//                            oprId: "0",
//                            paperType: list[i][0],
//                            mill: list[i][1],
//                            size: sizeArray,
//                            gsm: list[i][3],
//                            purchaseRate: list[i][4],
//                            available: list[i][5],
//                            rateUnit: list[i][6],
//                            saleRate: list[i][7],
//                            qType: list[i][8],
//                            defunct: false,
//                        }
//                        array.push(arrayObj);
//                    }
//                }
//                resolve(array);
//            };
//            reader.readAsArrayBuffer(target.files[0]);
//        })
//        
//    }
//    
//    uploadLaminationRateExcel(evt: any, excelSheetNo: number) 
//    {
//        return new Promise((resolve, reject) =>
//        {
//            var array: any[] = [];
//            /* wire up file reader */
//            const target: DataTransfer = <DataTransfer>(evt.target);
//            if (target.files.length == 0) throw reject('Cannot select files');
//            if (target.files.length !== 1) throw reject('Cannot use multiple files');
//            const reader: FileReader = new FileReader();
//            reader.onload = (e: any) => 
//            {
//                /* read workbook */
//                const bstr: string = e.target.result;
//                const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'array'});
//
//                /* grab first sheet */
//                const wsname: string = wb.SheetNames[excelSheetNo];
//                const ws: XLSX.WorkSheet = wb.Sheets[wsname];
//
//                /* save data */
//                var list: any = XLSX.utils.sheet_to_json(ws, {header: 1, raw: false});
//                
//                for (let i = 0; i < list.length; i++) 
//                {
//                    if (list[i].length == 6 && list[i] != list[0] ) 
//                    {
//                        var arrayObj = {
//                            orgId: "1",
//                            oprId: "0",
//                            laminationType: list[i][0],
//                            paperType: list[i][1],
//                            gsm: list[i][2],
//                            rateUnit: list[i][3],
//                            ratePerUnit: list[i][4],
//                            lType: list[i][5],
//                            defunct: false,
//                        }
//                        array.push(arrayObj);
//                    }
//                }
//                resolve(array);
//            };
//            reader.readAsArrayBuffer(target.files[0]);
//        })
//        
//    }
//    
//    uploadPrintRateSpecialExcel(evt: any, excelSheetNo: number) 
//    {
//        return new Promise((resolve, reject) =>
//        {
//            var array: any[] = [];
//            /* wire up file reader */
//            const target: DataTransfer = <DataTransfer>(evt.target);
//            if (target.files.length == 0) throw reject('Cannot select files');
//            if (target.files.length !== 1) throw reject('Cannot use multiple files');
//            const reader: FileReader = new FileReader();
//            reader.onload = (e: any) => 
//            {
//                /* read workbook */
//                const bstr: string = e.target.result;
//                const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'array'});
//
//                /* grab first sheet */
//                const wsname: string = wb.SheetNames[excelSheetNo];
//                const ws: XLSX.WorkSheet = wb.Sheets[wsname];
//
//                /* save data */
//                var list: any = XLSX.utils.sheet_to_json(ws, {header: 1, raw: false});
//                
//                for (let i = 0; i < list.length; i++) 
//                {
//                    if (list[i].length == 11 && list[i] != list[0] ) 
//                    {
//                        var paperTypeArray: string[] = [];
//                        var paperTypeExcelArray: string[] = list[i][0].trim().split(',');
//                        for (let i = 0; i < paperTypeExcelArray.length; i++) {
//                            paperTypeArray.push(paperTypeExcelArray[i].trim());
//                        }
//                        
//                        var colorArray: string[] = [];
//                        var colorTypeExcelArray: string[] = list[i][3].trim().split(',');
//                        for (let i = 0; i < colorTypeExcelArray.length; i++) {
//                            colorArray.push(colorTypeExcelArray[i].trim());
//                        }
//                        var arrayObj = {
//                            orgId: "1",
//                            oprId: "0",
//                            paperType: paperTypeArray,
//                            machineName: list[i][1],
//                            vendorName: list[i][2],
//                            color: colorArray,
//                            minLSize: list[i][4].split('x')[0].trim(),
//                            minBSize: list[i][4].split('x')[1].trim(),
//                            maxLSize: list[i][5].split('x')[0].trim(),
//                            maxBSize: list[i][5].split('x')[1].trim(),
//                            minGsm: list[i][6],
//                            maxGsm: list[i][7],
//                            firstHourRate: list[i][8],
//                            nextHourRate: list[i][9],
//                            colors: list[i][10],
//                            defunct: false,
//                        }
//                        array.push(arrayObj);
//                    }
//                }
//                resolve(array);
//            };
//            reader.readAsArrayBuffer(target.files[0]);
//        })
//        
//    }
//    
//    uploadCustomerExcel(evt: any, excelSheetNo: number) 
//    {
//        return new Promise((resolve, reject) =>
//        {
//            var array: any[] = [];
//            /* wire up file reader */
//            const target: DataTransfer = <DataTransfer>(evt.target);
//            if (target.files.length == 0) throw reject('Cannot select files');
//            if (target.files.length !== 1) throw reject('Cannot use multiple files');
//            const reader: FileReader = new FileReader();
//            reader.onload = (e: any) => 
//            {
//                /* read workbook */
//                const bstr: string = e.target.result;
//                const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'array'});
//
//                /* grab first sheet */
//                const wsname: string = wb.SheetNames[excelSheetNo];
//                const ws: XLSX.WorkSheet = wb.Sheets[wsname];
//
//                /* save data */
//                var list: any = XLSX.utils.sheet_to_json(ws, {header: 1, raw: false});
//                
//                for (let i = 0; i < list.length; i++) 
//                {
//                    if (list[i].length == 6 && list[i] != list[0] ) 
//                    {
//                        var arrayObj = {
//                            orgId: "1",
//                            oprId: "1",
//                            custShopName: list[i][0],
//                            userAddress: {
//                                addState:list[i][1],
//                                addCity:list[i][2]
//                            },
//                            email: list[i][3],
//                            userMobileNo: list[i][4],
//                            password: list[i][5],
//                            defunct: false,
//                        }
//                        array.push(arrayObj);
//                    }
//                }
//                resolve(array);
//            };
//            reader.readAsArrayBuffer(target.files[0]);
//        })
//        
//    }
//    
//    uploadPostPressRateEnvelopeExcel(evt: any, excelSheetNo: number) 
//    {
//        return new Promise((resolve, reject) =>
//        {
//            var array: any[] = [];
//            /* wire up file reader */
//            const target: DataTransfer = <DataTransfer>(evt.target);
//            if (target.files.length == 0) throw reject('Cannot select files');
//            if (target.files.length !== 1) throw reject('Cannot use multiple files');
//            const reader: FileReader = new FileReader();
//            reader.onload = (e: any) => 
//            {
//                /* read workbook */
//                const bstr: string = e.target.result;
//                const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'array'});
//
//                /* grab first sheet */
//                const wsname: string = wb.SheetNames[excelSheetNo];
//                const ws: XLSX.WorkSheet = wb.Sheets[wsname];
//
//                /* save data */
//                var list: any = XLSX.utils.sheet_to_json(ws, {header: 1, raw: false});
//                
//                for (let i = 0; i < list.length; i++) 
//                {
//                    if (list[i].length == 7 && list[i] != list[0] ) 
//                    {
//                        var paperTypeArray: string[] = [];
//                        var paperTypeExcelArray: string[] = list[i][4].trim().split(',');
//                        for (let i = 0; i < paperTypeExcelArray.length; i++) {
//                            paperTypeArray.push(paperTypeExcelArray[i].trim());
//                        }
//                        var arrayObj = {
//                            orgId: "1",
//                            oprId: "0",
//                            postPressName: list[i][0].trim(),
//                            minL: list[i][1].split('X')[0].trim(),
//                            minB: list[i][1].split('X')[1].trim(),
//                            maxL: list[i][2].split('X')[0].trim(),
//                            maxB: list[i][2].split('X')[1].trim(),
//                            selectType: list[i][3],
//                            paperTypes: paperTypeArray,
//                            perRate: list[i][5],
//                            withLam: list[i][6],
//                            defunct: false,
//                        }
//                        array.push(arrayObj);
//                    }
//                }
//                resolve(array);
//            };
//            reader.readAsArrayBuffer(target.files[0]);
//        })
//        
//    }
//    
//    uploadPostPressRateBindingExcel(evt: any, excelSheetNo: number) 
//    {
//        return new Promise((resolve, reject) =>
//        {
//            var array: any[] = [];
//            /* wire up file reader */
//            const target: DataTransfer = <DataTransfer>(evt.target);
//            if (target.files.length == 0) throw reject('Cannot select files');
//            if (target.files.length !== 1) throw reject('Cannot use multiple files');
//            const reader: FileReader = new FileReader();
//            reader.onload = (e: any) => 
//    
//            {
//                /* read workbook */
//                const bstr: string = e.target.result;
//                const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'array'});
//
//                /* grab first sheet */
//                const wsname: string = wb.SheetNames[excelSheetNo];
//                const ws: XLSX.WorkSheet = wb.Sheets[wsname];
//
//                /* save data */
//                var list: any = XLSX.utils.sheet_to_json(ws, {header: 1, raw: false});
//                
//                for (let i = 0; i < list.length; i++) 
//                {
//                    if (list[i].length == 5 && list[i] != list[0] ) 
//                    {
//                        let arrayObj = {
//                            orgId: "1",
//                            oprId: "0",
//                            bindingType: list[i][0].trim(),
//                            bindMinForms: list[i][1].split('–')[0].trim(),
//                            bindMaxForms: list[i][1].split('–')[1].trim(),
//                            bindRatePerBook: (list[i][2]) ? list[i][2] : null,
//                            bindRatePerForms: (list[i][3]) ? list[i][3] : null,
//                            bindMinCharge: list[i][4],
//                            defunct: false,
//                        }
//                        array.push(arrayObj);
//                    }
//                    if (list[i].length == 6 && list[i] != list[0] ) 
//                    {
//                        var arrayObj = {
//                            orgId: "1",
//                            oprId: "0",
//                            bindingType: list[i][0].trim(),
//                            bindSpineCreasePerThousRate: list[i][5],
//                            defunct: false,
//                        }
//                        array.push(arrayObj);
//                    }
//                }
//                resolve(array);
//            };
//            reader.readAsArrayBuffer(target.files[0]);
//        })
//        
//    }
//    
//    uploadEnvelopeOpenSizeExcel(evt: any, excelSheetNo: number) 
//    {
//        return new Promise((resolve, reject) =>
//        {
//            var array: any[] = [];
//            /* wire up file reader */
//            const target: DataTransfer = <DataTransfer>(evt.target);
//            if (target.files.length == 0) throw reject('Cannot select files');
//            if (target.files.length !== 1) throw reject('Cannot use multiple files');
//            const reader: FileReader = new FileReader();
//            reader.onload = (e: any) => 
//            {
//                /* read workbook */
//                const bstr: string = e.target.result;
//                const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'array'});
//
//                /* grab first sheet */
//                const wsname: string = wb.SheetNames[excelSheetNo];
//                const ws: XLSX.WorkSheet = wb.Sheets[wsname];
//
//                /* save data */
//                var list: any = XLSX.utils.sheet_to_json(ws, {header: 1, raw: false});
//                
//                for (let i = 0; i < list.length; i++) 
//                {
//                    if (list[i].length == 3 && list[i] != list[0] ) 
//                    {
//                        var arrayObj = {
//                            orgId: "1",
//                            oprId: "0",
//                            prodSizeL: list[i][0].split('X')[0].trim(),
//                            prodSizeB: list[i][0].split('X')[1].trim(),
//                            envelopeOpenSizeL: list[i][1].trim(),
//                            envelopeOpenSizeB: list[i][2].trim(),
//                            defunct: false,
//                        }
//                        array.push(arrayObj);
//                    }
//                }
//                resolve(array);
//            };
//            reader.readAsArrayBuffer(target.files[0]);
//        })
//        
//    }
//    
//    uploadPostPressRateExcel(evt: any, excelSheetNo: number) 
//    {
//        return new Promise((resolve, reject) =>
//        {
//            var array: any[] = [];
//            /* wire up file reader */
//            const target: DataTransfer = <DataTransfer>(evt.target);
//            if (target.files.length == 0) throw reject('Cannot select files');
//            if (target.files.length !== 1) throw reject('Cannot use multiple files');
//            const reader: FileReader = new FileReader();
//            reader.onload = (e: any) => 
//            {
//                /* read workbook */
//                const bstr: string = e.target.result;
//                const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'array'});
//
//                /* grab first sheet */
//                const wsname: string = wb.SheetNames[excelSheetNo];
//                const ws: XLSX.WorkSheet = wb.Sheets[wsname];
//
//                /* save data */
//                var list: any = XLSX.utils.sheet_to_json(ws, {header: 1, raw: false});
//                let count =0;
//                for (let i = 0; i < list.length; i++) 
//                {
//                    if (wsname == "Group1")
//                    {
//                        if (list[i].length == 6 && list[i] != list[0] ) 
//                        {
//                            let arrayObj = {
//                                orgId: "1",
//                                oprId: "0",
//                                postPressName: list[i][0].trim(),
//                                minqty: list[i][1].split('–')[0].trim(),
//                                maxqty: list[i][1].split('–')[1].trim(),
//                                qty: list[i][2],
//                                minL: list[i][3].split('–')[0].split('X')[0].trim(),
//                                minB: list[i][3].split('–')[0].split('X')[1].trim(),
//                                maxL: list[i][3].split('–')[1].split('X')[0].trim(),
//                                maxB: list[i][3].split('–')[1].split('X')[1].trim(),
//                                perRate: list[i][4],
//                                pPressGroup: list[i][5],
//                                defunct: false,
//                            }
//                            array.push(arrayObj);
//                        }
//                    }
//                    if (wsname == "Group2")
//                    {
//                        if (list[i].length == 4 && list[i] != list[0] ) 
//                        {
//                            let arrayObj = {
//                                orgId: "1",
//                                oprId: "0",
//                                postPressName: list[i][0].trim(),
//                                minqty: list[i][1].split('–')[0].trim(),
//                                maxqty: list[i][1].split('–')[1].trim(),
//                                perRate: list[i][2],
//                                pPressGroup: list[i][3],
//                                defunct: false,
//                            }
//                            array.push(arrayObj);
//                        }
//                    }
//                    if (wsname == "Group3")
//                    {
//                        if (list[i].length == 5 && list[i] != list[0] ) 
//                        {
//                            let arrayObj = {
//                                orgId: "1",
//                                oprId: "0",
//                                postPressName: list[i][0].trim(),
//                                minqty: list[i][1].split('–')[0].trim(),
//                                maxqty: list[i][1].split('–')[1].trim(),
//                                perRate: list[i][2],
//                                minCharge: list[i][3],
//                                pPressGroup: list[i][4],
//                                defunct: false,
//                            }
//                            array.push(arrayObj);
//                        }
//                    }
//                    if (wsname == "Group4")
//                    {
//                        if (list[i].length == 7 && list[i] != list[0] ) 
//                        {
//                            let arrayObj = {
//                                orgId: "1",
//                                oprId: "0",
//                                postPressName: list[i][0].trim(),
//                                minL: list[i][1].split('–')[0].split('X')[0].trim(),
//                                minB: list[i][1].split('–')[0].split('X')[1].trim(),
//                                maxL: list[i][1].split('–')[1].split('X')[0].trim(),
//                                maxB: list[i][1].split('–')[1].split('X')[1].trim(),
//                                minqty: list[i][2].split('–')[0].trim(),
//                                maxqty: list[i][2].split('–')[1].trim(),
//                                side: (list[i][3]) ? list[i][3] : null,
//                                perRate: list[i][4],
////                                minCharge: list[i][5],
////                                side: list[i][3].trim(),
//                                minCharge: (list[i][5]) ? list[i][5] : null,
//                                pPressGroup: list[i][6],
//                                defunct: false,
//                            }
//                            array.push(arrayObj);
//                        }
////                        if (list[i].length == 6 && list[i] != list[0] ) 
////                        {
////                            let arrayObj = {
////                                orgId: "1",
////                                oprId: "0",
////                                postPressName: list[i][0].trim(),
////                                minL: list[i][1].split('–')[0].split('X')[0].trim(),
////                                minB: list[i][1].split('–')[0].split('X')[1].trim(),
////                                maxL: list[i][1].split('–')[1].split('X')[0].trim(),
////                                maxB: list[i][1].split('–')[1].split('X')[1].trim(),
////                                minqty: list[i][2].split('–')[0].trim(),
////                                maxqty: list[i][2].split('–')[1].trim(),
////                                side: list[i][3].trim(),
////                                perRate: list[i][4],
////                                pPressGroup: list[i][5],
////                                defunct: false,
////                            }
////                            array.push(arrayObj);
////                        }
//                    }
//                    if (wsname == "Group5")
//                    {
//                        if (list[i].length == 7 && list[i] != list[0] ) 
//                        {
//                            let arrayObj = {
//                                orgId: "1",
//                                oprId: "0",
//                                postPressName: list[i][0].trim(),
//                                selectType: list[i][1].trim(),
////                                length: list[i][2].split('X')[0].trim(),
////                                width: list[i][2].split('X')[1].trim(),
////                                side: list[i][3].trim(),
//                                length: (list[i][2]) ? list[i][2].split('X')[0].trim() : null,
//                                width: (list[i][2]) ? list[i][2].split('X')[1].trim() : null,
//                                side: (list[i][3]) ? list[i][3].trim() : null,
//                                perRate: list[i][4],
//                                labourCharge: list[i][5],
//                                pPressGroup: list[i][6],
//                                defunct: false,
//                            }
//                            array.push(arrayObj);
//                        }
////                        if (list[i].length == 6 && list[i] != list[0] ) 
////                        {
////                            let arrayObj = {
////                                orgId: "1",
////                                oprId: "0",
////                                postPressName: list[i][0].trim(),
////                                selectType: list[i][1].trim(),
////                                length: list[i][2].split('X')[0].trim(),
////                                width: list[i][2].split('X')[1].trim(),
////                                side: list[i][3].trim(),
////                                perRate: list[i][4],
////                                pPressGroup: list[i][5],
////                                defunct: false,
////                            }
////                            array.push(arrayObj);
////                        }
//                    }
//                    if (wsname == "Group6")
//                    {
//                        if (list[i].length == 13 && list[i] != list[0] ) 
//                        {
//                            let arrayObj = {
//                                orgId: "1",
//                                oprId: "0",
//                                postPressName: list[i][0].trim(),
//                                minL: list[i][1].split('–')[0].split('X')[0].trim(),
//                                minB: list[i][1].split('–')[0].split('X')[1].trim(),
//                                maxL: list[i][1].split('–')[1].split('X')[0].trim(),
//                                maxB: list[i][1].split('–')[1].split('X')[1].trim(),
//                                minqty: list[i][2].split('–')[0].trim(),
//                                maxqty: list[i][2].split('–')[1].trim(),
//                                upsSqrInchMin: (list[i][3]) ? list[i][3].split('–')[0].trim() : null,
//                                upsSqrInchMax: (list[i][3]) ? list[i][3].split('–')[1].trim() : null,
//                                upsRangeMin: (list[i][4]) ? list[i][4].split('–')[0].trim() : null,
//                                upsRangeMax: (list[i][4]) ? list[i][4].split('–')[1].trim() : null,
//                                perRate: list[i][5],
//                                NORMAL_rate: list[i][6],
//                                NORMAL_minCharge: list[i][7],
//                                IMPORTED_rate: list[i][8],
//                                IMPORTED_minCharge: list[i][9],
//                                LAZER_rate: list[i][10],
//                                LAZER_minCharge: list[i][11],
//                                pPressGroup: list[i][12],
//                                defunct: false,
//                            }
//                            array.push(arrayObj);
//                        }
//                    }
//                    if (wsname == "Group7")
//                    {
//                        if (list[i].length == 8 && list[i] != list[0] ) 
//                        {
//                            let arrayObj = {
//                                orgId: "1",
//                                oprId: "0",
//                                postPressName: list[i][0].trim(),
//                                upsSqrInchMin: (list[i][1]) ? list[i][1].split('–')[0].trim() : null,
//                                upsSqrInchMax: (list[i][1]) ? list[i][1].split('–')[1].trim() : null,
//                                minqty: list[i][2].split('–')[0].trim(),
//                                maxqty: list[i][2].split('–')[1].trim(),
//                                pPrssBlackPattyRate: (list[i][3]) ? list[i][3] : null,
//                                pPrssGoldenPattyRate: (list[i][4]) ? list[i][4] : null,
//                                pPrssSilverPattyRate: (list[i][5]) ? list[i][5] : null,
//                                pPrssWhitePattyRate: (list[i][6]) ? list[i][6] : null,
//                                pPressGroup: list[i][7],
//                                defunct: false,
//                            }
//                            array.push(arrayObj);
//                        }
//                        if (list[i].length == 7 && list[i] != list[0] ) 
//                        {
//                            let arrayObj = {
//                                orgId: "1",
//                                oprId: "0",
//                                postPressName: list[i][0].trim(),
//                                upsSqrInchMin: (list[i][1]) ? list[i][1].split('–')[0].trim() : null,
//                                upsSqrInchMax: (list[i][1]) ? list[i][1].split('–')[1].trim() : null,
//                                minqty: list[i][2].split('–')[0].trim(),
//                                maxqty: list[i][2].split('–')[1].trim(),
//                                pPrssBlackPattyRate: (list[i][3]) ? list[i][3] : null,
//                                pPrssGoldenPattyRate: (list[i][4]) ? list[i][4] : null,
//                                pPrssSilverPattyRate: (list[i][5]) ? list[i][5] : null,
//                                pPressGroup: list[i][6],
//                                defunct: false,
//                            }
//                            array.push(arrayObj);
//                        }
//                    }
//                    
//                    //////For Uploading Envelope Excel
//                    if (wsname == "Sheet1")
//                    {
//                        if (list[i].length == 7 && list[i] != list[0] ) 
//                        {
//                            var paperTypeArray: string[] = [];
//                            var paperTypeExcelArray: string[] = list[i][4].trim().split(',');
//                            for (let i = 0; i < paperTypeExcelArray.length; i++) {
//                                paperTypeArray.push(paperTypeExcelArray[i].trim());
//                            }
//
//                            let arrayObj = {
//                                orgId: "1",
//                                oprId: "0",
//                                postPressName: list[i][0].trim(),
//                                minL: list[i][1].split('X')[0].trim(),
//                                minB: list[i][1].split('X')[1].trim(),
//                                maxL: list[i][2].split('X')[0].trim(),
//                                maxB: list[i][2].split('X')[1].trim(),
//                                selectType: list[i][3],
//                                paperTypes: paperTypeArray,
//                                perRate: list[i][5].trim(),
//                                withLam: list[i][6].trim(),
//                                defunct: false,
//                            }
//                            array.push(arrayObj);
//                        }
//                    }
//                    if (wsname == "Sheet2")
//                    {
//                        if (list[i].length == 7 && list[i] != list[0] ) 
//                        {
//                            var paperTypeArray: string[] = [];
//                            var paperTypeExcelArray: string[] = list[i][4].trim().split(',');
//                            for (let i = 0; i < paperTypeExcelArray.length; i++) {
//                                paperTypeArray.push(paperTypeExcelArray[i].trim());
//                            }
//
//                            let arrayObj = {
//                                orgId: "1",
//                                oprId: "0",
//                                postPressName: list[i][0].trim(),
//                                minL: list[i][1].split('X')[0].trim(),
//                                minB: list[i][1].split('X')[1].trim(),
//                                maxL: list[i][2].split('X')[0].trim(),
//                                maxB: list[i][2].split('X')[1].trim(),
//                                selectType: list[i][3],
//                                paperTypes: paperTypeArray,
//                                perRate: list[i][5].trim(),
//                                withLam: list[i][6].trim(),
//                                defunct: false,
//                            }
//                            array.push(arrayObj);
//                        }
//                    }
//                    if (wsname == "Sheet3")
//                    {
//                        if (list[i].length == 7 && list[i] != list[0] ) 
//                        {
//                            var paperTypeArray: string[] = [];
//                            var paperTypeExcelArray: string[] = list[i][4].trim().split(',');
//                            for (let i = 0; i < paperTypeExcelArray.length; i++) {
//                                paperTypeArray.push(paperTypeExcelArray[i].trim());
//                            }
//
//                            let arrayObj = {
//                                orgId: "1",
//                                oprId: "0",
//                                postPressName: list[i][0].trim(),
//                                minL: list[i][1].split('X')[0].trim(),
//                                minB: list[i][1].split('X')[1].trim(),
//                                maxL: list[i][2].split('X')[0].trim(),
//                                maxB: list[i][2].split('X')[1].trim(),
//                                selectType: list[i][3],
//                                paperTypes: paperTypeArray,
//                                perRate: list[i][5].trim(),
//                                withLam: list[i][6].trim(),
//                                defunct: false,
//                            }
//                            array.push(arrayObj);
//                        }
//                    }
//                    //////////
//                }
//                resolve(array);
//            };
//            reader.readAsArrayBuffer(target.files[0]);
//        })
//        
//    }
//    
////    uploadProductExcel(evt: any) 
////    {
////        return new Promise((resolve, reject) =>
////        {
////            var array: any[] = [];
////            var j = 0;
////            /* wire up file reader */
////            const target: DataTransfer = <DataTransfer>(evt.target);
////            if (target.files.length == 0) throw reject('Cannot select files');
////            if (target.files.length !== 1) throw reject('Cannot use multiple files');
////            const reader: FileReader = new FileReader();
////            reader.onload = (e: any) => 
////            {
////                /* read workbook */
////                const bstr: string = e.target.result;
////                const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'array'});
////
////                /* grab first sheet */
////                const wsname: string = wb.SheetNames[0];
////                const ws: XLSX.WorkSheet = wb.Sheets[wsname];
////
////                /* save data */
////                var list: any = XLSX.utils.sheet_to_json(ws, {header: 1, raw: false});
////                
////                for (let i = 0; i < list.length; i++) 
////                {
////                    console.log(list[i]);
////                    if (list[i].length == 24) 
////                    {
////                        console.log(list[i][2]);
////                        j++;
////                        var arrayObj = {
////                            code: "PRD" + [j],
////                            orgId: "1",
////                            oprId: "1",
////                            prodName: list[i][2],
////                            prodPrice: list[i][22],
//////                            prodQty: list[i][2],
////                            prodDescription: list[i][2],
////                            inStock: true,
////                            inOffer: false,
////                            defunct: false
////                        }
//////                        array.push(arrayObj);
////                    }
////                }
////                resolve(array);
////            };
////            reader.readAsArrayBuffer(target.files[0]);
////        })
////        
////    }
//    
//    uploadTravelExcel(evt: any, excelSheetNo: number) 
//    {
//          console.log(excelSheetNo);
//        return new Promise((resolve, reject) =>
//        {
//            var array: any[] = [];
//            /* wire up file reader */
//            const target: DataTransfer = <DataTransfer>(evt.target);
//            if (target.files.length == 0) throw reject('Cannot select files');
//            if (target.files.length !== 1) throw reject('Cannot use multiple files');
//            const reader: FileReader = new FileReader();
//            reader.onload = (e: any) => 
//            {
//                /* read workbook */
//                const bstr: string = e.target.result;
//                const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'array'});
//
//                /* grab first sheet */
//                const wsname: string = wb.SheetNames[excelSheetNo];
//                const ws: XLSX.WorkSheet = wb.Sheets[wsname];
//
//                /* save data */
//                var list: any = XLSX.utils.sheet_to_json(ws, {header: 1, raw: false});
//                console.log(list);
//                
//                for (let i = 0; i < list.length; i++) 
//                {
//                    if (list[i].length == 19 && list[i] != list[0] ) 
//                    {
//                        var arrayObj = {
//                            orgId: "1",
//                            oprId: "0",
//                            travelName: list[i][0],
//                            travelNgpAdd: list[i][1],
//                            travelNgpContNo: list[i][2],
//                            travelSourceCity: list[i][3],
//                            travelSourceState: list[i][4],
//                            travelDestinationName: list[i][5],
//                            travelDeliveryAdd: list[i][6],
//                            travelDestCity: list[i][7],
//                            travelDestState: list[i][8],
//                            travelDestinationContNo: list[i][9],
//                            travelPayMode: list[i][10],
//                            travelService: list[i][11],
//                            travelWeeklyOff: list[i][12],
//                            travelSecureTime  : list[i][13],
//                            travelLastBookingTime  : list[i][14],
//                            travelRate_1_5kg  : list[i][15],
//                            travelRate_5_10kg  : list[i][16],
//                            travelRate_10_20kg  : list[i][17],
//                            travelRate_20_30kg  : list[i][18],
//                            defunct: false,
//                        }
//                        array.push(arrayObj);
//                    }
//                }
//                resolve(array);
//                console.log(array);
//            };
//            reader.readAsArrayBuffer(target.files[0]);
//        })
//    }
//    
//    
//    uploadCutRateExcel(evt: any, excelSheetNo: number) 
//    {
//        return new Promise((resolve, reject) =>
//        {
//            var array: any[] = [];
//            /* wire up file reader */
//            const target: DataTransfer = <DataTransfer>(evt.target);
//            if (target.files.length == 0) throw reject('Cannot select files');
//            if (target.files.length !== 1) throw reject('Cannot use multiple files');
//            const reader: FileReader = new FileReader();
//            reader.onload = (e: any) => 
//            {
//                /* read workbook */
//                const bstr: string = e.target.result;
//                const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'array'});
//
//                /* grab first sheet */
//                const wsname: string = wb.SheetNames[excelSheetNo];
//                const ws: XLSX.WorkSheet = wb.Sheets[wsname];
//
//                /* save data */
//                var list: any = XLSX.utils.sheet_to_json(ws, {header: 1, raw: false});
//                console.log(list);
//                
//                for (let i = 0; i < list.length; i++) 
//                {
//                    if (list[i].length == 5 && list[i] != list[0] ) 
//                    {
//                        var arrayObj = {
//                            orgId: "1",
//                            oprId: "0",
//                            cutMinUps: list[i][0],
//                            cutMaxUps: list[i][1],
//                            cutMinGsm: list[i][2],
//                            cutMaxGsm: list[i][3],
//                            cutRatePerThous: list[i][4],
//                            defunct: false,
//                        }
//                        array.push(arrayObj);
//                    }
//                }
//                resolve(array);
//                console.log(array);
//            };
//            reader.readAsArrayBuffer(target.files[0]);
//        })
//    }
//
//}