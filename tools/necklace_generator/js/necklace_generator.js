let cvn;
let template_input;
let data_input;
let template;
let data;
let first_row;

let SCALING_FACTOR = 2;

function setup() {
    create_form()
}

function create_canve() {
    let cvn_node = document.getElementById('canva')
    cvn_node.style.display = 'block'
    cvn = createCanvas(1000, 668);
    cvn.parent('canva')
}

function create_form() {
    template_input = createFileInput(handleTemplateFile);
    template_input.parent('input-form-template')

    data_input = createFileInput(handleCSVFile);
    data_input.parent('input-form-csv')
    data_input.attribute('disabled', true)
}

function draw() {
    do_render()
}

function do_render() {

    if (template) {
        image(template, 0, 0, template.width / SCALING_FACTOR, template.height / SCALING_FACTOR);
    }

    if (first_row) {
        render_first_row(first_row)
    }
}

function handleTemplateFile(file) {
    if (file.type === 'image') {
        create_canve()
        template = createImg(file.data, '');
        template.hide();
        data_input.removeAttribute('disabled')
    } else {
        template = null;
    }
}

function handleCSVFile(file) {
    if (file.type === 'text' && file.subtype === 'csv') {
        data = csvToArray(file.data);
        first_row = data[0]
        document.getElementById('download_button').removeAttribute('disabled')
    } else {
        template = null;
    }
}

function csvToArray(str, delimiter = ";") {
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
        }, {});
        return el;
    });
    return arr;
}

function render_first_row() {
    init_text_render()
    render_name(first_row.name)
    render_association(first_row.association)
    render_job(first_row.job)
}

function init_text_render() {
    textAlign(CENTER)
    textSize(30)
    fill(255);
}


function render_name(name) {
    text(name, 250, 280);
}

function render_association(association) {
    text(association, 250, 315);
}

function render_job(job) {
    text(job, 250, 350);
}

function download_necklace() {
    let download_button = document.getElementById('download_button')

    download_button.innerHTML = ''
    download_button.onclick = ''
    download_button.setAttribute('aria-busy', true)

    data.forEach(e => {
        filename = e.association + '_' + e.name
        first_row = e;
        do_render()
        saveCanvas(cvn, filename, 'png');
    })

    download_button.removeAttribute('aria-busy')
    download_button.innerHTML = '<i class="fa-solid fa-check"></i> &nbsp; GÉNÉRÉS !'

    setTimeout(() => {
        download_button.onclick = download_necklace
        download_button.innerHTML = '<i class="fa-solid fa-gears"></i> &nbsp; GÉNÉRER'
    }, 5000)

}