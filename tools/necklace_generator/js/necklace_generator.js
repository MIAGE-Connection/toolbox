let cvn;
let template_input;
let data_input;
let template;
let data;
let previewItem;

let global_color_picker;
let global_size_slider;

let input_name_settings;
let input_quota_settings;
let input_role_settings;

let SCALING_FACTOR = 2;

class LineSettings {
    constructor(name, x, y) {
        this.name = name
        this.x_slider = createSlider(0, 1000, x)
        this.x_slider.parent('input-form-' + name + '-x')
        this.y_slider = createSlider(0, 668, y)
        this.y_slider.parent('input-form-' + name + '-y')
        this.size_slider = createSlider(0, 100, 30)
        this.size_slider.parent('input-form-' + name + '-size')
        this.color_picker = createColorPicker('#FFFFFF');
        this.color_picker.parent('input-form-' + name + '-color')
    }

    x() {
        return this.x_slider.value()
    }

    y() {
        return this.y_slider.value()
    }

    size() {
        return this.size_slider.value()
    }

    setSize(nsize) {
        this.size_slider.value(nsize)
    }

    color() {
        return this.color_picker.value()
    }

    setColor(ncolor) {
        this.color_picker.value(ncolor)
    }
}

function setup() {
    createForm()
}

function createCanva() {
    let cvn_node = document.getElementById('canva-container')
    cvn_node.style.display = 'block'
    cvn = createCanvas(1000, 668);
    cvn.parent('canva')
}

function createForm() {
    template_input = createFileInput(handleTemplateFile);
    template_input.parent('input-form-template')

    data_input = createFileInput(handleCSVFile);
    data_input.parent('input-form-csv')
    data_input.attribute('disabled', true)

    input_name_settings = new LineSettings('name', 250, 280)
    input_quota_settings = new LineSettings('quota', 250, 315)
    input_role_settings = new LineSettings('role', 250, 350)

    global_color_picker = createColorPicker('#FFFFFF')
    global_color_picker.parent('input-form-global-color')
    global_color_picker.input(updateLineSettings)

    global_size_slider = createSlider(0, 100, 30)
    global_size_slider.input(updateLineSettings)
    global_size_slider.parent('input-form-global-size')
}

function updateLineSettings() {
    input_name_settings.setColor(global_color_picker.value())
    input_name_settings.setSize(global_size_slider.value())

    input_quota_settings.setColor(global_color_picker.value())
    input_quota_settings.setSize(global_size_slider.value())

    input_role_settings.setColor(global_color_picker.value())
    input_role_settings.setSize(global_size_slider.value())
}

function draw() {
    renderPreview()
}

function renderPreview() {

    if (template) {
        image(template, 0, 0, template.width / SCALING_FACTOR, template.height / SCALING_FACTOR);
    }

    if (previewItem) {
        renderPreviewItem(previewItem)
    }
}

function handleTemplateFile(file) {
    if (file.type === 'image') {
        createCanva()
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
        previewItem = data[0]
        displayData()
        document.getElementById('download_button').removeAttribute('disabled')
    } else {
        template = null;
    }
}

function displayData() {
    let db_node = document.getElementById('database-container')
    db_node.style.display = 'block'
    let database = document.getElementById("database")
    let headers = Object.keys(previewItem)
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let row = document.createElement('tr')
        let cell = document.createElement('td')
        cell.innerText = index
        row.appendChild(cell)
        headers.forEach(h => {
            cell = document.createElement('td')
            cell.innerText = element[h]
            row.appendChild(cell)
        })
        row.appendChild(createActionCell(index))
        database.appendChild(row)
    }
}

function createActionCell(elementIndex) {
    let cell = document.createElement('td')
    cell.appendChild(createDisplayAction(elementIndex))
    cell.appendChild(createDownloadAction(elementIndex))
    cell.appendChild(createRemoveAction(elementIndex))
    return cell
}

function previewDataIndex(elementIndex) {
    previewItem = data[elementIndex]
    renderPreview()
}

function createDisplayAction(elementIndex) {
    let action = document.createElement('a')
    action.style.margin = '3%'
    action.style.cursor = 'pointer'
    action.innerHTML = '<i class="fa-solid fa-eye"></i>'
    action.onclick = function (event) {
        previewDataIndex(elementIndex)
    }
    return action
}

function createDownloadAction(elementIndex) {
    let action = document.createElement('a')
    action.style.margin = '3%'
    action.style.cursor = 'pointer'
    action.innerHTML = '<i class="fa-solid fa-download"></i>'
    action.onclick = function (event) {
        previewDataIndex(elementIndex)
        downloadPreview(data[elementIndex])
    }
    return action
}

function createRemoveAction(elementIndex) {
    let action = document.createElement('a')
    action.style.margin = '3%'
    action.style.cursor = 'pointer'
    action.innerHTML = '<i class="fa-solid fa-trash"></i>'
    action.onclick = function (event) {
        data.splice(elementIndex, 1)
        let database = document.getElementById("database")
        database.innerHTML = ""
        displayData()
    }
    return action
}

function csvToArray(str, delimiter = ",") {
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

function renderPreviewItem() {
    textAlign(CENTER)
    renderLine(previewItem.Nom + ' ' + previewItem.Prenom, input_name_settings)
    renderLine(previewItem.Quota, input_quota_settings)
    renderLine(previewItem.Role, input_role_settings)
}

function renderLine(text_value, line_settings) {
    fill(line_settings.color())
    textSize(line_settings.size())
    text(text_value, line_settings.x(), line_settings.y());
}

function getFirstRowFilename() {
    if (previewItem)
        return previewItem.Quota + '_' + previewItem.Nom + '_' + previewItem.Prenom
    else
        return 'preview'
}

function renderPreviewAndDownload(element) {
    previewItem = element;
    downloadPreview()
}

function downloadPreview() {
    saveCanvas(cvn, getFirstRowFilename(), 'png');
}

function downloadNecklace() {
    let download_button = document.getElementById('download_button')

    download_button.innerHTML = ''
    download_button.onclick = ''
    download_button.setAttribute('aria-busy', true)

    noLoop()
    frameRate(1)
    data.forEach(e => {
        previewItem = e
        redraw()
        downloadPreview()
    })
    frameRate(30)
    loop()

    setTimeout(() => {
        download_button.removeAttribute('aria-busy')
        download_button.innerHTML = '<i class="fa-solid fa-check"></i> &nbsp; GÉNÉRÉS !'
    }, 5000)

    setTimeout(() => {
        download_button.onclick = downloadNecklace
        download_button.innerHTML = '<i class="fa-solid fa-gears"></i> &nbsp; GÉNÉRER'
    }, 5000)

}