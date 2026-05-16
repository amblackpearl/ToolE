//script experimental

const main = document.getElementById('mainDisplay');
const hideTool = document.querySelector(".tool-toolbar");
const theCalc = document.querySelector('.calculator');
const hideTB = document.querySelector('.tool-body');
const hideTP = document.getElementById('toolPanel');
theCalc.style.display = 'none';
/* ============================================================
DATA: 9 alat elektronik
============================================================ */
const tools = [
    { id: 'calc', name: 'Scientific \nCalculator', desc: 'Algebra \u00B7 Trig \u00B7 Calculus \u00B7 Matrix', logo: 'assets/calc.png', featured: false },
    { id: 'ohm', name: "Ohm's Law", desc: 'V = I \u00D7 R', logo: 'assets/ohm.png' },
    { id: 'vdiv', name: 'Voltage Divider', desc: 'Vout Calc', logo: 'assets/divR.png' },
    { id: 'rc', name: 'RC Time Const.', desc: '\u03C4 = R \u00D7 C', logo: 'assets/rc.png' },
    { id: 'capcode', name: 'Capacitor Code', desc: '3-Digit Decode', logo: 'assets/cap1.png' },
    { id: 'rescode', name: 'Resistor Color', desc: '4-Band Code', logo: 'assets/resCol.png' },
    { id: 'pid', name: 'PID', desc: 'PID Calc', logo: 'assets/pid.png' },
    { id: 'freq', name: 'Frequency & Period', desc: 'Convert between frequency, period, and wavelength.', logo: 'assets/freq.png' },
    { id: 'units', name: 'Units Converter', desc: 'Electrical Units Converter', logo: 'assets/units.png' },
    { id: 'opamp', name: 'Op-Amp Gain', desc: 'Inv / Non-Inv', logo: 'assets/opAmp.png' },
    { id: 'power', name: 'Power Calc', desc: 'P = V \u00D7 I', logo: 'assets/Power.png' },
    { id: 'unlocker', name: 'Scribd Unlocker', desc: 'Unlock Document', logo: 'assets/unlock.png' }

];

function getToolHTML(id) {
    const fn = {
        calc: calcHTML,
        ohm: ohmHTML,
        vdiv: vdivHTML,
        rc: rcHTML,
        freq: freq,
        capcode: capcodeHTML,
        rescode: rescodeHTML,
        units: unitsHTML,
        pid: pidHTML,
        opamp: opampHTML,
        power: powerHTML,
        unlocker: scribUnlockHTML
    };
    return fn[id]();
}

/* ============================================================
   RENDER DASHBOARD
   ============================================================ */
function renderDashboard() {
    const grid = document.getElementById('dashboard');
    grid.innerHTML = tools.map(t => {

        let iconContent = '';

        if (t.icon) {
            // It has a FontAwesome icon
            iconContent = `<i class="fa-solid ${t.icon}"></i>`;
        } else if (t.logo) {
            // It has an SVG or PNG file path
            iconContent = `<img src="${t.logo}" alt="${t.name}" class="custom-logo" />`;
        } else {
            // Fallback to text if neither exist
            iconContent = `<span class="text-icon">${t.name}</span>`;
        }

        // 2. Inject it into the featured card
        if (t.featured) {
            return `<div class="tool-card featured" onclick="openTool('${t.id}')">
                    <div class="icon-box">${iconContent}</div>
                    <div class="text-group">
                        <div class="name">${t.name}</div>
                        <div class="desc">${t.desc}</div>
                    </div>
                </div>`;
        }

        // 3. Inject it into the regular card
        return `<div class="tool-card" onclick="openTool('${t.id}')">
                <div class="icon-box">${iconContent}</div>
                <div class="name">${t.name}</div>
                <div class="desc">${t.desc}</div>
            </div>`;
    }).join('');
}

/* ============================================================
   SCREEN & TOAST
   ============================================================ */
function setScreen(text, small) {
    const el = document.getElementById('screenText');
    el.textContent = text;
    el.className = 'screen-text' + (small ? ' small' : '');
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._tid);
    t._tid = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ============================================================
   NAVIGASI
   ============================================================ */
function openTool(id) {
    const tool = tools.find(t => t.id === id);
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('toolPanel').classList.add('active');
    document.getElementById('toolTitle').textContent = tool.name;
    document.getElementById('modeBadge').textContent = tool.desc;
    setScreen('ENTER VALUES', true);
    document.getElementById('toolBody').innerHTML = getToolHTML(id);
    if (id === 'ohm') initOHM();
    else if (id === 'vdiv') initVdiv();
    else if (id === 'rescode') calcRes();
    else if (id === 'units') initUnit();
    else if (id === 'pid') initPID();
    else if (id === 'opamp') initOA();
    else if (id === 'capcode') initCapCalc();
    else if (id === 'freq') initFreq();
}

function closeTool() {
    document.getElementById('dashboard').style.display = 'grid';
    document.getElementById('toolPanel').classList.remove('active');
    document.getElementById('modeBadge').textContent = 'v2.0';
    setScreen('SELECT A TOOL TO BEGIN');
}

function calcHTML() {
    document.querySelector('.calculator').style.display = 'block',
        document.getElementById('mainDisplay').style.display = 'none',
        document.getElementById('toolPanel').style.display = 'none';


}

function closeCalc() {
    const dashboard = document.getElementById('dashboard');
    const toolPanel = document.getElementById('toolPanel');
    const mainDisplay = document.getElementById('mainDisplay');
    const calculator = document.querySelector('.calculator');

    calculator.style.display = 'none';
    mainDisplay.style.display = 'block';

    dashboard.style.display = 'grid';

    toolPanel.style.display = '';
    toolPanel.classList.remove('active');

    document.getElementById('modeBadge').textContent = 'v2.0';
    setScreen('SELECT A TOOL TO BEGIN');

    renderDashboard();
}

/* ============================================================
   1. OHM'S LAW
   ============================================================ */
function ohmHTML() {
    return `
                <div class="input-row">
                    <div class="input-group"><label>Voltage (V)</label>
                        <input type="number" id="ohmV" placeholder="?"></div>
                    <div class="input-group"><label>Current (A)</label>
                        <input type="number" id="ohmI" placeholder="?"></div>
                </div>
                <div class="input-row">
                    <div class="input-group full"><label>Resistance (\u03A9)</label>
                        <input type="number" id="ohmR" placeholder="?"></div>
                </div>
                <div class="input-hint">Leave exactly one field empty</div>`;
}

function initOHM() {
    const ohmV = document.getElementById('ohmV');
    const ohmI = document.getElementById('ohmI');
    const ohmR = document.getElementById('ohmR');

    if (!ohmV || !ohmI || !ohmR) return;

    [ohmV, ohmI, ohmR].forEach(input => { input.addEventListener('input', calcOhm) })


}

function calcOhm() {
    const v = document.getElementById('ohmV').value;
    const i = document.getElementById('ohmI').value;
    const r = document.getElementById('ohmR').value;
    const empty = [v === '', i === '', r === ''].filter(Boolean).length;
    if (empty === 3) {
        setScreen('');
        return;
    }

    if (empty !== 1) {
        setScreen('Leave exactly ONE field empty');
        return;
    }
    let res;
    if (v === '') res = 'V = ' + fmtEng(parseFloat(i) * parseFloat(r)) + ' V';
    else if (i === '') res = 'I = ' + fmtEng(parseFloat(v) / parseFloat(r)) + ' A';
    else res = 'R = ' + fmtEng(parseFloat(v) / parseFloat(i)) + ' \u03A9';
    setScreen(res);
}



/* ============================================================
   2. VOLTAGE DIVIDER
   ============================================================ */
function vdivHTML() {
    return `
                <div class="input-row">
                    <div class="input-group full"><label>Vin (V)</label>
                        <input type="number" id="vdVin" placeholder="12"></div>
                </div>
                <div class="input-row">
                    <div class="input-group"><label>R2 (\u03A9)</label>
                        <input type="number" id="vdR2" placeholder="10000"></div>
                    <div class="input-group"><label>R1 (\u03A9)</label>
                        <input type="number" id="vdR1" placeholder="10000"></div>
                </div>
                <div class="input-row">
                    <div class="input-group full"><label>Vout (V)</label>
                        <input type="number" id="vdVout" placeholder="12"></div>
                </div>
            `;
}

function calcVdiv() {
    const vin = document.getElementById('vdVin').value;
    const vout = document.getElementById('vdVout').value;
    const r1 = document.getElementById('vdR1').value;
    const r2 = document.getElementById('vdR2').value;
    const empty = [vin === '', vout === '', r1 === '', r2 === ''].filter(Boolean).length;
    if (empty === 4) {
        setScreen('');
        return;
    }

    if (empty !== 1) {
        setScreen('Leave exactly ONE field empty');
        return;
    }
    // if ([vin, r1, r2].some(isNaN) || r1 + r2 === 0) { showToast('Invalid input'); return; }
    // const vout = vin * r2 / (r1 + r2);
    // const cur = vin / (r1 + r2);
    let res;
    if (vout === '') res = 'Vout = ' + fmtEng(parseFloat(vin) * parseFloat(r2) / (parseFloat(r1) + parseFloat(r2))) + ' V';
    else if (vin === '') res = 'Vin = ' + fmtEng(parseFloat(vout) * parseFloat(r1) / parseFloat(r2)) + ' V';
    else if (r2 === '') res = 'R2 = ' + fmtEng(parseFloat(vout) * parseFloat(r1) / parseFloat(vin)) + ' \u03A9';
    else res = 'R1 = ' + fmtEng(parseFloat(r2) * parseFloat(vin) / (parseFloat(vout))) + ' \u03A9';
    // setScreen('Vout = ' + fmtEng(vout) + ' V\nI    = ' + fmtEng(cur) + ' A');
    setScreen(res);
}

function initVdiv() {
    const vdVin = document.getElementById('vdVin');
    const vdVout = document.getElementById('vdVout');
    const vdR1 = document.getElementById('vdR1');
    const vdR2 = document.getElementById('vdR2');
    if (!vdVin || !vdVout || !vdR1 || !vdR2) return;
    [vdVin, vdVout, vdR1, vdR2].forEach(input => { input.addEventListener('input', calcVdiv) })
}




/* ============================================================
   3. LED RESISTOR
   ============================================================ */
function ledHTML() {
    return `
                <div class="input-row">
                    <div class="input-group"><label>Source V (V)</label>
                        <input type="number" id="ledVs" placeholder="5"></div>
                    <div class="input-group"><label>LED Vf (V)</label>
                        <input type="number" id="ledVf" placeholder="2"></div>
                </div>
                <div class="input-row">
                    <div class="input-group full"><label>LED Current (mA)</label>
                        <input type="number" id="ledIf" placeholder="20"></div>
                </div>
                <button class="calc-btn" onclick="calcLed()">Calculate</button>`;
}

function calcLed() {
    const vs = parseFloat(document.getElementById('ledVs').value);
    const vf = parseFloat(document.getElementById('ledVf').value);
    const ima = parseFloat(document.getElementById('ledIf').value);
    if ([vs, vf, ima].some(isNaN)) { showToast('Invalid input'); return; }
    if (vs <= vf) { setScreen('ERROR: Vs must be > Vf'); return; }
    const i = ima / 1000;
    const r = (vs - vf) / i;
    const p = (vs - vf) * i * 1000;
    const std = nearE24(r);
    setScreen('R = ' + fmtEng(r) + ' \u03A9\nStd: ' + fmtEng(std) + ' \u03A9\nP = ' + fmtEng(p) + ' mW');
}

/* ============================================================
   4. RC TIME CONSTANT
   ============================================================ */
function rcHTML() {
    return `
                <div class="input-row">
                    <div class="input-group"><label>Resistance (\u03A9)</label>
                        <input type="number" id="rcR" placeholder="10000"></div>
                    <div class="input-group"><label>Capacitance (\u03BCF)</label>
                        <input type="number" id="rcC" placeholder="10"></div>
                </div>
                <button class="calc-btn" onclick="calcRC()">Calculate</button>`;
}

function calcRC() {
    const r = parseFloat(document.getElementById('rcR').value);
    const cuf = parseFloat(document.getElementById('rcC').value);
    if ([r, cuf].some(isNaN)) { showToast('Invalid input'); return; }
    const c = cuf * 1e-6;
    const t = r * c;
    setScreen(
        '\u03C4 = ' + fmtTime(t) + '\n' +
        '63.2% @ ' + fmtTime(t) + '\n' +
        '86.5% @ ' + fmtTime(2 * t) + '\n' +
        '95.0% @ ' + fmtTime(3 * t) + '\n' +
        '99.3% @ ' + fmtTime(5 * t));
}

/* ============================================================
   5. CAPACITOR CODE DECODER
   ============================================================ */
function capcodeHTML() {
    return `
                <div class="input-row">
                    <div class="input-group full"><label>3-Digit Code (e.g. 104)</label>
                        <input type="text" id="capCode" placeholder="104" maxlength="3"></div>
                </div>`;
}

function calcCap() {
    const code = document.getElementById('capCode').value.trim();
    if (!/^\d{3}$/.test(code)) { showToast('Enter a 3-digit code'); return; }
    const sig = parseInt(code.substring(0, 2));
    const mult = parseInt(code[2]);
    const pf = sig * Math.pow(10, mult);
    const nf = pf / 1e3;
    const uf = pf / 1e6;
    let s = pf + ' pF';
    if (nf >= 1) s += '\n' + (nf < 100 ? nf.toFixed(2) : nf.toFixed(0)) + ' nF';
    if (uf >= 0.001) s += '\n' + (uf < 1 ? uf.toFixed(3) : uf < 100 ? uf.toFixed(2) : uf.toFixed(0)) + ' \u03BCF';
    setScreen(s);
}

function initCapCalc() {

    const capcode = document.getElementById('capCode');
    if (!capcode) return;
    capcode.addEventListener('input', calcCap);
}

/* ============================================================
   6. RESISTOR COLOR CODE (4-BAND)
   ============================================================ */
const BAND_COLORS = [
    { n: 'Black', c: '#1a1a1a', v: 0 },
    { n: 'Brown', c: '#8B4513', v: 1 },
    { n: 'Red', c: '#D32F2F', v: 2 },
    { n: 'Orange', c: '#EF6C00', v: 3 },
    { n: 'Yellow', c: '#F9A825', v: 4 },
    { n: 'Green', c: '#2E7D32', v: 5 },
    { n: 'Blue', c: '#1565C0', v: 6 },
    { n: 'Violet', c: '#7B1FA2', v: 7 },
    { n: 'Gray', c: '#757575', v: 8 },
    { n: 'White', c: '#F5F5F5', v: 9 },
];
const TOL_COLORS = [
    { n: 'Brown', c: '#8B4513', v: 1 },
    { n: 'Red', c: '#D32F2F', v: 2 },
    { n: 'Gold', c: '#CFB53B', v: 5 },
    { n: 'Silver', c: '#B0B0B0', v: 10 },
];
let rb = [1, 0, 2, 2]; // default: 1kΩ ±2%

function rescodeHTML() {
    return `
                <div class="resistor-visual">
                    <div class="resistor-body" id="rBody">
                        <div class="color-band" id="rb0" style="background:${BAND_COLORS[rb[0]].c}" onclick="cycleBand(0)"></div>
                        <div class="color-band" id="rb1" style="background:${BAND_COLORS[rb[1]].c}" onclick="cycleBand(1)"></div>
                        <div class="color-band" id="rb2" style="background:${BAND_COLORS[rb[2]].c}" onclick="cycleBand(2)"></div>
                        <div class="color-band" id="rb3" style="background:${TOL_COLORS[rb[3]].c}" onclick="cycleBand(3)"></div>
                    </div>
                </div>
                <div class="band-tap-row">
                    ${[0, 1, 2].map(i => `
                        <div class="band-tap">
                            <div class="swatch" id="rs${i}" style="background:${BAND_COLORS[rb[i]].c}" onclick="cycleBand(${i})"></div>
                            <div class="swatch-label">${i < 2 ? 'Digit ' + (i + 1) : 'Mult'}</div>
                        </div>`).join('')}
                    <div class="band-tap">
                        <div class="swatch" id="rs3" style="background:${TOL_COLORS[rb[3]].c}" onclick="cycleBand(3)"></div>
                        <div class="swatch-label">Tol</div>
                    </div>
                </div>
                `;
}

function cycleBand(idx) {
    if (idx < 3) rb[idx] = (rb[idx] + 1) % 10;
    else rb[3] = (rb[3] + 1) % 4;
    for (let i = 0; i < 3; i++) {
        document.getElementById('rb' + i).style.background = BAND_COLORS[rb[i]].c;
        document.getElementById('rs' + i).style.background = BAND_COLORS[rb[i]].c;
    }
    document.getElementById('rb3').style.background = TOL_COLORS[rb[3]].c;
    document.getElementById('rs3').style.background = TOL_COLORS[rb[3]].c;
    calcRes();
}

function calcRes() {
    const val = (BAND_COLORS[rb[0]].v * 10 + BAND_COLORS[rb[1]].v) * Math.pow(10, BAND_COLORS[rb[2]].v);
    const tol = TOL_COLORS[rb[3]].v;
    const err = val * tol / 100;
    setScreen(fmtEng(val) + ' \u03A9\n\u00B1' + tol + '%  (' + fmtEng(err) + ' \u03A9)');
}


function unitsHTML() {
    return `
<div class="input-group full">
    <label>Value</label>
    <input type="number" id="unit-val" value="1" step="any">
</div>
<div class="input-row">
<div class="input-group">
    <label>From</label>
    <select id="unit-from">
        <option value="1e-12">p (pico)</option>
        <option value="1e-9">n (nano)</option>
        <option value="1e-6">µ (micro)</option>
        <option value="1e-3">m (milli)</option>
        <option value="1" selected>base (V/A/F/H)</option>
        <option value="1e3">k (kilo)</option>
        <option value="1e6">M (mega)</option>
        <option value="1e9">G (giga)</option>
    </select>
</div>
<div class="input-group">
    <label>To</label>
    <select id="unit-to">
        <option value="1e-12">p (pico)</option>
        <option value="1e-9">n (nano)</option>
        <option value="1e-6" selected>µ (micro)</option>
        <option value="1e-3">m (milli)</option>
        <option value="1">base (V/A/F/H)</option>
        <option value="1e3">k (kilo)</option>
        <option value="1e6">M (mega)</option>
        <option value="1e9">G (giga)</option>
    </select>
</div>
</div>
`;
}

function calcUnit() {
    const val = parseFloat(document.getElementById('unit-val').value);
    const from = parseFloat(document.getElementById('unit-from').value);
    const to = parseFloat(document.getElementById('unit-to').value);
    let res;

    if (isNaN(val)) { setScreen('Invalid input'); return; }

    const result = val * from / to;
    const prefix = document.getElementById('unit-to').options[document.getElementById('unit-to').selectedIndex].text.split(' ')[0];
    res = result.toLocaleString('en-US', { maximumFractionDigits: 12 }) + ' ' + prefix;
    setScreen(res);
}
function initUnit() {
    const unitVal = document.getElementById('unit-val');
    const unitFrom = document.getElementById('unit-from');
    const unitTo = document.getElementById('unit-to');

    if (!unitVal || !unitFrom || !unitTo) return;

    // Trigger calculation when the user types a number
    unitVal.addEventListener('input', calcUnit);

    // Trigger calculation when the user changes the dropdown options
    unitFrom.addEventListener('change', calcUnit);
    unitTo.addEventListener('change', calcUnit);
}


/* ============================================================
   8. OP-AMP GAIN
   ============================================================ */
function opampHTML() {
    return `
                <div class="input-row">
                    <div class="input-group full"><label>Mode</label>
                        <select id="oaMode">
                            <option value="ni">Non-Inverting</option>
                            <option value="inv">Inverting</option>
                        </select></div>
                </div>
                <div class="input-row">
                    <div class="input-group"><label>R1 (\u03A9)</label>
                        <input type="number" id="oaR1" placeholder="1000"></div>
                    <div class="input-group"><label>R2 (\u03A9)</label>
                        <input type="number" id="oaR2" placeholder="10000"></div>
                </div>
                <div class="input-row">
                    <div class="input-group full"><label>Vin (V) \u2014 optional</label>
                        <input type="number" id="oaVin" placeholder="0.1"></div>
                </div>`;
}

function calcOA() {
    const mode = document.getElementById('oaMode').value;
    const r1 = parseFloat(document.getElementById('oaR1').value);
    const r2 = parseFloat(document.getElementById('oaR2').value);
    const vinStr = document.getElementById('oaVin').value;
    if ([r1, r2].some(isNaN) || r1 === 0) { showToast('Invalid input'); return; }
    let gain, formula;
    if (mode === 'ni') {
        gain = 1 + r2 / r1;
        formula = 'Av = 1 + R2/R1 = ' + gain.toFixed(4);
    } else {
        gain = -(r2 / r1);
        formula = 'Av = -R2/R1 = ' + gain.toFixed(4);
    }
    let s = formula;
    const absg = Math.abs(gain);
    if (absg > 0) s += '\n|Av| = ' + absg.toFixed(4);
    if (absg > 0.001) s += '\n' + (20 * Math.log10(absg)).toFixed(2) + ' dB';
    if (vinStr !== '') {
        const vout = parseFloat(vinStr) * gain;
        s += '\nVout = ' + vout.toFixed(4) + ' V';
    }
    setScreen(s);
}

function initOA() {
    const vinStr = document.getElementById('oaVin');
    const R1 = document.getElementById('oaR1');
    const R2 = document.getElementById('oaR2');
    if (!vinStr || !R1 || !R2) return;
    [vinStr, R1, R2].forEach(input => { input.addEventListener('input', calcOA) })

}


/* ============================================================
   9. POWER CALCULATOR
   ============================================================ */
function powerHTML() {
    return `
                <div class="input-row">
                    <div class="input-group full"><label>Formula</label>
                        <select id="pwMode" onchange="pwSwapInputs()">
                            <option value="vi">P = V \u00D7 I</option>
                            <option value="ir">P = I\u00B2 \u00D7 R</option>
                            <option value="vr">P = V\u00B2 / R</option>
                        </select></div>
                </div>
                <div class="input-row" id="pwInputs">
                    <div class="input-group"><label>Voltage (V)</label>
                        <input type="number" id="pwV" placeholder="0"></div>
                    <div class="input-group"><label>Current (A)</label>
                        <input type="number" id="pwI" placeholder="0"></div>
                </div>
                <button class="calc-btn" onclick="calcPow()">Calculate</button>`;
}

function pwSwapInputs() {
    const m = document.getElementById('pwMode').value;
    const c = document.getElementById('pwInputs');
    const map = {
        vi: `<div class="input-group"><label>Voltage (V)</label><input type="number" id="pwV" placeholder="0"></div>
                     <div class="input-group"><label>Current (A)</label><input type="number" id="pwI" placeholder="0"></div>`,
        ir: `<div class="input-group"><label>Current (A)</label><input type="number" id="pwI" placeholder="0"></div>
                     <div class="input-group"><label>Resistance (\u03A9)</label><input type="number" id="pwR" placeholder="0"></div>`,
        vr: `<div class="input-group"><label>Voltage (V)</label><input type="number" id="pwV" placeholder="0"></div>
                     <div class="input-group"><label>Resistance (\u03A9)</label><input type="number" id="pwR" placeholder="0"></div>`
    };
    c.innerHTML = map[m];
}

function calcPow() {
    const m = document.getElementById('pwMode').value;
    let p;
    if (m === 'vi') {
        const v = parseFloat(document.getElementById('pwV').value);
        const i = parseFloat(document.getElementById('pwI').value);
        if ([v, i].some(isNaN)) { showToast('Invalid input'); return; }
        p = v * i;
    } else if (m === 'ir') {
        const i = parseFloat(document.getElementById('pwI').value);
        const r = parseFloat(document.getElementById('pwR').value);
        if ([i, r].some(isNaN)) { showToast('Invalid input'); return; }
        p = i * i * r;
    } else {
        const v = parseFloat(document.getElementById('pwV').value);
        const r = parseFloat(document.getElementById('pwR').value);
        if ([v, r].some(isNaN) || r === 0) { showToast('Invalid input'); return; }
        p = (v * v) / r;
    }
    setScreen('P = ' + fmtEng(p) + ' W\n  = ' + fmtEng(p * 1000) + ' mW');
}

function pidHTML() {
    return `
        <div class="input-row">
            <div class="input-group"><label>Ultimate Gain (Ku)</label>
                <input type="number" id="pidKu" placeholder="Critical gain"></div>
            <div class="input-group"><label>Ultimate Period (Pu)</label>
                <input type="number" id="pidPu" placeholder="Oscillation period"></div>
        </div>
        <div class="input-row">
            <div class="input-group full">
                <label>Control Type</label>
                <select id="pidType" class="tool-select">
                    <option value="pid">Classic PID</option>
                    <option value="pi">PI Control</option>
                    <option value="p">P Control</option>
                    <option value="pessen">Pessen Integration</option>
                </select>
            </div>
        </div>
        <div class="input-hint">Based on Closed-Loop Ziegler-Nichols Method</div>`;
}

function initPID() {
    const ku = document.getElementById('pidKu');
    const pu = document.getElementById('pidPu');
    const type = document.getElementById('pidType');

    if (!ku || !pu || !type) return;

    [ku, pu].forEach(el => el.addEventListener('input', calcPID));
    type.addEventListener('change', calcPID);
}

function calcPID() {
    const Ku = parseFloat(document.getElementById('pidKu').value);
    const Pu = parseFloat(document.getElementById('pidPu').value);
    const type = document.getElementById('pidType').value;

    if (isNaN(Ku) || isNaN(Pu) || Ku <= 0 || Pu <= 0) {
        setScreen('ENTER Ku & Pu', true);
        return;
    }

    let Kp, Ki, Kd;
    let res = "";

    switch (type) {
        case 'p':
            Kp = 0.5 * Ku;
            res = `Kp: ${Kp.toFixed(3)}`;
            break;
        case 'pi':
            Kp = 0.45 * Ku;
            Ki = (1.2 * Kp) / Pu;
            res = `Kp: ${Kp.toFixed(2)} | Ki: ${Ki.toFixed(2)}`;
            break;
        case 'pessen': // Pessen Integration Rule
            Kp = 0.7 * Ku;
            Ki = (2.5 * Kp) / Pu;
            Kd = (Kp * Pu) / 6.6;
            res = `Kp:${Kp.toFixed(2)} Ki:${Ki.toFixed(2)} Kd:${Kd.toFixed(2)}`;
            break;
        case 'pid':
        default:
            Kp = 0.6 * Ku;
            Ki = (2 * Kp) / Pu;
            Kd = (Kp * Pu) / 8;
            res = `Kp:${Kp.toFixed(2)} Ki:${Ki.toFixed(2)} Kd:${Kd.toFixed(2)}`;
            break;
    }

    setScreen(res);
}

/* ============================================================
   UTILITAS FORMAT
   ============================================================ */
function fmtEng(v) {
    if (isNaN(v) || !isFinite(v)) return 'NaN';
    const a = Math.abs(v), s = v < 0 ? '-' : '';
    if (a === 0) return '0';
    if (a >= 1e12) return s + (v / 1e12).toFixed(2) + ' T';
    if (a >= 1e9) return s + (v / 1e9).toFixed(2) + ' G';
    if (a >= 1e6) return s + (v / 1e6).toFixed(2) + ' M';
    if (a >= 1e3) return s + (v / 1e3).toFixed(2) + ' k';
    if (a >= 1) return s + v.toFixed(2);
    if (a >= 1e-3) return s + (v * 1e3).toFixed(2) + ' m';
    if (a >= 1e-6) return s + (v * 1e6).toFixed(2) + ' \u03BC';
    if (a >= 1e-9) return s + (v * 1e9).toFixed(2) + ' n';
    if (a >= 1e-12) return s + (v * 1e12).toFixed(2) + ' p';
    return v.toExponential(2);
}

function fmtTime(sec) {
    if (isNaN(sec)) return 'NaN';
    if (sec >= 1) return sec.toFixed(3) + ' s';
    if (sec >= 1e-3) return (sec * 1e3).toFixed(2) + ' ms';
    if (sec >= 1e-6) return (sec * 1e6).toFixed(2) + ' \u03BCs';
    return (sec * 1e9).toFixed(2) + ' ns';
}

function fmtFreq(hz) {
    if (isNaN(hz)) return 'NaN';
    if (hz >= 1e6) return (hz / 1e6).toFixed(2) + ' MHz';
    if (hz >= 1e3) return (hz / 1e3).toFixed(2) + ' kHz';
    return hz.toFixed(2) + ' Hz';
}

/* Nilai E24 terdekat */
function nearE24(r) {
    const e24 = [1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1];
    const mag = Math.pow(10, Math.floor(Math.log10(Math.max(r, 1e-12))));
    const norm = r / mag;
    let best = e24[0], diff = Math.abs(norm - e24[0]);
    for (const v of e24) { const d = Math.abs(norm - v); if (d < diff) { diff = d; best = v; } }
    return best * mag;
}

/* ============================================================
   INIT
   ============================================================ */

function scribUnlockHTML() {
    return `
    <div class="input-link" style="display:flex; flex-direction:column; justify-content:center;gap:10px">
        <div class="input-group full" id="link-input">
            <div class="input-group">
                <label>Scribd Link</label>
                <input type="link" id="link" placeholder="insert your scribd link here...">
            </div>
        </div>

        <button class="calc-btn" id="unlockBtn" onclick="unlock()">Unlock</button>
    </div>`;
}

let unlockedURLValue = "";

function unlock() {
    const linkInput = document.getElementById('link');
    const unlockBtn = document.getElementById('unlockBtn');

    const scribdRegex = /\/(doc|document|presentation)\/(\d+)/;
    const link = linkInput.value.trim();
    const match = link.match(scribdRegex);

    if (match && match[2]) {
        const documentId = match[2];

        unlockedURLValue = `https://www.scribd.com/embeds/${documentId}/content?start_page=1&view_mode=scroll&access_key=key-fFexxf7r1bzEfWu3HKwf`;

        setScreen("Document found!");

        unlockBtn.disabled = true;
        unlockBtn.innerHTML = "Loading...";

        setTimeout(() => {
            unlockBtn.disabled = false;
            unlockBtn.innerHTML = "Visit";

            unlockBtn.onclick = visitUnlockedURL;
        }, 1000);

    } else {
        setScreen("Document not found!");

        unlockedURLValue = "";
        unlockBtn.disabled = false;
        unlockBtn.innerHTML = "Unlock";
        unlockBtn.onclick = unlock;
    }
}

function visitUnlockedURL() {
    const linkInput = document.getElementById('link');
    const unlockBtn = document.getElementById('unlockBtn');

    if (!unlockedURLValue) {
        setScreen("No unlocked URL found!");
        return;
    }

    const urlToVisit = unlockedURLValue;

    linkInput.value = "";
    unlockedURLValue = "";

    unlockBtn.innerHTML = "Unlock";
    unlockBtn.onclick = unlock;

    window.open(urlToVisit, "_blank");
}

function freq() {
    return `
        <div class="input-group">
            <label>Frequency</label>
            <div class="input-row">
                <input type="number" id="freq-val" value="1000" step="any">
                <select id="freq-unit" onchange="calcFreq()">
                    <option value="1">Hz</option>
                    <option value="1000" selected>kHz</option>
                    <option value="1000000">MHz</option>
                    <option value="1000000000">GHz</option>
                </select>
            </div>
        </div>
    `;
}

function calcFreq() {
    const val = parseFloat(document.getElementById('freq-val').value);
    const unit = parseFloat(document.getElementById('freq-unit').value);
    let res;
    if (isNaN(val)) { return 'Invalid input'; }

    const hz = val * unit;
    const period = 1 / hz;

    let t, tUnit;
    if (period >= 1) { t = period; tUnit = 's'; }
    else if (period >= 1e-3) { t = period * 1e3; tUnit = 'ms'; }
    else if (period >= 1e-6) { t = period * 1e6; tUnit = 'µs'; }
    else { t = period * 1e9; tUnit = 'ns'; }

    const wavelength = 299792458 / hz;
    let wl, wlUnit;
    if (wavelength >= 1) { wl = wavelength; wlUnit = 'm'; }
    else if (wavelength >= 1e-3) { wl = wavelength * 1e3; wlUnit = 'mm'; }
    else { wl = wavelength * 1e6; wlUnit = 'µm'; }

    res = 'Period: ' + t.toPrecision(4) + ' ' + tUnit + '\nλ: ' + wl.toPrecision(4) + ' ' + wlUnit;
    setScreen(res);
}

function initFreq() {
    calcFreq();
    document.getElementById('freq-val').addEventListener('input', calcFreq);
    document.getElementById('freq-unit').addEventListener('change', calcFreq);
}

renderDashboard();

/* ====================================================================
   GLOBAL STATE
==================================================================== */
let mf = null;
let resultEl = null;
let degBtn = null;
let isInitialized = false;
let isDeg = false;
const toastEl = document.getElementById('toast');

/* ====================================================================
   INIT MATH FIELD (dengan retry)
==================================================================== */
function initMathField() {
    resultEl = document.getElementById('result');
    degBtn = document.getElementById('degBtn');
    mf = document.getElementById('mf');

    if (!mf) return false;

    try {
        mf.smartFence = true;
        mf.addEventListener('input', () => {
            updateResult();
            if (document.activeElement !== mf) mf.focus();
        });
        if (window.innerWidth >= 768) setTimeout(() => mf.focus(), 300);
        renderResult('0', '');
        isInitialized = true;
        return true;
    } catch (e) {
        console.error('MathLive init failed:', e);
        return false;
    }
}

function initWithRetry(attempts) {
    attempts = attempts || 5;
    if (customElements.get('math-field')) {
        if (initMathField()) return;
    } else if (attempts > 0) {
        setTimeout(function () { initWithRetry(attempts - 1); }, 400);
        return;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initWithRetry(); });
} else {
    initWithRetry();
}

/* ====================================================================
   BUTTON HANDLERS
==================================================================== */
function ins(latex) {
    if (!mf || !isInitialized) return;
    mf.insert(latex, { format: 'latex' });
    mf.focus();
}

function backspace() {
    if (!mf) return;
    mf.executeCommand('deleteBackward');
    mf.focus();
    updateResult();
}

function clearAll() {
    if (!mf) return;
    mf.value = '';
    renderResult('0', '');
    mf.focus();
}

function moveCursor(dir) {
    if (!mf) return;
    if (dir === 'left') mf.executeCommand('moveToPreviousChar');
    else if (dir === 'right') mf.executeCommand('moveToNextChar');
    mf.focus();
}

function toggleDeg() {
    isDeg = !isDeg;
    if (degBtn) degBtn.textContent = isDeg ? 'DEG' : 'RAD';
    document.getElementById('modeBadge').textContent = isDeg ? 'DEG' : 'RAD';
    showToast(isDeg ? 'SYS: DEGREE MODE' : 'SYS: RADIAN MODE');
    updateResult();
}

function calculate() {
    if (!isInitialized) return;
    updateResult();
    if (resultEl) {
        resultEl.classList.remove('flash');
        void resultEl.offsetWidth;
        resultEl.classList.add('flash');
    }
}

/* ====================================================================
   TOAST
==================================================================== */
let toastTimer = null;
function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1500);
}

/* ====================================================================
   TAB NAVIGATION
==================================================================== */
document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
        // Deaktivasi semua tab & panel
        document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
        document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('active'); });
        // Aktifkan tab & panel yang dipilih
        tab.classList.add('active');
        var targetId = tab.getAttribute('data-tab');
        var targetPanel = document.getElementById(targetId);
        if (targetPanel) targetPanel.classList.add('active');
    });
});

/* ====================================================================
   KEYBOARD SHORTCUTS
==================================================================== */
document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        calculate();
    }
});

/* ====================================================================
   MATRIX MODALS
==================================================================== */
function openMatrixModal() { document.getElementById('matrixModal').classList.add('show'); }
function openDetMatrixModal() { document.getElementById('detMatrixModal').classList.add('show'); }
function openInvMatrixModal() { document.getElementById('invMatrixModal').classList.add('show'); }
function openTrnMatrixModal() { document.getElementById('trnMatrixModal').classList.add('show'); }

function closeModal(id) {
    document.getElementById(id).classList.remove('show');
}

function buildMatrixLatex(rowsId, colsId, wrapper) {
    var r = Math.min(9, Math.max(1, parseInt(document.getElementById(rowsId).value) || 2));
    var c = Math.min(9, Math.max(1, parseInt(document.getElementById(colsId).value) || 2));
    var s = wrapper;
    for (var i = 0; i < r; i++) {
        for (var j = 0; j < c; j++) {
            s += (i === 0 && j === 0) ? '#@' : '#?';
            if (j < c - 1) s += ' & ';
        }
        if (i < r - 1) s += ' \\\\ ';
    }
    s += '\\end{bmatrix}';
    return s;
}

function insertDynamicMatrix() {
    ins(buildMatrixLatex('matRows', 'matCols', '\\begin{bmatrix}'));
    closeModal('matrixModal');
}

function insertDetMatrix() {
    ins(buildMatrixLatex('detMatRows', 'detMatCols', '\\det\\begin{bmatrix}'));
    closeModal('detMatrixModal');
}

function insertInvMatrix() {
    ins(buildMatrixLatex('invMatRows', 'invMatCols', '\\begin{bmatrix}') + '^{-1}');
    closeModal('invMatrixModal');
}

function insertTrnMatrix() {
    ins(buildMatrixLatex('trnMatRows', 'trnMatCols', '\\begin{bmatrix}') + '^T');
    closeModal('trnMatrixModal');
}

/* ====================================================================
   IMPORT MATH.JS CUSTOM FUNCTIONS
==================================================================== */
math.import({
    sind: function (x) { return Math.sin(x * Math.PI / 180); },
    cosd: function (x) { return Math.cos(x * Math.PI / 180); },
    tand: function (x) { return Math.tan(x * Math.PI / 180); },
    cscd: function (x) { return 1 / Math.sin(x * Math.PI / 180); },
    secd: function (x) { return 1 / Math.cos(x * Math.PI / 180); },
    cotd: function (x) { return 1 / Math.tan(x * Math.PI / 180); },
    asind: function (x) { return Math.asin(x) * 180 / Math.PI; },
    acosd: function (x) { return Math.acos(x) * 180 / Math.PI; },
    atand: function (x) { return Math.atan(x) * 180 / Math.PI; }
}, { override: true });

/* ====================================================================
   ASCII-MATH → MATH.JS / NERDAMER CONVERTER
==================================================================== */
function toEval(raw) {
    var e = raw;

    // Absolut value
    e = e.replace(/\|([^|]+)\|/g, 'abs($1)');

    // LOGARITMA (urutan penting!)
    e = e.replace(/\bln\s*\(/g, '__NL__(');
    e = e.replace(/\blog\s*_?\s*(?:\{([^}]+)\}|\(([^)]+)\)|([a-zA-Z0-9.]+))\s*\(([^)]+)\)/g,
        function (match, b1, b2, b3, arg) {
            return '(log(' + arg + ')/log(' + (b1 || b2 || b3) + '))';
        }
    );
    e = e.replace(/\blog\s*\(/g, 'log10(');
    e = e.replace(/__NL__\s*\(/g, 'log(');

    // Invers trig
    e = e.replace(/\barcsin\s*\(/g, 'asin(');
    e = e.replace(/\barccos\s*\(/g, 'acos(');
    e = e.replace(/\barctan\s*\(/g, 'atan(');

    // Root & combinatorics
    e = e.replace(/root\(([^)]+)\)\s*\(([^)]+)\)/g, 'nthRoot($2,$1)');
    e = e.replace(/\(([^,]+)\s+choose\s+([^)]+)\)/g, 'combinations($1,$2)');
    e = e.replace(/\\mod\(/g, 'mod(');
    e = e.replace(/\boo\b/g, 'Infinity');
    e = e.replace(/vec\(([^)]+)\)/g, '($1)');

    // Permutasi: _nP_r
    e = e.replace(/_\s*(?:\{([^}]+)\}|\(([^)]+)\)|([a-zA-Z0-9.]+))\s*P\s*_\s*(?:\{([^}]+)\}|\(([^)]+)\)|([a-zA-Z0-9.]+))/g,
        function (match, n1, n2, n3, r1, r2, r3) {
            var n = (n1 || n2 || n3).trim();
            var r = (r1 || r2 || r3).trim();
            if (!isNaN(n) && !isNaN(r) && Number(n) < Number(r)) return 'NaN';
            return 'permutations(' + n + ', ' + r + ')';
        }
    );

    // Kombinasi: _nC_r
    e = e.replace(/_\s*(?:\{([^}]+)\}|\(([^)]+)\)|([a-zA-Z0-9.]+))\s*C\s*_\s*(?:\{([^}]+)\}|\(([^)]+)\)|([a-zA-Z0-9.]+))/g,
        function (match, n1, n2, n3, r1, r2, r3) {
            var n = (n1 || n2 || n3).trim();
            var r = (r1 || r2 || r3).trim();
            if (!isNaN(n) && !isNaN(r) && Number(n) < Number(r)) return 'NaN';
            return 'combinations(' + n + ', ' + r + ')';
        }
    );

    // Matriks
    e = e.replace(/\bdet\s*\(?\s*(\[\[.+?\]\])\s*\)?/g, 'det($1)');
    e = e.replace(/(\[\[[^\]]*(?:\],[^\]]*)*\]\])\s*\^\s*\(\s*-\s*1\s*\)/g, 'inv($1)');
    e = e.replace(/(\[\[[^\]]*(?:\],[^\]]*)*\]\])\s*\^\s*T/g, 'transpose($1)');

    // Limit
    e = e.replace(/\\?lim\s*_\s*(?:\{([a-zA-Z]+)\s*(?:\\to|->|rarr)\s*([^}]+)\}|\(([a-zA-Z]+)\s*(?:\\to|->|rarr)\s*([^)]+)\))\s*(.*)/g,
        function (match, v1, a1, v2, a2, func) {
            return 'limit(' + func + ', ' + (v1 || v2) + ', ' + (a1 || a2) + ')';
        }
    );

    // Integral tentu
    e = e.replace(/\\?int\s*_\s*(?:\{([^}]+)\}|\(([^)]+)\)|([^\s^()]+))\s*\^\s*(?:\{([^}]+)\}|\(([^)]+)\)|([^\s^()]+))\s*(.*?)\s*,?\s*[dD]\s*([a-zA-Z])/g,
        function (match, l1, l2, l3, u1, u2, u3, func, v) {
            var lower = l1 || l2 || l3;
            var upper = u1 || u2 || u3;
            return 'defint(' + (func.trim() || '1') + ', ' + lower + ', ' + upper + ', ' + v + ')';
        }
    );

    // Integral tak tentu
    e = e.replace(/\\?int(?!\s*_)\s*(.*?)\s*,?\s*[dD]\s*([a-zA-Z])/g,
        function (match, func, v) {
            return 'integrate(' + (func.trim() || '1') + ', ' + v + ')';
        }
    );

    // Summation
    e = e.replace(/\\?sum\s*_\s*(?:\{([a-zA-Z]+)\s*=\s*([^}]+)\}|\(([a-zA-Z]+)\s*=\s*([^)]+)\))\s*\^\s*(?:\{([^}]+)\}|\(([^)]+)\)|([^\s^()]+))\s*(.*)/g,
        function (match, v1, s1, v2, s2, e1, e2, e3, func) {
            return 'sum(' + (func.trim() || '0') + ', ' + (v1 || v2) + ', ' + (s1 || s2) + ', ' + (e1 || e2 || e3) + ')';
        }
    );

    // Kurawal → kurung biasa
    e = e.replace(/\{/g, '(').replace(/\}/g, ')');
    return e;
}

/* ====================================================================
   RESULT → LATEX CONVERTER
==================================================================== */
function toLatex(res) {
    // Fraction check
    var isFraction = res && (
        res.isFraction === true ||
        (typeof res.isFraction === 'function' && res.isFraction()) ||
        (res.constructor && res.constructor.name === 'Fraction') ||
        (typeof res.n === 'number' && typeof res.d === 'number' && typeof res.s === 'number')
    );

    if (isFraction) {
        var num = res.s * res.n;
        var den = res.d;
        if (den === 1) return num.toString();
        return '\\dfrac{' + num + '}{' + den + '} = ' + parseFloat((num / den).toPrecision(10));
    }

    if (typeof res === 'number') {
        if (Number.isNaN(res)) return '\\text{NaN}';
        if (!isFinite(res)) return res > 0 ? '\\infty' : '-\\infty';
        try {
            var f = math.fraction(res);
            var fn = f.s * f.n;
            var fd = f.d;
            if (fd !== 1 && Math.abs(fd) <= 99999) {
                return '\\dfrac{' + fn + '}{' + fd + '} = ' + parseFloat(res.toPrecision(10));
            }
        } catch (_) { }
        return parseFloat(res.toPrecision(10)).toString();
    }

    if (typeof res === 'object' && res !== null) {
        // Matrix (math.js)
        if (res._data) {
            var rows = res._data;
            var rLatex = rows.map(function (row) {
                return (Array.isArray(row) ? row : [row]).map(function (v) {
                    return typeof v === 'number' ? (Number.isInteger(v) ? v.toString() : parseFloat(v.toPrecision(10)).toString()) : toLatex(v);
                }).join(' & ');
            }).join(' \\\\ ');
            return '\\begin{bmatrix}' + rLatex + '\\end{bmatrix}';
        }

        // Nested array matrix
        if (Array.isArray(res) && Array.isArray(res[0])) {
            var rLatex2 = res.map(function (row) {
                return row.map(function (v) {
                    return typeof v === 'number' ? (Number.isInteger(v) ? v.toString() : parseFloat(v.toPrecision(10)).toString()) : toLatex(v);
                }).join(' & ');
            }).join(' \\\\ ');
            return '\\begin{bmatrix}' + rLatex2 + '\\end{bmatrix}';
        }

        // ResultSet
        if (res.entries && !res._data) {
            return res.entries.map(function (e) { return toLatex(e); }).join(', ');
        }

        // Complex
        if (typeof res.re === 'number' && typeof res.im === 'number') {
            var re = res.re, im = res.im;
            if (re === 0 && im === 1) return 'i';
            if (re === 0 && im === -1) return '-i';
            if (re === 0) return im + 'i';
            if (im === 0) return re.toString();
            return re + (im > 0 ? ' + ' : ' - ') + Math.abs(im) + 'i';
        }

        // Plain object
        var entries = Object.entries(res);
        if (entries.length > 0) {
            return entries.map(function (kv) { return kv[0] + ' = ' + toLatex(kv[1]); }).join(', ');
        }
    }

    if (typeof res === 'string') {
        try {
            return toLatex(math.evaluate(res));
        } catch (_) {
            return res;
        }
    }

    if (typeof res === 'boolean') return res.toString();
    return String(res);
}

/* ====================================================================
   KATEX RENDER
==================================================================== */
function renderResult(latex, cls) {
    if (!resultEl || typeof katex === 'undefined') return;
    resultEl.className = cls || '';
    try {
        if (!latex) { resultEl.innerHTML = ''; return; }
        katex.render(latex, resultEl, {
            throwOnError: false,
            displayMode: false,
            macros: { "\\degree": "^{\\circ}" }
        });
    } catch (e) {
        resultEl.textContent = latex || '';
    }
}

/* ====================================================================
   CORE EVALUATION ENGINE
==================================================================== */
function updateResult() {
    if (!mf || !resultEl || !isInitialized || typeof math === 'undefined') return;

    try {
        var expr = mf.getValue('ascii-math') || '';
        expr = expr.replace(/\u00B0/g, '').replace(/\bdeg\b/g, '').trim();

        // Masih ada placeholder → jangan evaluasi
        if (expr.indexOf('#?') !== -1 || expr.indexOf('#@') !== -1) {
            renderResult('', '');
            return;
        }

        if (!expr) {
            renderResult('0', '');
            return;
        }

        var ev = toEval(expr);

        // Mode derajat
        if (isDeg) {
            ev = ev.replace(/\bsin\s*\(/g, 'sind(')
                .replace(/\bcos\s*\(/g, 'cosd(')
                .replace(/\btan\s*\(/g, 'tand(')
                .replace(/\basin\s*\(/g, 'asind(')
                .replace(/\bacos\s*\(/g, 'acosd(')
                .replace(/\batan\s*\(/g, 'atand(');
        }

        var result;

        // Persamaan → nerdamer solve
        if (ev.indexOf('=') !== -1) {
            var solutions = nerdamer.solveEquations(ev);
            if (Array.isArray(solutions)) {
                result = solutions.map(function (s) { return s.toString(); }).join(', ');
            } else {
                result = solutions.toString();
            }
        } else {
            // Coba math.js dulu
            try {
                result = math.evaluate(ev);
                if (typeof result === 'object' && result.entries) {
                    result = math.format(result, { precision: 10 });
                } else if (typeof result === 'number') {
                    result = Number.isInteger(result) ? result.toString() : math.format(result, { precision: 10 });
                } else {
                    result = String(result);
                }
            } catch (mathErr) {
                // Fallback algebra: nerdamer simplify
                try {
                    result = nerdamer(ev).text();
                } catch (nerdamerErr) {
                    throw new Error('Cannot evaluate');
                }
            }
        }

        var latex = toLatex(result);
        renderResult('= ' + latex, '');

    } catch (error) {
        var currentInput = '';
        try { currentInput = (mf.getValue('ascii-math') || '').trim(); } catch (_) { }
        if (!currentInput || /[+\-*/^(]$/.test(currentInput) || currentInput.length <= 1) {
            renderResult('\\cdots', '');
        } else {
            renderResult('= \\;', '');
        }
    }
}