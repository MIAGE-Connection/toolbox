let QR_CODE;

window.onload = function() {
    create();
};

function create() {

    reset();

    let address = document.getElementById('input-address').value;

    let background = document.getElementById('background-color').value;
    let foreground = document.getElementById('foreground-color').value;

    let w = document.getElementById('width').value;
    let h = document.getElementById('height').value;

    if (address === "")
        return;

    QR_CODE = new QRCode(document.getElementById("qr_code"), {
        text: address,
        width: w,
        height: h,
        colorDark : foreground,
        colorLight : background,
        correctLevel : QRCode.CorrectLevel.H
    });
}

function download() {
    let qr_code_dom = document.getElementById('qr_code')
    let qr_code_img = qr_code_dom.getElementsByTagName('img')[0]

    var a = document.createElement("a");
    a.href = qr_code_img.src; 
    a.target = "_blank"
    a.download = "qr_code.png";
    a.click();
}

function reset() {
    document.getElementById('qr_code').innerHTML = '';
}