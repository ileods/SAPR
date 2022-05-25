//получение кнопок
const addKernelBtn = document.querySelector('#add-kernel');
const addQBtn = document.querySelector('#add-Q');
const addFBtn = document.querySelector('#add-F');
const saveBtn = document.querySelector('#save');
const downloadBtn = document.querySelector('#download');
const calculateBtn = document.querySelector('#calculate');
const drawBtn = document.querySelector('#draw-kernels');


const leftCheck = document.querySelector('#left');
const rightCheck = document.querySelector('#right');

const canvasK = document.querySelector('#kernels-canvas');
//canvas'ы для эпюр
const canvasN = document.querySelector('#N-canvas');
const canvasU = document.querySelector('#U-canvas');
const canvasS = document.querySelector('#S-canvas');

//для шаблонов
let kernelList = document.querySelector('.kernel-list');
let QList = document.querySelector('.Q-list');
let FList = document.querySelector('.F-list');

let triger = 0;
let ready = 0;
let Kernels = [];
let Fpowers = [];

document.addEventListener('keyup', e => {
    if (e.target.keyCode ===13) {
        e.preventDefault();
    }
});

class Kernel {
    _N; 
    _A;
    _L;
    _sig;
    _Q = 0;
    _E;
    constructor(Elem) {
        addKernelBtn.disabled=false
        this.Elem = Elem;
        this.N = Elem.querySelector('.kernel-number').value;
        this.L = Elem.querySelector('.length').value;
        this.A = Elem.querySelector('.square').value;
        this.sig = Elem.querySelector('.sigma').value;
        this.E = Elem.querySelector('.e').value;
        //this.Q = 0;
    }

    get N(){return this._N;}
    set N(value){
        if (value <= 0){
            this.Elem.querySelector('.kernel-number').value = '';
            triger = 1;
            alert("Некорректный номер стержня");
            return;
        }

        for (let i=0; i<Kernels.length; i++){
            if (Kernels[i].N === value) {
                this.Elem.querySelector('.kernel-number').value = '';
                triger = 1;
                alert("Cтержень с таким номером уже существует");
                return;
            }
        }
        this._N = Number(value);

    }
    get L(){return this._L;}
    set L(value){
        if (value <= 0){
            alert("Некорректное значение длины");
            this.Elem.querySelector('.length').value = '';
            triger = 1;
        }
        this._L = Number(value);
    }
    get A(){return this._A;}
    set A(value){
        if (value <= 0){
            alert("Некорректное значение площади");
            this.Elem.querySelector('.square').value = '';
            triger = 1;
        }
        this._A = Number(value);
    }
    get sig(){return this._sig;}
    set sig(value){
        if (value <= 0){
            alert("Некорректное значение допускаемого напряжения");
            this.Elem.querySelector('.sigma').value = '';
            triger = 1;
        }
        this._sig = Number(value);
    }
    get E(){return this._E;}
    set E(value){
        if (value <= 0){
            alert("Некорректное значение модуля упругости");
            this.Elem.querySelector('.e').value = '';
            triger = 1;
        }
        this._E = Number(value);
    }
    get Q(){return this._Q;}
    set Q(value){
        this._Q = Number(value);
    }
}

function readyForJob() {
    if (document.querySelector('.kernel-list').lastElementChild != null){
        num = document.querySelector('.kernel-list').lastElementChild.querySelector('.kernel-number').value;
        arr = []
        for (let i = 0; i < Kernels.length; i++)
        {
            arr.push(Kernels[i].N)
        }
        if (arr.indexOf(Number(num)) == -1){
            Kernels.push(new Kernel(document.querySelector('.kernel-list').lastElementChild));
        }
    }
    elem = document.querySelector('.Q-list').lastElementChild
    if (elem != null){
        Kernels[elem.querySelector('.q-number').value - 1].Q = elem.querySelector('.q-val').value;
    }
    elem = document.querySelector('.F-list').lastElementChild 
    if (elem != null){
        F[elem.querySelector('.f-number').value - 1] = elem.querySelector('.f-val').value;
    }
    for (let i = 0; i < F.length; i++){
        if (F[i] == null){
            F[i] = 0;
        }
    }
    // for (i = F.length -1; i < Kernels.length; i++){F[i] = 0;}

    KernelsSorted = Kernels.slice(0, Kernels.length);
    for ( i = 0; i < Kernels.length; i++){
        KernelsSorted[Kernels[i].N-1] = Kernels[i]
    }
    Kernels = KernelsSorted;
}

drawBtn.addEventListener('click', e => {
    e.preventDefault();
    if (ready == 0){readyForJob()}
    ready = 1;
    context = canvasK.getContext('2d');
    context.clearRect(0, 0, canvasK.width, canvasK.height);
    context.strokeStyle = 'black'; 
    context.beginPath();
    context.moveTo(20, canvasK.height/2);
    context.lineTo(canvasK.width-20, canvasK.height/2);
    context.stroke();

    qx=20
    for (let i = 0; i<Kernels.length; i++) {
        context.fillStyle = 'red';
        context.font = "20pt Arial";
        context.strokeStyle = 'black'; 
        context.strokeRect(qx, canvasK.height/2-Kernels[i].A*40/2, Kernels[i].L*40, Kernels[i].A*40);
        context.fillText(`${Kernels[i].N}`, qx+Kernels[i].L/2*40, 330);
        if (F[i] > 0) {
            context.strokeStyle = 'blue'; 
            console.log(F[i])
                context.beginPath();
                context.moveTo(qx+15, canvasK.height/2);
                context.lineTo(qx+5, canvasK.height/2-10);
                context.stroke();
                context.beginPath();
                context.moveTo(qx+15, canvasK.height/2);
                context.lineTo(qx+5, canvasK.height/2+10);
                context.stroke();
        }
        if (F[i] < 0) {
            
                context.strokeStyle = 'blue'; 
                context.beginPath();
                context.moveTo(qx-15, canvasK.height/2);
                context.lineTo(qx-5, canvasK.height/2-10);
                context.stroke();
                context.beginPath();
                context.moveTo(qx-15, canvasK.height/2);
                context.lineTo(qx-5, canvasK.height/2+10);
                context.stroke();
        }
        if (Kernels[i].Q > 0){
            for (let j = qx+10; j<=qx+Kernels[i].L*40; j=j+10){
                context.strokeStyle = 'black'; 
                context.beginPath();
                context.moveTo(j, canvasK.height/2);
                context.lineTo(j-5, canvasK.height/2-10);
                context.stroke();
                context.beginPath();
                context.moveTo(j, canvasK.height/2);
                context.lineTo(j-5, canvasK.height/2+10);
                context.stroke();
            }
        } else if (Kernels[i].Q < 0) {
            for (let j = qx; j<=qx+Kernels[i].L*40-10; j=j+10){
                context.strokeStyle = 'black'; 
                context.beginPath();
                context.moveTo(j, canvasK.height/2);
                context.lineTo(j+5, canvasK.height/2-10);
                context.stroke();
                context.beginPath();
                context.moveTo(j, canvasK.height/2);
                context.lineTo(j+5, canvasK.height/2+10);
                context.stroke();
            }
        }
        qx+=Kernels[i].L*40;
    }
    if (F[F.length - 1] > 0 && F.length===Kernels.length+1) {
        context.strokeStyle = 'blue'; 
            context.beginPath();
            context.moveTo(qx, canvasK.height/2);
            context.lineTo(qx-15, canvasK.height/2-10);
            context.stroke();
            context.beginPath();
            context.moveTo(qx, canvasK.height/2);
            context.lineTo(qx-15, canvasK.height/2+10);
            context.stroke();
    }
    if (F[F.length - 1] < 0 && F.length===Kernels.length+1) {
            context.strokeStyle = 'blue'; 
            context.beginPath();
            context.moveTo(qx, canvasK.height/2);
            context.lineTo(qx+15, canvasK.height/2-10);
            context.stroke();
            context.beginPath();
            context.moveTo(qx, canvasK.height/2);
            context.lineTo(qx+15, canvasK.height/2+10);
            context.stroke();
    }

    if (leftCheck.checked) {
        context.strokeStyle = 'black'; 
        context.beginPath();
        context.moveTo(20, 20);
        context.lineTo(20, canvasK.height-20);
        context.stroke();
        for (let i = 20; i<canvasK.height-20; i=i+10){
            context.beginPath();
            context.moveTo(20, i);
            context.lineTo(0, i+10);
            context.stroke();
        }
    }
    if (rightCheck.checked) {
        context.strokeStyle = 'black'; 
        context.beginPath();
        context.moveTo(qx, 20);
        context.lineTo(qx, canvasK.height-20);
        context.stroke();
        for (let i = 20; i<canvasK.height-20; i=i+10){
            context.beginPath();
            context.moveTo(qx, i);
            context.lineTo(qx+20, i+10);
            context.stroke();
        }
    }
});


saveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    readyForJob();
    ready = 1
    let filename = document.querySelector('#filename').value;
    localStorage.setItem(`${filename}_kernels`, JSON.stringify(Kernels));
    localStorage.setItem(`${filename}_F`, JSON.stringify(F));
    if (leftCheck.checked && rightCheck.checked) {
        localStorage.setItem(`${filename}_support`, 'left,right');
    } else if (leftCheck.checked && !rightCheck.checked) {
        localStorage.setItem(`${filename}_support`, 'left');
    } else if (!leftCheck.checked && rightCheck.checked) {
        localStorage.setItem(`${filename}_support`, 'right');
    }
});

downloadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    ready = 1;
    let filename = document.querySelector('#download-filename').value;
    if (localStorage.getItem(`${filename}_support`)==='left,right') {
        leftCheck.checked=true;
        rightCheck.checked=true;
    } else if (localStorage.getItem(`${filename}_support`)==='right') {
        leftCheck.checked=false;
        rightCheck.checked=true;
    } else if (localStorage.getItem(`${filename}_support`)==='left') {
        leftCheck.checked=true;
        rightCheck.checked=false;
    }
    Kernels = JSON.parse(localStorage.getItem(`${filename}_kernels`));
    Kernels.forEach(e => {
        e.N = Number(e._N)
        e.A = Number(e._A)
        e.L = Number(e._L)
        e.sig = Number(e._sig)
        e.E = Number(e._E)
        e.Q = Number(e._Q)
        e._N = Number(e._N)
        e._A = Number(e._A)
        e._L = Number(e._L)
        e._sig = Number(e._sig)
        e._E = Number(e._E)
        e._Q = Number(e._Q)
    })
    F = JSON.parse(localStorage.getItem(`${filename}_F`));

    
    document.querySelectorAll('.kernel').forEach( elem => elem.remove())
    document.querySelectorAll('.q').forEach( elem => elem.remove())
    document.querySelectorAll('.f').forEach( elem => elem.remove())
    for (let i = 0; i<Kernels.length; i++) {
        kernelList.insertAdjacentHTML('beforeend',
            `<div class="row justify-content-start kernel">
            <div class="col-2">
                <input type="number" class="kernel-number" value = ${Kernels[i].N}>
            </div>
            <div class="col-2">
                <input type="number" class="length check-error" value = ${Kernels[i].L}>
            </div>
            <div class="col-2">
                <input type="number" class="square check-error" value = ${Kernels[i].A}>
            </div>
            <div class="col-2">
                <input type="number" class="sigma check-error" value = ${Kernels[i].sig}>
            </div>
            <div class="col-2">
                <input type="number" class="e check-error" value = ${Kernels[i].E}>
            </div>
            ${i>0 ? `<div class="col-1">
            <button id="delete-kernel">-</button>
            </div>` : ''}
            </div>`);
    }
    for (let i = 0; i<Kernels.length; i++) {
        if (Kernels[i] != 0){
            QList.insertAdjacentHTML('beforeend',
            `<div class="row justify-content-start q">
            <div class="col-2">
                <input type="number" class="q-number" value = ${Kernels[i].N}>
            </div>
            <div class="col-2">
                <input type="number" class="q-val" value = ${Kernels[i].Q}>
            </div>
            <div class="col-1">
                <button id="delete-q">-</button>
            </div>
            </div>`);
            }
        }
        for (let i = 0; i<F.length; i++) {
            if (F[i] != 0){
                FList.insertAdjacentHTML('beforeend',
                `<div class="row justify-content-start f">
                <div class="col-2">
                    <input type="number" class="f-number" value = ${i+1}>
                </div>
                <div class="col-2">
                    <input type="number" class="f-val" value = ${F[i]}>
                </div>
                <div class="col-1">
                    <button id="delete-f">-</button>
                </div>
                </div>`);
            }
        }
        
});



addKernelBtn.addEventListener('click', (e) => {
    e.preventDefault()
    ready = 0
    Kernels.push(new Kernel(document.querySelector('.kernel-list').lastElementChild));
    if ( triger == 1 ){ 
        triger = 0;
        return; }
    triger = 0;
    kernelList.insertAdjacentHTML('beforeend',
    `<div class="row justify-content-start kernel">
    <div class="col-2">
        <input type="number" class="kernel-number">
    </div>
    <div class="col-2">
        <input type="number" class="length check-error">
    </div>
    <div class="col-2">
        <input type="number" class="square check-error">
    </div>
    <div class="col-2">
        <input type="number" class="sigma check-error" >
    </div>
    <div class="col-2">
        <input type="number" class="e check-error" >
    </div>
    <div class="col-1">
        <button id="delete-kernel">-</button>
    </div>
    </div>`);
});

qtriger = 0;

addQBtn.addEventListener('click', (e) => {
    e.preventDefault();
    ready = 0
    elem = document.querySelector('.Q-list').lastElementChild
    if (qtriger != 0){
        Kernels[elem.querySelector('.q-number').value - 1].Q = elem.querySelector('.q-val').value;
    }
    if ( !qtriger ){ qtriger = 1; }
    QList.insertAdjacentHTML('beforeend',
    `<div class="row justify-content-start q">
    <div class="col-2">
        <input type="number" class="q-number">
    </div>
    <div class="col-2">
        <input type="number" class="q-val">
    </div>
    <div class="col-1">
        <button id="delete-q">-</button>
    </div>
    </div>`);
});

ftriger = 0;
F = [];

addFBtn.addEventListener('click', (e) => {
    e.preventDefault();
    ready = 0
    elem = document.querySelector('.F-list').lastElementChild
    if (ftriger != 0){
        F[elem.querySelector('.f-number').value - 1] = elem.querySelector('.f-val').value;
    }
    if ( !ftriger ){ ftriger = 1; }
    FList.insertAdjacentHTML('beforeend',
    `<div class="row justify-content-start f">
    <div class="col-2">
        <input type="number" class="f-number">
    </div>
    <div class="col-2">
        <input type="number" class="f-val">
    </div>
    <div class="col-1">
        <button id="delete-f">-</button>
    </div>
    </div>`);
    
});


document.addEventListener('click', (e) => {
    if (e.target.id === 'delete-kernel') {
        e.preventDefault();
        n =e.target.closest('.kernel').querySelector('.kernel-number').value;
        e.target.closest('.kernel').remove()
        for (let i = 0; i < Kernels.length; i++){
            if (Kernels[i].N === n){
                Kernels.splice(i, 1);
            }
        }
    }

    if (e.target.id === 'delete-q') {
        e.preventDefault();
        n = Number(e.target.closest('.q').querySelector('.q-number').value);
        for (let i = 0; i < Kernels.length; i++){
            if (Kernels[i].N === n){
                Kernels[i].Q = 0;
                Kernels[i]._Q = 0;
            }
        }
        e.target.closest('.q').remove()
    }

    if (e.target.id === 'delete-f') {
        e.preventDefault();
        n =e.target.closest('.f').querySelector('.f-number').value;
        e.target.closest('.f').remove()
        F[n-1] = 0;
    }
});



function drawGraphics(canvas, arr){
    ctx = canvas.getContext('2d') 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black'; 
    ctx.beginPath();
    ctx.moveTo(0, canvas.height/2);
    ctx.lineTo(canvas.width, canvas.height/2);
    ctx.stroke();
    
    ctx.fillStyle = 'black';
    // ctx.fillText(``, e.clientX, canvas.height/2 - arrC[e.clientX]-10);
    for (let i = 0; i<arr.length; i++){
        
        ctx.fillRect(i,canvas.height/2-arr[i],3,3);

        if (i%10===0) {
            ctx.beginPath();
            ctx.moveTo(i, canvas.height/2);
            ctx.lineTo(i, canvas.height/2-arr[i]);
            ctx.strokeStyle = 'black'; 
            ctx.stroke();
        }
    }
}

//drawGraphics(canvasN, arr);

function drawLines(canvas, arr, arrC, e) {
    e.preventDefault();
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGraphics(canvas, arrC);

    ctx.fillStyle = 'red';
    ctx.font = "10pt Arial";
    if (arrC[e.clientX] <0) {
        y  = canvas.height/2 - arrC[e.clientX]+20;
    } else {
        y = canvas.height/2 - arrC[e.clientX]-10;
    }
    if ( y < 20) { y = 20; }
    if ( y > 340) { y = 340 }
    x = e.clientX
    if (x > 940) { x = 940}
    ctx.fillText(`${arr[e.clientX].toFixed(4)}`, x, y  )

    ctx.strokeStyle = 'red'; 
    ctx.beginPath();
    ctx.moveTo(e.clientX, canvas.height);
    ctx.lineTo(e.clientX, 0);
    ctx.stroke();
    ctx.strokeStyle = 'black'; 
    

}

canvasN.addEventListener('click', (e) => {
    drawLines(canvasN, Narr,NarrCompressed, e)
    drawLines(canvasU, Uarr,UarrCompressed, e)
    drawLines(canvasS, sigarr,sigarrCompressed, e)
});

canvasU.addEventListener('click', (e) => {
    drawLines(canvasN, Narr,NarrCompressed, e)
    drawLines(canvasU, Uarr,UarrCompressed, e)
    drawLines(canvasS, sigarr,sigarrCompressed, e)
});

canvasS.addEventListener('click', (e) => {
    drawLines(canvasN, Narr,NarrCompressed, e)
    drawLines(canvasU, Uarr,UarrCompressed, e)
    drawLines(canvasS, sigarr,sigarrCompressed, e)
});

calculateBtn.addEventListener('click',(e) =>{
    e.preventDefault()
    if (ready == 0){readyForJob()}
    ready = 1
    A = []
    for ( i = 0; i <= Kernels.length; i++) {
        A[i] = []
        for (let j = 0; j <= Kernels.length; j++) {
            A[i][j] = 0;
        }
    }
    for (i = 0; i < Kernels.length; i++) {
        el = (Kernels[i].E * Kernels[i].A) / Kernels[i].L;
        A[i][i] += el;
        A[i + 1][i + 1] += el;
        A[i + 1][i] -= el;
        A[i][i + 1] -= el;
    }
    if (leftCheck.checked) {
        A[0][0] = 1;
        A[0][1] = 0;
        A[1][0] = 0;
    }
    if (rightCheck.checked) {
        A[Kernels.length][Kernels.length] = 1;
        A[Kernels.length][Kernels.length - 1] = 0;
        A[Kernels.length - 1][Kernels.length] = 0;
    }

    b = [];
    for ( i = 0; i <= Kernels.length; i++) { 
        if (F.length != 0){
            b[i] = Number(F[i]); 
        } else {
            b[i] = 0
        }
        
    }
    for (i = 0; i < Kernels.length; i++) {
        if (Kernels[i].Q != 0) {
            b[i] += Kernels[i].Q * Kernels[i].L / 2;
            b[i + 1] += Kernels[i].Q * Kernels[i].L / 2;
        }
    }
    


    if (leftCheck.checked) { b[0] = 0; }
    if (rightCheck.checked) { b[Kernels.length] = 0; }
    function InverseMatrix(A)   // A - двумерный квадратный массив
    {   
        let det = Determinant(A);                // Функцию Determinant см. выше
        if (det == 0) return false;
        let N = A.length;
        A = AdjugateMatrix(A); // Функцию AdjugateMatrix см. выше
        for (let i = 0; i < N; i++)
        { for (let j = 0; j < N; j++) A[ i ][j] /= det; }
        return A;
    }
    function Determinant(A)   // Используется алгоритм Барейса, сложность O(n^3)
    {
        let N = A.length, B = [], denom = 1, exchanges = 0;
        for (let i = 0; i < N; ++i)
        { B[ i ] = [];
        for (let j = 0; j < N; ++j) B[ i ][j] = A[ i ][j];
        }
        for (let i = 0; i < N-1; ++i)
        { let maxN = i, maxValue = Math.abs(B[ i ][ i ]);
        for (let j = i+1; j < N; ++j)
            { let value = Math.abs(B[j][ i ]);
            if (value > maxValue){ maxN = j; maxValue = value; }
            }
        if (maxN > i)
            { let temp = B[ i ]; B[ i ] = B[maxN]; B[maxN] = temp;
            ++exchanges;
            }
        else { if (maxValue == 0) return maxValue; }
        let value1 = B[ i ][ i ];
        for (let j = i+1; j < N; ++j)
            { let value2 = B[j][ i ];
            B[j][ i ] = 0;
            for (let k = i+1; k < N; ++k) B[j][k] = (B[j][k]*value1-B[ i ][k]*value2)/denom;
            }
        denom = value1;
        }
        if (exchanges%2) return -B[N-1][N-1];
        else return B[N-1][N-1];
    }
    function AdjugateMatrix(A)   // A - двумерный квадратный массив
    {                                        
        let N = A.length, adjA = [];
        for (let i = 0; i < N; i++)
        { adjA[ i ] = [];
        for (let j = 0; j < N; j++)
            { let B = [], sign = ((i+j)%2==0) ? 1 : -1;
            for (let m = 0; m < j; m++)
            { B[m] = [];
                for (let n = 0; n < i; n++)   B[m][n] = A[m][n];
                for (let n = i+1; n < N; n++) B[m][n-1] = A[m][n];
            }
            for (let m = j+1; m < N; m++)
            { B[m-1] = [];
                for (let n = 0; n < i; n++)   B[m-1][n] = A[m][n];
                for (let n = i+1; n < N; n++) B[m-1][n-1] = A[m][n];
            }
            adjA[ i ][j] = sign*Determinant(B);   // Функцию Determinant см. выше
            }
        }
        return adjA;
    }
    function MultiplyMatrix(A,B, delta)
    {
        for (let i = 0; i < B.length; i++)
        {
            for (let j = 0;j < B.length; j++)
            {
                delta[i] += A[i][j] * B[j];
            }
        }
    }
    delta = b.slice(0,b.length);
    
    for (let i = 0; i<delta.length; i++) {
        delta[i] = 0;
    }
    
    MultiplyMatrix(InverseMatrix(A),b, delta)

    function N( x, i ) {
        return (Kernels[i].E * Kernels[i].A * (delta[i + 1] - delta[i]) / Kernels[i].L + (Kernels[i].Q * Kernels[i].L) / 2 * (1 - 2 * x / Kernels[i].L));
    }
    function U( x, i ) {
        return (delta[i] + (x / Kernels[i].L) * (delta[i + 1] - delta[i]) + (Kernels[i].Q * Kernels[i].L * Kernels[i].L * x * (1 - x / Kernels[i].L)) / (2 * Kernels[i].E * Kernels[i].A * Kernels[i].L));
    }

    totalL = 0
    Kernels.forEach(e => totalL += e.L)
    Narr = []
    sigarr = []
    Uarr = []
    function GetKernelNum(x){
        curx = 0;
        if (x == 0) {return 0}
        for (let i = 0; i < Kernels.length - 1; i++){
            if (x == curx){return i}
            if ((curx < x) &&( curx + Kernels[i].L > x)) {return i}
            curx += Kernels[i].L
        }
        return Kernels.length - 1;
    }
    step = totalL / 1000
    maxN = -9999999
    maxsig = -9999999
    maxU = -9999999
    for ( i = 0; i < 1000; i++ ){
        num = GetKernelNum(step*i)
        L = step*i
        for ( let j = 0; j < num; j++){L -= Kernels[j].L}
        
        x = N(L , num )
        Narr.push(x);
        if ( Math.abs(x) > maxN) { maxN = Math.abs(x) }
        num = GetKernelNum(step*i)
        L = step*i
        for ( let j = 0; j < num; j++){L -= Kernels[j].L}
        
        x = N(L, num)/Kernels[num].A
        sigarr.push(x);

        if ( Math.abs(x) > maxsig) { maxsig = Math.abs(x) }
        num = GetKernelNum(step*i)
        L = step*i
        for ( let j = 0; j < num; j++){L -= Kernels[j].L}
        x = U(L, num)
        Uarr.push(x);
        if ( Math.abs(x) > maxU) { maxU = Math.abs(x) }
    }

    scaleN =  180/ maxN
    scaleSig = 180 / maxsig
    scaleU = 180 / maxU
    NarrCompressed = []
    for (let i = 0; i<Narr.length; i++) {
        NarrCompressed.push(Narr[i]*scaleN) 
    }

    UarrCompressed = []
    for (let i = 0; i<Uarr.length; i++) {
        UarrCompressed.push(Uarr[i]*scaleU) 
    }
    
    sigarrCompressed = []
    for (let i = 0; i< sigarr.length; i++) {
        sigarrCompressed.push(sigarr[i]*scaleSig) 
    }

    drawGraphics(canvasN, NarrCompressed)
    drawGraphics(canvasU, UarrCompressed)
    drawGraphics(canvasS, sigarrCompressed)
})

