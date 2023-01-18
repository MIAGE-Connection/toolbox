let cvn;
let template_input;
let data_input;
let separator_input;
let template;
let data;
let previewItem;

let global_color_picker;
let global_size_slider;
let global_bold_checkbox;
let global_italic_checkbox;

let input_name_settings;
let input_quota_settings;
let input_role_settings;
let input_team_settings;

let SCALING_FACTOR = 2;
let TEMPLATE_WIDTH = 2000;
let TEMPLATE_HEIGHT = 1336;

class LineSettings {
    constructor(name, x, y) {
        this.name = name
        this.x_slider = createSlider(0, 1000, x)
        this.x_slider.input(() => {this.UpdateValueDisplayed(this.x_slider, 'x')})
        this.x_slider.parent('input-form-' + name + '-x')
        this.y_slider = createSlider(0, 668, y)
        this.y_slider.input(() => {this.UpdateValueDisplayed(this.y_slider, 'y')})
        this.y_slider.parent('input-form-' + name + '-y')
        this.size_slider = createSlider(0, 100, 30)
        this.size_slider.input(() => {this.UpdateValueDisplayed(this.size_slider, 'size')})
        this.size_slider.parent('input-form-' + name + '-size')
        this.color_picker = createColorPicker('#FFFFFF');
        this.color_picker.parent('input-form-' + name + '-color')
        this.bold_checkbox = createCheckbox()
        this.bold_checkbox.parent('input-form-' + name + '-bold')
        this.italic_checkbox = createCheckbox()
        this.italic_checkbox.parent('input-form-' + name + '-italic')
    }

    UpdateValueDisplayed(slider, slider_name) {
        let value = document.getElementById('input-form-' + this.name + '-' + slider_name + '-value')
        value.innerText =' [' +  slider.value() + '] '
    }

    x() {
        return this.x_slider.value()
    }

    setX(nX) {
        this.x_slider.value = nX
    }

    y() {
        return this.y_slider.value()
    }

    setY(nY) {
        this.y_slider.value = nY
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

    style() {
        if (this.bold_checkbox.checked())
            if(this.italic_checkbox.checked())
                return BOLDITALIC
            else
                return BOLD
        
        if (this.italic_checkbox.checked())
            return ITALIC
        
        return NORMAL
    }

    setBold(nvalue) {
        this.bold_checkbox.checked(nvalue)
    }

    setItalic(nvalue) {
        this.italic_checkbox.checked(nvalue)
    }    
}

function setup() {
    createForm()
}

function createCanva(width, height) {
    let cvn_node = document.getElementById('canva-container')
    cvn_node.style.display = 'block'
    cvn = createCanvas(width/SCALING_FACTOR, height/SCALING_FACTOR);
    cvn.parent('canva')
}

function createForm() {
    template_input = createFileInput(handleTemplateFile);
    template_input.parent('input-form-template')

    data_input = createFileInput(handleCSVFile);
    data_input.parent('input-form-csv')
    data_input.attribute('disabled', true)

    separator_input = createInput(';')
    separator_input.parent('input-form-csv-separator')
    separator_input.attribute('disabled', true)

    input_name_settings = new LineSettings('name', 315, 301)
    input_quota_settings = new LineSettings('quota', 315, 347)
    input_role_settings = new LineSettings('role', 315, 394)
    input_team_settings = new LineSettings('team', 912, 432)

    global_color_picker = createColorPicker('#FFFFFF')
    global_color_picker.parent('input-form-global-color')
    global_color_picker.input(updateLineSettings)

    global_size_slider = createSlider(0, 100, 30)
    global_size_slider.input(updateLineSettings)
    global_size_slider.parent('input-form-global-size')

    global_bold_checkbox = createCheckbox()
    global_bold_checkbox.changed(updateLineSettings)
    global_bold_checkbox.parent('input-form-global-bold')
    
    global_italic_checkbox = createCheckbox()
    global_italic_checkbox.changed(updateLineSettings)
    global_italic_checkbox.parent('input-form-global-italic')

    setDefaultFormValue();
}

function setDefaultFormValue() {
    input_name_settings.setBold(true);
    input_role_settings.setItalic(true);
    input_team_settings.setColor("#2b309b")
}

function updateLineSettings() {
    input_name_settings.setSize(global_size_slider.value())    
    input_name_settings.setColor(global_color_picker.value())
    input_name_settings.setBold(global_bold_checkbox.checked())
    input_name_settings.setItalic(global_italic_checkbox.checked())
    
    input_quota_settings.setSize(global_size_slider.value())
    input_quota_settings.setColor(global_color_picker.value())
    input_quota_settings.setBold(global_bold_checkbox.checked())
    input_quota_settings.setItalic(global_italic_checkbox.checked())
    
    input_role_settings.setSize(global_size_slider.value())
    input_role_settings.setColor(global_color_picker.value())
    input_role_settings.setBold(global_bold_checkbox.checked())
    input_role_settings.setItalic(global_italic_checkbox.checked())
  
    input_team_settings.setSize(global_size_slider.value())
    input_team_settings.setColor(global_color_picker.value())
    input_team_settings.setBold(global_bold_checkbox.checked())
    input_team_settings.setItalic(global_italic_checkbox.checked())

    let global_size_value = document.getElementById('input-form-global-size-value')
    global_size_value.innerText =' [' +  global_size_slider.value() + '] '
}

function draw() {
    renderPreview()
}

function renderPreview() {

    if (template) {
        image(template, 0, 0, TEMPLATE_WIDTH/SCALING_FACTOR, TEMPLATE_HEIGHT/SCALING_FACTOR);
    }

    if (previewItem) {
        renderPreviewItem(previewItem)
    }
}

function handleTemplateFile(file) {
    if (file.type === 'image') {
        template = createImg(file.data, '');
        createCanva(TEMPLATE_WIDTH, TEMPLATE_HEIGHT)
        template.hide();
        separator_input.removeAttribute('disabled')
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
    action.name = 'download-people'
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

function csvToArray(str) {

    delimiter = separator_input.value()
    alert(delimiter + ' will be used as CSV separator')
        
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        const el = headers.reduce(function (object, header, index) {
            object[header.trim()] = values[index];
            return object;
        }, {});
        return el;
    });
    return arr;
}

function renderPreviewItem() {
    textAlign(CENTER)
    renderLine(previewItem.Prenom + ' ' + previewItem.Nom, input_name_settings)
    renderLine(previewItem.Quota, input_quota_settings)
    renderLine(previewItem.Role, input_role_settings)
    renderLine(previewItem.Equipe, input_team_settings)
}

function renderLine(text_value, line_settings) {
    fill(line_settings.color())
    textStyle(line_settings.style())
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

    people_link = document.getElementsByName('download-people')

    alert(people_link.length)
    noLoop()
    people_link.forEach(link => {
        redraw()
        link.click()
    })
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