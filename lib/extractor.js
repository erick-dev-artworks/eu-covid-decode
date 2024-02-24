const Jimp = require("jimp");
const jsQR = require("jsqr");
const fs = require('fs');
const cbor = require('cbor');
const { inflate } = require('zlib');
const { decode } = require("base45");
const { decodeFirst } = require("cbor");
const {
    HEALTH_CERTIFICATE_PREFIX,
    CLAIM_KEY_CERT,
    CLAIM_KEY_V1EU
} = require("./defs");

const Extractor = module.exports;

Extractor.qr2pass = (imagePath) => new Promise(async (resolve, reject) => {

    // read the image as color buffer
    const image = await Jimp.read(fs.readFileSync(imagePath));

    // convert to unsigned 8bit values so we can use jsQR
    const qrCodeImageArray = new Uint8ClampedArray(image.bitmap.data.buffer);

    // decode the QR image data
    const code = jsQR(
        qrCodeImageArray,
        image.bitmap.width,
        image.bitmap.height
    );


    var hash = '6BFQW2MA6IUO9P2L*I%JM0BJ/BKXVDH4ON2L.L6XEHS94364OCGDHT*N77WL9:L1V62KBBPGBOPJK01FT5CN9 G90OX/N:CRT02CJDA184UF:$5%+1.BQGC2V5SV7K5+OQFBL/N*5FGN2JKSM/K:/01QRXUN8LJJ69Q0N YS*B6Z907UCZAT%3TUO2K/GL%GM-OIZI:7WLOPD6A.NDL$I*HOT52HHN.HVQ89GLM3M82WH-AN+PT IVZQOD.II/AP3PCY4B5H*3T8003YV0QOHQBK:9471PN0VMK6G7/FOJ86HR2C9IK*P51S.61 T7*8V$$KXHSWIU7UV TV1+41CL/$PR5O2%HZO3VZ776I6LRM7T7NP:MM/.M5.OT+53OVNW4K BEH6B81VAWL:KXZB'
    function combine(str){
        const result = [];
        for(let i = 1; i < Math.pow(2, str.length) - 1; i++)
           result.push([...str].filter((_, pos) => (i >> pos) & 1).join(""));
       return result;
     }

    var alldata = await combine(hash)
    for(var t=0; t<alldata.length; t++){
        datanew = alldata[t]

        const b45decoded = decode(hash);
        console.log(b45decoded)
    }

    // check prefix health certificate
    // if (!hash || !hash.startsWith(HEALTH_CERTIFICATE_PREFIX)) {
    //     return reject(`QR code payload prefix ${HEALTH_CERTIFICATE_PREFIX} not found, skipping`);
    // }
    // // remove the signature from the payload (HC1:...)
    // const targetPayload = hash.slice(HEALTH_CERTIFICATE_PREFIX.length);

    // decode the data in the base45
    // helpful source -> https://ehealth.vyncke.org/
    // const b45decoded = decode(hash);

    // // inflate the data since it has been passed into zlib before (0x78)
    // inflate(b45decoded, async (err, deflated) => {
    //     if (err) return reject(err);

    //     // decode whole payload (COSE/CBOR), returned as a js Map
    //     const objBase = await cbor.decodeFirst(deflated);
    //     const partUser = objBase.toJSON().value[2];

    //     // decode certificate / user payload, returned as a js Map
    //     const objUser = await decodeFirst(partUser);
    //     const certData = objUser.get(CLAIM_KEY_CERT);
    //     const userData = certData.get(CLAIM_KEY_V1EU);

    //     return resolve(userData);
    // });
});
