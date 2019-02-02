d3.queue()
    .defer(d3.csv, '/data/co2/API_EN.ATM.CO2E.KT_DS2_en_csv_v2', formatter)
    .defer(d3.csv, '/data/methane/API_EN.ATM.METH.KT.CE_DS2_en_csv_v2', formatter)
    .defer(d3.csv, '/data/renewable/API_EG.FEC.RNEW.ZS_DS2_en_csv_v2', formatter)
    .defer(d3.csv, '/data/population/API_SP.POP.TOTL_DS2_en_csv_v2', formatter)
    .defer(d3.csv, '/data/urban_population/API_SP.URB.TOTL_DS2_en_csv_v2', formatter)
    .awaitAll((error, data) => {
        if (error) throw error;
        
        let yearObj = formatAllData(data);
        
        const formatAllData = (data) => {
            let yearObj = {};
            
            data.forEach(arr => {
                const indicator = arr[0].indicator
                    .split(' ')[0]
                    .replace(',', '')
                    .toLocaleLowerCase()
                    
                arr.forEach(obj => {
                    const region = obj.region;
                    
                    for (let year in obj) {
                        if (! yearObj[year]) yearObj[year] = [];
                        
                        const yearArr = yearObj[year];
                        const regionObj= yearArr.find(el => el.region === region);
                        
                        if (regionObj) {
                            regionObj[indicator] = obj[year];
                        } else {
                            const newObj = { region };
                            
                            newObj[indicator] = obj[year];
                            yearArr.push(newObj);
                        }
                    }
                })
            })
            
            for (let year in yearObj) {
                yearObj[year] = yearObj[year].filter(validRegion);
                if (yearObj[year].length === 0) delete yearObj[year];
            }
            
            return yearObj;
        } /* End formatAllData() */
        
        const formatter = (row) => {
            const invalidRows = [
                'Arab World',
                'Central Europe and the Baltics',
                'Caribbean small states',
                'East Asia & Pacific (excluding high income)',
                'Early-demographic dividend',
                'East Asia & Pacific',
                'Europe & Central Asia (excluding high income)',
                'Europe & Central Asia',
                'Euro area',
                'European Union',
                'Fragile and conflict affected situations',
                'High income',
                'Heavily indebted poor countries (HIPC)',
                'IBRD only',
                'IDA & IBRD total',
                'IDA total',
                'IDA blend',
                'IDA only',
                'Not classified',
                'Latin America & Caribbean (excluding high income)',
                'Latin America & Caribbean',
                'Least developed countries: UN classification',
                'Low income',
                'Lower middle income',
                'Low & middle income',
                'Late-demographic dividend',
                'Middle East & North Africa',
                'Middle income',
                'Middle East & North Africa (excluding high income)',
                'North America',
                'OECD members',
                'Other small states',
                'Pre-demographic dividend',
                'Pacific island small states',
                'Post-demographic dividend',
                'Sub-Saharan Africa (excluding high income)',
                'Sub-Saharan Africa',
                'Small states',
                'East Asia & Pacific (IDA & IBRD countries)',
                'Europe & Central Asia (IDA & IBRD countries)',
                'Latin America & the Caribbean (IDA & IBRD countries)',
                'Middle East & North Africa (IDA & IBRD countries)',
                'South Asia (IDA & IBRD)',
                'Sub-Saharan Africa (IDA & IBRD countries)',
                'Upper middle income',
                'World'
            ];
            
            var obj = {
                region: row['Country Name'],
                indicator: row['Indicator Name']
            };
            
            if (invalidRows.includes(obj.region)) return;
            
            for (let key in row) {
                if (parseInt(key)) obj[key] = +row[key] || null;
            }
            
            return obj;
        }
    })