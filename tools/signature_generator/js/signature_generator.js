
function inject_data(input_id, container_id) {
    input_data = document.getElementById(input_id).value
    container_data = document.getElementById(container_id)
    container_data.innerHTML = input_data
}

function generate_signature() {
    template = document.getElementById('sign-template')
    inject_data('input-division', 'division')
    inject_data('input-name', 'names')
    inject_data('input-number', 'numbers')

    document.getElementById("copy-button").style.display = 'block'
}

function copy_signature() {
    let copy_button = document.getElementById("copy-button")

    copy_button.setAttribute('aria-busy', true)
    copy_button.innerHTML = ''
    
    setTimeout(function () {
        let template = document.getElementById('sign-template')
        navigator.clipboard.writeText(template.innerHTML);
        copy_button.setAttribute('aria-busy', false)
        copy_button.innerHTML = '<i class="fa-solid fa-clipboard"></i> &nbsp; COPIED !'
    }, 2000);
    
    setTimeout(function () {
        copy_button.innerHTML = '<i class="fa-solid fa-clipboard"></i> &nbsp; COPY !'
    }, 7000);
}