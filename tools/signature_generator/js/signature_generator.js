
function inject_data(input_id, container_id, default_value) {
    input_data = document.getElementById(input_id).value
    
    if (input_data.length == 0)
        input_data = default_value

    container_data = document.getElementById(container_id)
    container_data.innerHTML = input_data
}

function add_to_clipboard(container_node) {

    function listener(e) {
        e.clipboardData.setData("text/html", container_node.innerHTML);
        e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
}

function copy_signature() {
    let copy_button = document.getElementById("copy-button")

    copy_button.setAttribute('aria-busy', true)
    copy_button.innerHTML = ''

    setTimeout(function () {
        let template = document.getElementById('sign-template')
        add_to_clipboard(template)
        copy_button.setAttribute('aria-busy', false)
        copy_button.innerHTML = '<i class="fa-solid fa-clipboard-check"></i> &nbsp; COPIÉ !'
    }, 2000);
    
    setTimeout(function () {
        copy_button.innerHTML = '<i class="fa-solid fa-clipboard"></i> &nbsp; COPIER'
    }, 5000);
}