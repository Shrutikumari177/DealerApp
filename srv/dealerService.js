const cds = require('@sap/cds');

module.exports = async (srv) => {

    const externalService = await cds.connect.to('QrGeneratorApp_edmx');
    srv.on('READ', 'MaterialBox', async (req) => {
        try {
            const query = req.query;

            const result = await externalService.run(query);

            return result;
        } catch (err) {
            console.error('Error fetching data from external service:', err);
            req.error(500, 'Failed to fetch data from external service.');
        }
    });
    srv.on('READ', 'InnerContainer', async (req) => {
        try {
            const query = req.query;

            const result = await externalService.run(query);

            return result;
        } catch (err) {
            console.error('Error fetching data from external service:', err);
            req.error(500, 'Failed to fetch data from external service.');
        }
    });
    srv.on('READ', 'OuterContainer', async (req) => {
        try {
            const query = req.query;

            const result = await externalService.run(query);

            return result;
        } catch (err) {
            console.error('Error fetching data from external service:', err);
            req.error(500, 'Failed to fetch data from external service.');
        }
    });

    const ZTRACKTRACE_VALUEHELP_SRV = await cds.connect.to("ZTRACKTRACE_VALUEHELP_SRV");
    srv.on('READ', 'zcustomer_sotrack', req => ZTRACKTRACE_VALUEHELP_SRV.run(req.query))

    const ZTRACK_TRACE_SRV = await cds.connect.to("ZTRACK_TRACE_SRV");
    srv.on('READ', 'zbatchdetails_Track', req => ZTRACK_TRACE_SRV.run(req.query));

    srv.on('CREATE', 'Retailer', async (req) => {
        const requiredFields = ["Name", "Email", "ContactNo", "TaxNo", "Street", "District", "City", "Country", "PostalCode"];

        for (const field of requiredFields) {
            if (!req.data[field]) {
                return req.reject(400, `${field} is required.`);
            }
        }

        try {

            const existingRetailer = await cds.run(
                SELECT.one.from('Retailer').where({ TaxNo: req.data.TaxNo })
            );

            if (existingRetailer) {
                return req.reject(400, `Retailer with TaxNo ${req.data.TaxNo} already exists.`);
            }

            const { maxId } = await cds.run(
                SELECT.one.from('Retailer').columns('max(RetailerId) as maxId')
            ) || {};

            const nextRetailerId = (parseInt(maxId, 10) || 0) + 1;

            const newEntry = {
                RetailerId: nextRetailerId.toString(),
                ...req.data
            };


            await cds.run(INSERT.into('Retailer').entries(newEntry));

            return newEntry;
        } catch (error) {
            console.error(error);
            return req.reject(500, error);
        }
    });

    srv.on('getDealerDashOCValueHelp', async (req) => {
        const { DealerId } = req.data;

        const results = await externalService.run(SELECT.from('OuterContainer')
            .where({ DealerId: DealerId })
        )

        const OCIDList = results.map(item => ({
            OCID: item.OCID
        }));

        return OCIDList;
    });

    srv.on('getOCValueHelpforRetailerMapping', async (req) => {
        const { DealerId, SelectionType } = req.data;

        if (!DealerId || !SelectionType) {
            return req.reject(400, "DealerId and SelectionType are required.");
        }

        const entityMap = {
            "OuterContainer": { entity: "OuterContainer", key: "OCID" },
            "InnerContainer": { entity: "InnerContainer", key: "ICID" },
            "Box": { entity: "MaterialBox", key: "SerialNo" }
        };

        const selectedEntity = entityMap[SelectionType];

        if (!selectedEntity) {
            return req.reject(400, "Invalid SelectionType. Choose 'OuterContainer', 'InnerContainer', or 'Box'.");
        }

        try {
            const results = await externalService.run(
                SELECT.from(selectedEntity.entity).where({ DealerId })
            );

            return results.map(item => ({
                [selectedEntity.key]: item[selectedEntity.key]
            }));
        } catch (error) {
            console.error("Error fetching value help:", error);
            return req.reject(500, "An error occurred while retrieving data.");
        }
    });
    srv.on('getProductionTrackingDashboardData', async (req) => {
        try {
            const { OCID } = req.data;

            if (!OCID) {
                return req.reject(400, "'OCID' is a required parameter.");
            }

            const outerContainerData = await externalService.run(SELECT.one.from('OuterContainer')
                .columns([
                    'OCID',
                    'OCQRCode',
                    'OCQRCodeURL',
                    'BatchID',
                    'status',
                    'DealerId',
                    'DealerName'
                ])
                .where({ OCID }));

            if (!outerContainerData) {
                return req.reject(404, "No data found for the provided OCID.");
            }

            const { BatchID } = outerContainerData;


            const response = {
                OCID: outerContainerData.OCID,
                OCQRCode: outerContainerData.OCQRCode,
                OCQRCodeURL: outerContainerData.OCQRCodeURL,
                BatchID: outerContainerData.BatchID,
                status: outerContainerData.status,
                DealerId: outerContainerData.DealerId || "",
                DealerName: outerContainerData.DealerName || "",
                ManufactureDt: null,
                ExpiryDt: null,
                ProductionOrder: null,
                Material: null,
                ICs: []
            };

            const icData = await externalService.run(SELECT.from('MaterialBox')
                .columns([
                    'IC_ICID as ICID',
                    'IC_ICQRCode as ICQRCode',
                    'IC_ICQRCodeURL as ICQRCodeURL',
                    'SerialNo',
                    'BoxQRCode',
                    'BoxQRCodeURL',
                    'IC.OC_OCID'
                ])
                .where({ 'IC.OC_OCID': OCID, BatchID }));

            if (icData.length > 0) {
                const groupedICs = icData.reduce((acc, item) => {
                    if (!acc[item.ICID]) {
                        acc[item.ICID] = {
                            ICID: item.ICID,
                            ICQRCode: item.ICQRCode,
                            ICQRCodeURL: item.ICQRCodeURL,
                            Boxes: []
                        };
                    }
                    acc[item.ICID].Boxes.push({
                        SerialNo: item.SerialNo,
                        BoxQRCode: item.BoxQRCode,
                        BoxQRCodeURL: item.BoxQRCodeURL
                    });
                    return acc;
                }, {});
                response.ICs = Object.values(groupedICs);
            }

            const batchDetails = await ZTRACK_TRACE_SRV.run(
                SELECT.one
                    .from('zbatchdetails_Track')
                    .columns(['ManufactureDt', 'ExpiryDt', 'ProductionOrder', 'Material'])
                    .where({ BatchNo: BatchID })
            );

            if (batchDetails) {
                Object.assign(response, {
                    ManufactureDt: batchDetails.ManufactureDt,
                    ExpiryDt: batchDetails.ExpiryDt,
                    ProductionOrder: batchDetails.ProductionOrder,
                    Material: batchDetails.Material
                });
            }

            return response;

        } catch (error) {
            console.error("Error in getProductionTrackingDashboardData:", error);
            return req.reject(500, error.message || "Internal Server Error");
        }
    });

    srv.on('getDealerOcIcBoxMappingdata', async (req) => {
        try {
            const { ICID, OCID, SerialNo } = req.data;
            if (!ICID && !OCID && !SerialNo) {
                return req.reject(400, 'Either ICID, OCID, or SerialNo must be provided.');
            }

            let entity, whereClause, idField, quantitySource;
            if (SerialNo) {
                entity = 'MaterialBox';
                whereClause = { SerialNo };
                idField = 'IC_ICID as ICID';
                quantitySource = async () => 1;
            } else if (OCID) {
                entity = 'OuterContainer';
                whereClause = { OCID };
                idField = 'OCID';
                quantitySource = async () => (await externalService.run(SELECT.from('InnerContainer').where({ OC_OCID: OCID }))).length;
            } else {
                entity = 'InnerContainer';
                whereClause = { ICID };
                idField = 'ICID';
                quantitySource = async () => (await externalService.run(SELECT.from('MaterialBox').where({ IC_ICID: ICID }))).length;
            }

            const data = await externalService.run(SELECT.one.from(entity).where(whereClause)
                .columns(idField, 'BatchID', 'RetailerId', 'RetailerTaxNo'));
            if (!data) return req.reject(404, `No record found for given identifier.`);

            const batchDetails = await ZTRACK_TRACE_SRV.run(SELECT.one.from('zbatchdetails_Track')
                .columns(['ManufactureDt', 'ExpiryDt', 'ProductionOrder'])
                .where({ BatchNo: data.BatchID }));
            if (!batchDetails) return req.reject(404, `No details found for BatchID: ${data.BatchID}`);

            const retailerData = await SELECT.one.from('DealerDb.Retailer')
                .where({ RetailerId: data.RetailerID })
                .columns('Name as RetailerName');

            return [{
                OCID: OCID ? data.OCID : null,
                ICID: ICID ? data.ICID : null,
                SerialNo: SerialNo ? SerialNo : null,
                ProductionOrder: batchDetails.ProductionOrder,
                BatchID: data.BatchID,
                ManufactureDt: batchDetails.ManufactureDt,
                ExpiryDt: batchDetails.ExpiryDt,
                Qunatity: await quantitySource(),
                RetailerID: data.RetailerId,
                RetailerTaxNo: data.RetailerTaxNo,
                RetailerName: retailerData ? retailerData.RetailerName : null
            }];
        } catch (error) {
            console.error('Error:', error);
            return req.reject(500, error.message);
        }
    });
    srv.on('MapRetailer', async (req) => {
        try {
            const { OC_OCID, IC_ICID, SerialNo, RetailerId, TaxNo } = req.data;
    
            if (!RetailerId) return req.reject(400, 'RetailerId is required.');
            if (!OC_OCID && !IC_ICID && !SerialNo) return req.reject(400, 'Either OCID, ICID, or SerialNo must be provided.');
    
            if (SerialNo) {
                const existingBox = await externalService.run(
                    SELECT.one.from('MaterialBox').where({ SerialNo })
                );
    
                if (!existingBox) return req.reject(404, `MaterialBox with SerialNo: ${SerialNo} not found.`);
                if (existingBox.RetailerId) return `MaterialBox ${SerialNo} is already mapped to Retailer ${existingBox.RetailerId}. Skipping update.`;
    
                await externalService.run(
                    UPDATE('MaterialBox')
                        .set({ RetailerId, RetailerTaxNo: TaxNo })
                        .where({ SerialNo ,BoxQRCode:existingBox.BoxQRCode })
                );
    
                return `MaterialBox ${SerialNo} has been successfully mapped to Retailer ${RetailerId}.`;
            }
    
            if (IC_ICID) {
                const existingIC = await externalService.run(
                    SELECT.one.from('InnerContainer').where({ ICID: IC_ICID })
                );
    
                if (!existingIC) return req.reject(404, `InnerContainer with ICID: ${IC_ICID} not found.`);
    
                await externalService.run(
                    UPDATE('InnerContainer')
                        .set({ RetailerId, RetailerTaxNo: TaxNo })
                        .where({ ICID: IC_ICID, ICQRCode: existingIC.ICQRCode, ICQRCodeURL: existingIC.ICQRCodeURL })
                );
    
                const materialBoxes = await externalService.run(
                    SELECT.from('MaterialBox').where({ IC_ICID, RetailerId: { '!=': RetailerId } })
                );
    
                for (const box of materialBoxes) {
                    await externalService.run(
                        UPDATE('MaterialBox')
                            .set({ RetailerId, RetailerTaxNo: TaxNo })
                            .where({ SerialNo: box.SerialNo, BoxQRCode: box.BoxQRCode })
                    );
                }
    
                return `InnerContainer ${IC_ICID} and its associated MaterialBoxes have been successfully mapped to Retailer ${RetailerId}.`;
            }
    
            if (OC_OCID) {
                const existingOC = await externalService.run(
                    SELECT.one.from('OuterContainer').where({ OCID: OC_OCID })
                );
    
                if (!existingOC) return req.reject(404, `OuterContainer with OCID: ${OC_OCID} not found.`);
    
                await externalService.run(
                    UPDATE('OuterContainer')
                        .set({ RetailerId, RetailerTaxNo: TaxNo })
                        .where({ OCID: OC_OCID, OCQRCode: existingOC.OCQRCode, OCQRCodeURL: existingOC.OCQRCodeURL })
                );
    
                const innerContainers = await externalService.run(
                    SELECT.from('InnerContainer').where({ OC_OCID, RetailerId: { '!=': RetailerId } })
                );
    
                for (const ic of innerContainers) {
                    await externalService.run(
                        UPDATE('InnerContainer')
                            .set({ RetailerId, RetailerTaxNo: TaxNo })
                            .where({ ICID: ic.ICID, ICQRCode: ic.ICQRCode, ICQRCodeURL: ic.ICQRCodeURL })
                    );
    
                    const materialBoxes = await externalService.run(
                        SELECT.from('MaterialBox').where({ IC_ICID: ic.ICID, RetailerId: { '!=': RetailerId } })
                    );
    
                    for (const box of materialBoxes) {
                        await externalService.run(
                            UPDATE('MaterialBox')
                                .set({ RetailerId, RetailerTaxNo: TaxNo })
                                .where({ SerialNo: box.SerialNo, BoxQRCode: box.BoxQRCode })
                        );
                    }
                }
    
                return `OuterContainer ${OC_OCID}, its InnerContainers, and their associated MaterialBoxes have been successfully mapped to Retailer ${RetailerId}.`;
            }
        } catch (error) {
            console.error('Error in MapRetailer:', error.message);
            req.reject(500, `Internal Server Error: ${error.message}`);
        }
    });
    



  














}
