const { readInput, pausa } = require('./js/inquirer');
const Cfdi = require('./js/cfdi.js');
const fs = require('fs');
const pdf = require('html-pdf')
const qrcode = require('qrcode')
const totalEnLetra = require('./js/totalEnLetra')
const pdfTemplate = require('./js/template')

const main = async () => {
    const fac = new Cfdi();
    const inputValue = await readInput('Número de factura:',fac.lastFac + 1) || fac.lastFac + 1;

    const xmlPath = `./xml/${inputValue}.xml`
    if (!fs.existsSync(xmlPath)) {
        console.log(`no existe el XML de la factura ${inputValue}`)
        return
    }

    const xml = fs.readFileSync(xmlPath, { encoding: 'utf-8' })
    const parseString = require('xml2js').parseString;

    parseString(xml, { mergeAttrs: true, explicitArray: false }, (err, result) => {

        const xmlObj = result['cfdi:Comprobante']
        const totalLetra = totalEnLetra(xmlObj.Total).toLowerCase() + 'MXN'
        const { UUID } = xmlObj['cfdi:Complemento']['tfd:TimbreFiscalDigital']
        const { Rfc } = xmlObj['cfdi:Emisor']
        const { Rfc: rRfc } = xmlObj['cfdi:Receptor']
        const { Total, Sello } = xmlObj
        const Sello8 = Sello.slice(-8)
        const urlBase = 'https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx'
        const qrStr = `${urlBase}?id=${UUID}&re=${Rfc}&rr=${rRfc}&tt=${Total}&fe=${Sello8}`
        // const logo = 'data:image/png;base64,' + fs.readFileSync('./misc/logo.png', {encoding: 'base64'}) || '';
        const logo = './logo.png';
        
        const options = { "format": "Letter", "border": "0px", "localUrlAccess": true,  "base": `file://${__dirname}/`, };
        qrcode.toDataURL(qrStr).then(qr => {
            pdf.create(pdfTemplate(xmlObj, qr, logo, totalLetra), options).toFile(`./pdf/${inputValue}.pdf`, (err) => {
                if (err) {
                    console.log('ERROR');
                }
                console.log('PDF generado');
                fac.saveDB(inputValue)
                pausa();
            });
        })
    });
}

main();