const { pass2qr } = require("./lib/generator");
const { qr2pass } = require("./lib/extractor");

const IMG_PATH = process.argv[2];
if (!IMG_PATH) {
    console.error('Usage: npm start <path_to_image>');
    return process.exit(-1);
}

(async () => {

    // Create a dummy QR code (check function code)
    // await createOne();

    // Try to parse an existing one
    const ts = new Date();
    console.log('Opening', IMG_PATH, '...');
    const extrInfo = await qr2pass(IMG_PATH);
    // console.log('Decoded in', (new Date() - ts), 'ms:', extrInfo);
    console.log('cat', extrInfo)
    // console.log(extrInfo['b'])

    // console.log(extrInfo['c'])
})();

// testA123
async function createOne() {

    // https://github.com/ehn-dcc-development/hcert-spec/blob/main/hcert_spec.md
    const AGLO_SIGN = -7 // Protected Header Signature Algorithm (may-be public);
    const SIGN_KEY_ID = Buffer.from([0x12, /* ... 8 bytes sequence for the used algorithm signature (may-be public) */]);
    const HCERT_SIGN = Buffer.from([/* ... 64 bytes sequence health certificate signature */]);

    const obj = {
        v: [
        {
            // Unique certificate identifier
            ci: 'urn:uvci:01:lv:79e77b8009c7f99dcfc0d0d7b6db4d95',
            // Member State or third country in which the vaccine was administered
            co: 'LV',
            // Doses count
            dn: 2,
            // Date of vaccination
            dt: '2021-07-30',
            // Vaccine issuer
            is: 'Nacionālais veselības dienests',
            // Vaccine manufacturer, e.g., "ORG-100030215" (Biontech Manufacturing GmbH)
            ma: 'ORG-100030215',
            // Vaccine product, e.g., "EU/1/20/1528" (Comirnaty)
            mp: 'EU/1/20/1528',
            // Overall doses count
            sd: 2,
            // Targeted agent / disease
            tg: '840539006',
            // Type of vaccine used
            vp: '1119349007'
        }
        ],
        // Date of birth
        dob: '1982-12-26',
        // Firstnames an lastnames, according to ICAO 9303 transliteration
        nam: { fn: 'Retigs', gn: 'RETIGS', fnt: 'Elgars', gnt: 'ELGARS' },
        // JSON schema / certificate semantic version
        ver: '1.0.0'
    };

    const strQR = await pass2qr(
        AGLO_SIGN, SIGN_KEY_ID,  HCERT_SIGN,
        'LV', // Vaccine issuer, french one here
        1660896431 /* timestamp of vaccination */,
        1629360431 /* timestamp for qrcode generation date */,
        obj,
        './new_generated.png' // path to output
    );
    console.log('Generated!', strQR);

}
