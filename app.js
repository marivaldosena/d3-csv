d3.queue()
    .defer(d3.csv, '/data/co2/API_EN.ATM.CO2E.KT_DS2_en_csv_v2', formatter)
    .defer(d3.csv, '/data/methane/API_EN.ATM.METH.KT.CE_DS2_en_csv_v2', formatter)
    .defer(d3.csv, '/data/renewable/API_EG.FEC.RNEW.ZS_DS2_en_csv_v2', formatter)
    .defer(d3.csv, '/data/population/API_SP.POP.TOTL_DS2_en_csv_v2', formatter)
    .defer(d3.csv, '/data/urban_population/API_SP.URB.TOTL_DS2_en_csv_v2', formatter)
    .awaitAll((error, data) => {
        if (error) throw error;
        
        console.log(data);
    })