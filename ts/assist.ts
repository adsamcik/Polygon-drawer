var changed = false;

function IsValidInt(inputField: HTMLInputElement) {
    if (inputField.value.trim() == "" || !parseInt(inputField.value)) {
        inputField.className += ' invalid';
        return false;
    } else {
        inputField.className = inputField.className.replace(' invalid', '');
        return true;
    }
};

function IsValid(inputField: HTMLInputElement) {
    if (inputField.value.trim() == "") {
        inputField.className += ' invalid';
        return false;
    } else {
        inputField.className = inputField.className.replace(' invalid', '');
        return true;
    }
};